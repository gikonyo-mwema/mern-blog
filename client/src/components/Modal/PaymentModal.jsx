import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, TextInput, Label, Alert, Spinner } from 'flowbite-react';
import { HiOutlineCreditCard, HiOutlineCheck, HiOutlineX, HiDeviceMobile, HiCreditCard } from 'react-icons/hi';
import axios from 'axios';

// PaymentModal component handles payment for an item (course, etc.)
export function PaymentModal({ 
    showModal, 
    setShowModal, 
    item, 
    itemType = 'course',
    onPaymentSuccess 
}) {
    // State variables for form fields and UI state
    const [paymentType, setPaymentType] = useState('mpesa'); // 'mpesa' or 'card'
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [paymentStatus, setPaymentStatus] = useState(''); // 'pending', 'completed', 'failed'
    const [iframeUrl, setIframeUrl] = useState('');

    // Determine payment provider based on payment type
    const paymentMethod = paymentType === 'mpesa' ? 'pesapal' : 'flutterwave';

    // Pre-fill user data from localStorage when modal opens
    useEffect(() => {
        if (showModal) {
            const user = JSON.parse(localStorage.getItem('user')) || {};
            setEmail(user.email || '');
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setPhoneNumber(user.phone || '');
        }
    }, [showModal]);

    // Handle payment form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Validate required fields
            if (!email || !firstName || !lastName) {
                throw new Error('Please fill in all required fields');
            }

            if (paymentType === 'mpesa' && !phoneNumber) {
                throw new Error('Phone number is required for M-Pesa payments');
            }

            // Prepare payment data for API
            const paymentData = {
                itemId: item._id,
                itemType,
                amount: item.price,
                currency: 'KES',
                paymentMethod,
                paymentType,
                customer: {
                    email,
                    firstName,
                    lastName,
                    phoneNumber
                }
            };

            // Initiate payment via backend API
            const response = await axios.post(
                `/api/payments/${paymentMethod}/initiate`, 
                paymentData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            // Handle payment gateway redirect URL
            if (response.data.redirectUrl) {
                setIframeUrl(response.data.redirectUrl);
                setPaymentStatus('pending');
                
                // For Flutterwave card payments, open payment page in new tab
                if (paymentMethod === 'flutterwave') {
                    window.open(response.data.redirectUrl, '_blank');
                }
            } else {
                throw new Error('Failed to get payment URL');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Payment initiation failed');
        } finally {
            setLoading(false);
        }
    };

    // Check payment status from backend
    const checkPaymentStatus = async () => {
        try {
            const response = await axios.get(`/api/payments/status/${item._id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Update UI based on payment status
            if (response.data.status === 'completed') {
                setPaymentStatus('completed');
                setSuccess('Payment completed successfully!');
                if (onPaymentSuccess) onPaymentSuccess();
            } else if (response.data.status === 'failed') {
                setPaymentStatus('failed');
                setError('Payment failed. Please try again.');
            }
        } catch (err) {
            console.error('Error checking payment status:', err);
        }
    };

    // Poll for payment status if payment is pending
    useEffect(() => {
        let interval;
        if (paymentStatus === 'pending') {
            interval = setInterval(checkPaymentStatus, 5000); // Check every 5 seconds
        }
        return () => clearInterval(interval);
    }, [paymentStatus]);

    // Reset modal state to initial values
    const resetModal = () => {
        setPaymentType('mpesa');
        setPhoneNumber('');
        setEmail('');
        setFirstName('');
        setLastName('');
        setLoading(false);
        setError('');
        setSuccess('');
        setPaymentStatus('');
        setIframeUrl('');
    };

    // Handle closing the modal and reset after short delay
    const handleClose = () => {
        setShowModal(false);
        setTimeout(resetModal, 300);
    };

    return (
        <Modal show={showModal} onClose={handleClose} size={iframeUrl ? '7xl' : 'md'}>
            <Modal.Header>
                {/* Modal title changes based on payment status */}
                {paymentStatus === 'pending' ? 'Complete Your Payment' : 
                 paymentStatus === 'completed' ? 'Payment Successful' : 
                 paymentStatus === 'failed' ? 'Payment Failed' : 
                 `Pay for ${itemType}: ${item.title}`}
            </Modal.Header>
            <Modal.Body>
                {/* Show payment iframe or spinner if payment is pending */}
                {paymentStatus === 'pending' ? (
                    <div className="space-y-4">
                        {iframeUrl && paymentMethod === 'pesapal' ? (
                            <>
                                <p className="text-gray-600">Complete your payment via {paymentMethod === 'pesapal' ? 'PesaPal' : 'Flutterwave'}</p>
                                <div className="h-96">
                                    {/* Embed payment gateway iframe */}
                                    <iframe 
                                        src={iframeUrl} 
                                        className="w-full h-full border rounded-lg"
                                        title="Payment Gateway"
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <Button color="gray" onClick={handleClose}>
                                        I've completed the payment
                                    </Button>
                                </div>
                            </>
                        ) : (
                            // Show spinner while processing payment
                            <div className="text-center py-8">
                                <Spinner size="xl" />
                                <p className="mt-4">Processing your payment request...</p>
                                <p className="text-sm text-gray-500">
                                    {paymentMethod === 'flutterwave' 
                                        ? 'The Flutterwave payment page should have opened in a new tab.' 
                                        : 'Please wait while we prepare your payment.'}
                                </p>
                            </div>
                        )}
                    </div>
                ) : paymentStatus === 'completed' ? (
                    // Show success message if payment completed
                    <div className="text-center py-8">
                        <div className="flex justify-center mb-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <HiOutlineCheck className="h-10 w-10 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
                        <p className="text-gray-600 mb-6">
                            Thank you for your payment. Your {itemType} access will be available shortly.
                        </p>
                        <Button onClick={handleClose} gradientDuoTone="tealToLime">
                            Continue
                        </Button>
                    </div>
                ) : paymentStatus === 'failed' ? (
                    // Show error message if payment failed
                    <div className="text-center py-8">
                        <div className="flex justify-center mb-4">
                            <div className="bg-red-100 p-3 rounded-full">
                                <HiOutlineX className="h-10 w-10 text-red-600" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h3>
                        <p className="text-gray-600 mb-6">
                            We couldn't process your payment. Please try again or contact support.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => setPaymentStatus('')} gradientDuoTone="tealToLime">
                                Try Again
                            </Button>
                            <Button onClick={handleClose} color="gray">
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Show payment form if no payment in progress
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Show error alert if any */}
                        {error && (
                            <Alert color="failure">
                                {error}
                            </Alert>
                        )}

                        {/* Payment method selection */}
                        <div>
                            <Label htmlFor="paymentType" value="Payment Method" />
                            <Select
                                id="paymentType"
                                value={paymentType}
                                onChange={(e) => setPaymentType(e.target.value)}
                                required
                            >
                                <option value="mpesa">
                                    <HiDeviceMobile className="inline mr-2" />
                                    M-Pesa (via PesaPal)
                                </option>
                                <option value="card">
                                    <HiCreditCard className="inline mr-2" />
                                    Credit/Debit Card (via Flutterwave)
                                </option>
                            </Select>
                            <p className="mt-1 text-sm text-gray-500">
                                {paymentType === 'mpesa' 
                                    ? 'You will receive an M-Pesa push notification' 
                                    : 'Secure card payment processed by Flutterwave'}
                            </p>
                        </div>

                        {/* User name fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName" value="First Name" />
                                <TextInput
                                    id="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastName" value="Last Name" />
                                <TextInput
                                    id="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email field */}
                        <div>
                            <Label htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Phone number field for M-Pesa */}
                        {paymentType === 'mpesa' && (
                            <div>
                                <Label htmlFor="phoneNumber" value="M-Pesa Phone Number" />
                                <TextInput
                                    id="phoneNumber"
                                    type="tel"
                                    placeholder="e.g. 254712345678"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                    addon="+254"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Ensure your phone has sufficient funds and is Safaricom registered
                                </p>
                            </div>
                        )}

                        {/* Payment summary */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between font-semibold">
                                <span>Item:</span>
                                <span>{item.title}</span>
                            </div>
                            <div className="flex justify-between font-semibold mt-2">
                                <span>Amount:</span>
                                <span>KES {item.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                                <span>Payment Processor:</span>
                                <span>
                                    {paymentMethod === 'pesapal' ? 'PesaPal' : 'Flutterwave'}
                                </span>
                            </div>
                        </div>

                        {/* Submit button */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                gradientDuoTone={paymentType === 'mpesa' ? 'purpleToBlue' : 'tealToLime'}
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" className="mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {paymentType === 'mpesa' ? (
                                            <HiDeviceMobile className="mr-2" />
                                        ) : (
                                            <HiCreditCard className="mr-2" />
                                        )}
                                        Pay KES {item.price.toLocaleString()} via{' '}
                                        {paymentMethod === 'pesapal' ? 'M-Pesa' : 'Card'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </Modal.Body>
        </Modal>
    );
}