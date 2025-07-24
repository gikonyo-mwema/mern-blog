import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  FiCheckCircle,
  FiChevronDown,
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiDollarSign
} from 'react-icons/fi';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`/api/services/${id}`);
        setService(response.data);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Unable to load the service. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
        <div className="max-w-md bg-red-100 dark:bg-red-900/10 rounded-lg p-8 border border-red-200 dark:border-red-800 shadow-lg">
          <svg 
            className="mx-auto h-12 w-12 text-red-500 dark:text-red-400 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-4">
            {error || 'Service Not Found'}
          </h2>
          <Link
            to="/services"
            className="inline-flex items-center mt-4 px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-green transition-colors duration-300 font-medium"
          >
            Browse All Services
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Hero Section */}
      <header className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/10 to-brand-green/10 -skew-y-1 -z-10"></div>
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-brand-green uppercase rounded-full bg-brand-green/10 mb-4">
            Professional Service
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-brand-blue dark:text-white mb-4">
            {service.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {service.shortDescription}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-brand-blue text-white rounded-lg hover:bg-brand-green transition-colors duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              Get Started
              <FiArrowRight className="ml-2" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-8 py-3 border border-brand-blue text-brand-blue dark:text-white rounded-lg hover:bg-brand-blue/5 dark:hover:bg-brand-blue/20 transition-colors duration-300 font-medium"
            >
              View All Services
            </Link>
          </div>
        </div>
      </header>

      {/* Key Features */}
      {service.keyFeatures?.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-brand-blue dark:text-white mb-12">
              Key Features of Our {service.title} Service
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {service.keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 bg-brand-green/10 p-2 rounded-lg mr-4">
                    <FiCheckCircle className="w-6 h-6 text-brand-green" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-blue dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full Description */}
      {service.fullDescription && (
        <section className="max-w-4xl mx-auto">
          <div className="prose dark:prose-invert prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-brand-blue dark:text-white mb-6">
              About Our {service.title} Service
            </h2>
            <div dangerouslySetInnerHTML={{ __html: service.fullDescription }} />
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {service.benefits?.length > 0 && (
        <section>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-brand-blue dark:text-white mb-3">
              Why Choose Our {service.title} Service?
            </h2>
            <div className="w-24 h-1 bg-brand-yellow mx-auto rounded-full"></div>
          </div>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {service.benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-brand-green transition-colors duration-300 group"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-brand-blue/10 dark:bg-brand-green/10 text-brand-blue dark:text-brand-green mb-4 group-hover:bg-brand-yellow/10 group-hover:text-brand-yellow transition-colors duration-300">
                  {benefit.icon === 'time' && <FiClock className="w-6 h-6" />}
                  {benefit.icon === 'cost' && <FiDollarSign className="w-6 h-6" />}
                  {benefit.icon === 'calendar' && <FiCalendar className="w-6 h-6" />}
                  {!benefit.icon && <FiCheckCircle className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-semibold text-brand-blue dark:text-white mb-3 group-hover:text-brand-green dark:group-hover:text-brand-yellow transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Examples Section */}
      {service.examples?.length > 0 && (
        <section className="bg-brand-blue/5 dark:bg-brand-blue/10 rounded-2xl p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-brand-blue dark:text-white mb-8">
              Our {service.title} Projects
            </h2>
            <ul className="space-y-6">
              {service.examples.map((example, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 mt-1 mr-4 text-brand-green">
                    <FiCheckCircle className="w-5 h-5" />
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{example}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {service.faqs?.length > 0 && (
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-brand-blue dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {service.faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                >
                  <h3 className="text-lg font-semibold text-brand-blue dark:text-white">
                    {faq.question}
                  </h3>
                  <FiChevronDown 
                    className={`w-5 h-5 text-brand-blue dark:text-gray-400 transition-transform duration-300 ${activeFaq === index ? 'transform rotate-180' : ''}`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-blue to-brand-green rounded-2xl p-10 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            Ready to get started with {service.title}?
          </h2>
          <p className="mb-8 opacity-90">
            Contact us today to discuss how we can help with your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-brand-blue rounded-lg hover:bg-gray-100 transition-colors duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              Contact Us
              <FiArrowRight className="ml-2" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition-colors duration-300 font-medium"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServiceDetail;
