import React, { useState, useEffect } from 'react';
import { Button, Badge, Spinner, Alert } from 'flowbite-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';

const Services = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get('/api/services');
        setServices(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
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
    { id: 'all', name: 'All Services', icon: '🌐' },
    { id: 'assessments', name: 'Assessments', icon: '📊' },
    { id: 'compliance', name: 'Compliance', icon: '✅' },
    { id: 'safeguards', name: 'Safeguards', icon: '🛡️' },
    { id: 'planning', name: 'Planning', icon: '🗺️' },
    { id: 'sustainability', name: 'Sustainability', icon: '♻️' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="xl" aria-label="Loading services..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Alert color="failure" className="max-w-md mx-4">
          <span className="font-medium">Error loading services:</span> {error}
          <Button 
            gradientDuoTone="tealToLime" 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <Badge color="success" className="mb-4 mx-auto text-sm font-semibold">
            OUR SERVICES
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-teal-800 dark:text-teal-300 mb-4">
            Environmental Impact Solutions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Helping your project move forward—the right way. Comprehensive environmental services to ensure compliance and sustainability.
          </p>
        </div>

        {/* Category Filtering */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <Button
              key={category.id}
              color={activeTab === category.id ? 'success' : 'gray'}
              onClick={() => setActiveTab(category.id)}
              pill
              size="lg"
              className="flex items-center gap-2"
            >
              <span className="text-lg">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredServices.map(service => (
              <ServiceCard 
                key={service._id} 
                service={service}
                onClick={() => window.location.href = `/services/${service._id}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              No services found in this category
            </p>
            <Button 
              color="light" 
              onClick={() => setActiveTab('all')}
            >
              View All Services
            </Button>
          </div>
        )}

        {/* Custom Solutions CTA */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl p-8 md:p-12 text-center text-white shadow-lg">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Need Custom Environmental Solutions?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              We tailor our services to meet your project's specific requirements and regulatory needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                gradientDuoTone="tealToLime" 
                size="lg"
                as={Link}
                to="/contact"
                className="min-w-[200px]"
              >
                Get a Quote
              </Button>
              <Button 
                outline 
                color="light"
                size="lg"
                as={Link}
                to="/projects"
                className="min-w-[200px]"
              >
                View Case Studies
              </Button>
            </div>
          </div>
        </div>

        {/* Back to Top (for long pages) */}
        <div className="text-center mt-12">
          <Button 
            color="light" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to Top
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Services;