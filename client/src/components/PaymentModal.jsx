import React, { useState } from 'react';
import { Modal, Button, TextInput, Label, Alert, Spinner } from 'flowbite-react';
import { HiOutlineCreditCard, HiOutlinePhone, HiOutlineCheckCircle } from 'react-icons/hi';

const PaymentModal = ({ showModal, setShowModal, course, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (paymentMethod === 'mpesa' && !phoneNumber) {
        throw new Error('Enter a valid M-Pesa phone number.');
      }

      if (paymentMethod === 'card') {
        const { number, expiry, cvv, name } = cardDetails;
        if (!number || !expiry || !cvv || !name) {
          throw new Error('Please complete all card details.');
        }
      }

      // Simulate real payment request (replace with real API call)
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccess(true);
      onPaymentSuccess();

      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
        setPhoneNumber('');
        setCardDetails({ number: '', expiry: '', cvv: '', name: '' });
        setPaymentMethod('mpesa');
      }, 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={showModal} onClose={() => !loading && setShowModal(false)} size="md">
      <Modal.Header>
        {success ? 'Payment Successful' : `Purchase Course: ${course?.title}`}
      </Modal.Header>
      <Modal.Body>
        {success ? (
          <div className="text-center py-6">
            <HiOutlineCheckCircle className="mx-auto h-12 w-12 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold">Thank you!</h3>
            <p>You now have full access to the course.</p>
          </div>
        ) : (
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <Label value="Course Price" />
              <TextInput disabled value={`KES ${course?.price || '0'}`} />
            </div>

            <div>
              <Label htmlFor="paymentMethod" value="Select Payment Method" />
              <select
                id="paymentMethod"
                className="w-full border rounded-md px-2 py-1"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                disabled={loading}
              >
                <option value="mpesa">M-Pesa</option>
                <option value="card">Credit/Debit Card</option>
              </select>
            </div>

            {paymentMethod === 'mpesa' && (
              <div>
                <Label htmlFor="mpesaPhone" value="M-Pesa Phone Number" />
                <TextInput
                  id="mpesaPhone"
                  icon={HiOutlinePhone}
                  type="tel"
                  placeholder="e.g. 254712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-2">
                <TextInput
                  icon={HiOutlineCreditCard}
                  placeholder="Card Number"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  disabled={loading}
                  required
                />
                <div className="flex gap-2">
                  <TextInput
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    disabled={loading}
                    required
                  />
                  <TextInput
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>
                <TextInput
                  placeholder="Cardholder Name"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>
            )}

            {error && <Alert color="failure">{error}</Alert>}

            <Button
              gradientDuoTone="tealToLime"
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="ml-2">Processing...</span>
                </>
              ) : (
                `Pay KES ${course?.price || '0'}`
              )}
            </Button>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PaymentModal;
