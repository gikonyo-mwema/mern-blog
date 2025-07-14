import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
        <div className="max-w-md bg-red-100 dark:bg-red-900/10 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-4">
            {error || 'Service Not Found'}
          </h2>
          <Link
            to="/services"
            className="inline-block mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Browse All Services
          </Link>
        </div>
      </section>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title Section */}
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {service.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {service.shortDescription}
        </p>
        <Link
          to="/contact"
          className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow"
        >
          Get Started
        </Link>
      </header>

      {/* Full Description */}
      {service.fullDescription && (
        <section className="prose dark:prose-invert max-w-none mx-auto">
          <div dangerouslySetInnerHTML={{ __html: service.fullDescription }} />
        </section>
      )}

      {/* Benefits Section */}
      {service.benefits?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Why Choose Us for {service.title}?
          </h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {service.benefits.map((benefit, index) => (
              <div
                key={index}
                className="w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
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
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Our {service.title} Projects
          </h2>
          <ul className="space-y-4 max-w-3xl mx-auto">
            {service.examples.map((example, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 mt-1 mr-3 text-indigo-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="text-gray-700 dark:text-gray-300">{example}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ Section */}
      {service.faqs?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {service.faqs.map((faq, index) => (
              <details
                key={index}
                className="border-b border-gray-200 dark:border-gray-700 pb-4 group"
              >
                <summary className="cursor-pointer text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </summary>
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-10 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          Contact us today to discuss your <strong>{service.title}</strong> needs.
        </p>
        <Link
          to="/contact"
          className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md hover:shadow-lg"
        >
          Contact Us
        </Link>
      </section>
    </main>
  );
};

export default ServiceDetail;
