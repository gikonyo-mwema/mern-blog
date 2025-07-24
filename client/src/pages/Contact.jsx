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
} from "react-icons/fa";

const Contact = () => {
  const location = useLocation();
  const serviceTitle = location.state?.serviceTitle || '';

  const coloredLogoUrl = "https://res.cloudinary.com/dcrubaesi/image/upload/v1737333837/ECODEED_COLORED_LOGO_wj2yy8.png";

  return (
    <div className="min-h-screen bg-brand-blue">
      {/* Branding Header */}
      <div className="py-6 px-4 bg-brand-blue">
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="flex items-center">
            <img src={coloredLogoUrl} alt="Ecodeed Logo" className="h-16 w-16 mr-3" />
            <h2 className="text-2xl font-bold text-white">
              Ecodeed Consultancy
            </h2>
          </div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-brand-yellow">
            Get in Touch
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-300">
            Have questions about our services or courses? Reach out to our team and we'll get back to you promptly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 md:gap-16">
          {/* Contact Form */}
          <form className="p-8 rounded-2xl shadow-xl space-y-6 bg-white">
            <h3 className="text-2xl font-semibold text-brand-blue">
              Send us a message
            </h3>
            
            {['name', 'email', 'subject'].map((field, index) => (
              <div key={index}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  {field}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  id={field}
                  defaultValue={field === 'subject' ? serviceTitle : ''}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition"
                />
              </div>
            ))}

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Message
              </label>
              <textarea
                name="message"
                id="message"
                rows={5}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-brand-green hover:bg-green-700 text-white font-semibold transition-colors shadow-md"
            >
              Send Message
            </button>
          </form>

          {/* Contact Details */}
          <div className="p-8 rounded-2xl shadow-xl bg-white">
            <h3 className="text-2xl font-semibold mb-6 text-brand-blue">
              Contact Information
            </h3>

            <div className="space-y-8">
              {/* Basic Contact Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-brand-blue">
                  General Inquiries
                </h4>
                <div className="flex items-start gap-4">
                  <FaPhoneAlt className="mt-1 text-brand-green" />
                  <div>
                    <p className="font-medium text-gray-800">Phone</p>
                    <a href="tel:+254708289680" className="text-gray-600 hover:underline">
                      +254 708 289 680
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaEnvelope className="mt-1 text-brand-green" />
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <a
                      href="mailto:info@ecodeed.co.ke"
                      className="text-gray-600 hover:underline"
                    >
                      info@ecodeed.co.ke
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaGlobe className="mt-1 text-brand-green" />
                  <div>
                    <p className="font-medium text-gray-800">Website</p>
                    <a
                      href="https://www.ecodeed.co.ke"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:underline"
                    >
                      www.ecodeed.co.ke
                    </a>
                  </div>
                </div>
              </div>

              {/* Scheduling */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-brand-blue">
                  Schedule a Meeting
                </h4>
                <a
                  href="https://calendly.com/ecodeed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-medium text-brand-green hover:underline"
                >
                  <FaCalendarAlt className="text-xl" /> Schedule via Calendly
                </a>
                <a
                  href="https://zoom.us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-medium text-brand-green hover:underline"
                >
                  <FaVideo className="text-xl" /> Schedule Zoom Call
                </a>
              </div>

              {/* Social Media */}
              <div className="pt-4">
                <h4 className="text-lg font-medium mb-4 text-brand-blue">
                  Connect With Us
                </h4>
                <div className="flex items-center gap-5">
                  <a
                    href="https://www.facebook.com/ecodeedcompany/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-blue-600 text-white hover:scale-110 transition-transform"
                  >
                    <FaFacebookF size={18} />
                  </a>
                  <a
                    href="https://www.instagram.com/ecodeedcompany/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:scale-110 transition-transform"
                  >
                    <FaInstagram size={18} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/ecodeed-consultancy-company"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-blue-700 text-white hover:scale-110 transition-transform"
                  >
                    <FaLinkedinIn size={18} />
                  </a>
                  <a
                    href="https://x.com/EcodeedC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-800 text-white hover:scale-110 transition-transform"
                  >
                    <FaTwitter size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info Footer */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src={coloredLogoUrl} alt="Ecodeed Logo" className="h-10 w-10 mr-3" />
              <span className="text-xl font-semibold text-white">
                Ecodeed Consultancy
              </span>
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Ecodeed Consultancy Company. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
