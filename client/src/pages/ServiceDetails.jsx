import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { Button } from 'flowbite-react';
//import axios from 'axios';

export default function ServiceDetails() {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`/api/services/${serviceId}`);
        setService(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch service');
        console.error('Error fetching service:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500 text-center p-4">
        {error}
        <Link to="/services" className="block mt-4">
          <Button gradientDuoTone="tealToLime">
            Back to Services
          </Button>
        </Link>
      </div>
    </div>
  );

  if (!service) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-4">
        Service not found
        <Link to="/services" className="block mt-4">
          <Button gradientDuoTone="tealToLime">
            Back to Services
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/services">
          <Button outline gradientDuoTone="tealToLime" className="mb-6">
            <HiOutlineArrowLeft className="mr-2" /> Back to Services
          </Button>
        </Link>

        <div className="bg-white rounded-xl shadow-md p-8 border border-teal-100">
          <div className="flex justify-center text-5xl mb-4">
            {service.icon || '📄'}
          </div>
          <h1 className="text-3xl font-bold text-teal-800 text-center mb-4">
            {service.title}
          </h1>
          <p className="text-gray-600 text-center mb-6">
            {service.description}
          </p>

          {service.fullDescription && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-teal-700 mb-3">
                Detailed Overview
              </h2>
              <p className="text-gray-700 mb-6">
                {service.fullDescription}
              </p>
            </div>
          )}

          {service.features?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-teal-700 mb-3">
                Key Benefits
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-8">
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-center">
            <Button gradientDuoTone="tealToLime" size="lg">
              Request Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}