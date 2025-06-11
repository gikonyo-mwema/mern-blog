import React, { useState, useEffect } from 'react';
import { 
  HiOutlineClipboardCheck, HiOutlineChartBar, HiOutlineShieldCheck,
  HiOutlineDocumentText, HiOutlineUsers, HiOutlineGlobe
} from 'react-icons/hi';
import { Button, Badge } from 'flowbite-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-teal-100 dark:border-gray-700 transition-all hover:shadow-lg dark:hover:shadow-gray-700/50">
      <div className="p-6">
        <div className="flex justify-center text-4xl mb-3 text-teal-600 dark:text-teal-400">
          {service.icon || '📋'}
        </div>
        <h3 className="text-xl font-bold text-teal-800 dark:text-teal-300 mb-3 text-center">
          {service.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
          {service.description}
        </p>
        <div className="mt-6 flex justify-center">
          <Link to={`/service/${service._id}`}>
            <Button outline gradientDuoTone="tealToLime" size="sm">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function Services() {
  const [activeTab, setActiveTab] = useState('all');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/services');
        setServices(res.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = activeTab === 'all' 
    ? services 
    : services.filter(service => service.category === activeTab);

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'assessments', name: 'Assessments' },
    { id: 'compliance', name: 'Compliance' },
    { id: 'safeguards', name: 'Safeguards' },
    { id: 'planning', name: 'Planning' },
    { id: 'sustainability', name: 'Sustainability' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 dark:border-teal-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-red-500 dark:text-red-400 text-center p-4">
          Failed to load services. Please try again later.
          <Button 
            gradientDuoTone="tealToLime" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-teal-700 dark:text-teal-400 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Expert environmental compliance and sustainability solutions.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <Badge
              key={category.id}
              color={activeTab === category.id ? 'success' : 'gray'}
              onClick={() => setActiveTab(category.id)}
              className="cursor-pointer px-4 py-2 rounded-full"
            >
              {category.name}
            </Badge>
          ))}
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredServices.map(service => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No services found in this category</p>
          </div>
        )}

        <div className="bg-teal-700 dark:bg-teal-900 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Need Custom Solutions?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Contact us for tailored environmental consulting services.
          </p>
          <Button gradientDuoTone="tealToLime" size="lg" className="mx-auto">
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}