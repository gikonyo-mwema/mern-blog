import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaCalendarAlt,
  FaVideo
} from 'react-icons/fa';

const Contact = () => {
  const location = useLocation();
  const serviceTitle = location.state?.serviceTitle || '';

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-10">
        Contact Us
      </h1>

      <div className="grid gap-12 md:grid-cols-2">
        {/* Contact Form */}
        <form className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              defaultValue={serviceTitle}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Message
            </label>
            <textarea
              name="message"
              rows={5}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="space-y-6 text-gray-800 dark:text-gray-100">
          <div className="space-y-3">
            <p className="flex items-center gap-3">
              <FaPhoneAlt className="text-indigo-600" />
              +254708289680
            </p>
            <p className="flex items-center gap-3">
              <FaEnvelope className="text-indigo-600" />
              <a href="mailto:info@ecodeed.co.ke">info@ecodeed.co.ke</a>
            </p>
            <p className="flex items-center gap-3">
              <FaGlobe className="text-indigo-600" />
              <a href="https://www.ecodeed.co.ke" target="_blank" rel="noopener noreferrer">
                www.ecodeed.co.ke
              </a>
            </p>
          </div>

          {/* Scheduling */}
          <div className="space-y-4">
            <a
              href="https://calendly.com/ecodeed"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-indigo-600 hover:underline"
            >
              <FaCalendarAlt /> Schedule via Calendly
            </a>
            <a
              href="https://zoom.us"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-indigo-600 hover:underline"
            >
              <FaVideo /> Schedule Zoom Call
            </a>
          </div>

          {/* Social Media */}
          <div className="flex items-center gap-4 pt-4">
            <a
              href="https://www.facebook.com/ecodeedcompany/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://www.instagram.com/ecodeedcompany/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-700"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://www.linkedin.com/company/ecodeed-consultancy-company"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900"
            >
              <FaLinkedinIn size={20} />
            </a>
            <a
              href="https://x.com/EcodeedC"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-700"
            >
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
