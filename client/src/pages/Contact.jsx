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
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold text-center text-gray-900 dark:text-white mb-14">
        Get in Touch
      </h1>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <form className="bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-xl space-y-6">
          {['name', 'email', 'subject'].map((field, index) => (
            <div key={index}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize"
              >
                {field}
              </label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                id={field}
                defaultValue={field === 'subject' ? serviceTitle : ''}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          ))}

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Message
            </label>
            <textarea
              name="message"
              id="message"
              rows={5}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
          >
            Send Message
          </button>
        </form>

        {/* Contact Details */}
        <div className="text-gray-800 dark:text-gray-100 space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <FaPhoneAlt className="text-indigo-600" />
              <span className="text-lg font-medium">+254 708 289 680</span>
            </div>
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-indigo-600" />
              <a
                href="mailto:info@ecodeed.co.ke"
                className="text-lg hover:underline"
              >
                info@ecodeed.co.ke
              </a>
            </div>
            <div className="flex items-center gap-4">
              <FaGlobe className="text-indigo-600" />
              <a
                href="https://www.ecodeed.co.ke"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:underline"
              >
                www.ecodeed.co.ke
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <a
              href="https://calendly.com/ecodeed"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-indigo-600 font-medium hover:underline"
            >
              <FaCalendarAlt className="text-xl" /> Schedule via Calendly
            </a>
            <a
              href="https://zoom.us"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-indigo-600 font-medium hover:underline"
            >
              <FaVideo className="text-xl" /> Schedule Zoom Call
            </a>
          </div>

          <div className="flex items-center gap-6 pt-6">
            <a
              href="https://www.facebook.com/ecodeedcompany/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:scale-110 transition-transform"
            >
              <FaFacebookF size={22} />
            </a>
            <a
              href="https://www.instagram.com/ecodeedcompany/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:scale-110 transition-transform"
            >
              <FaInstagram size={22} />
            </a>
            <a
              href="https://www.linkedin.com/company/ecodeed-consultancy-company"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:scale-110 transition-transform"
            >
              <FaLinkedinIn size={22} />
            </a>
            <a
              href="https://x.com/EcodeedC"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 dark:text-gray-300 hover:scale-110 transition-transform"
            >
              <FaTwitter size={22} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

