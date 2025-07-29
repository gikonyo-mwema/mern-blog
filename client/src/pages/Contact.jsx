import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaCalendarAlt,
  FaVideo,
} from "react-icons/fa";

// Configure axios instance with base URL
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? process.env.BACKEND_URL 
    : process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

const Contact = () => {
  const location = useLocation();
  const { theme } = useSelector((state) => state.theme);
  const serviceTitle = location.state?.serviceTitle || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: serviceTitle,
    message: "",
  });
  const [status, setStatus] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ message: "", type: "" });

    try {
      const response = await api.post("/api/messages", formData);
      setStatus({
        message: "Your message has been sent successfully! We'll contact you soon.",
        type: "success"
      });
      setFormData({
        name: "",
        email: "",
        subject: serviceTitle || "",
        message: ""
      });
    } catch (error) {
      console.error('Message submission error:', error);
      setStatus({
        message: error.response?.data?.message || 
          `We couldn't send your message. Please try again or contact us directly at contact@ecodeed.co.ke (Error: ${error.message})`,
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logo based on theme
  const logoUrl = theme === "light"
    ? "https://res.cloudinary.com/dcrubaesi/image/upload/v1753007363/ECODEED_BLACK_LOGO_xtwjoy.png"
    : "https://res.cloudinary.com/dcrubaesi/image/upload/v1737333837/ECODEED_COLORED_LOGO_wj2yy8.png";

  // Styling classes based on theme
  const cardClass = theme === "light"
    ? "bg-white text-gray-800 shadow-lg"
    : "bg-gray-800 text-gray-200 shadow-xl";

  const inputClass = theme === "light"
    ? "bg-white border-gray-300 focus:ring-brand-green focus:border-brand-green"
    : "bg-gray-700 border-gray-600 focus:ring-brand-yellow focus:border-brand-yellow";

  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-gray-50" : "bg-brand-blue"}`}>
      {/* Branding Header */}
      <div className={`py-6 px-4 ${theme === "light" ? "bg-white shadow-sm" : "bg-brand-blue"}`}>
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="flex items-center">
            <img src={logoUrl} alt="Ecodeed Logo" className="h-16 w-16 mr-3" />
            <h2 className={`text-2xl font-bold ${theme === "light" ? "text-brand-blue" : "text-white"}`}>
              Ecodeed Consultancy
            </h2>
          </div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === "light" ? "text-brand-blue" : "text-brand-yellow"}`}>
            Get in Touch
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
            Have questions about our services or courses? Reach out to our team and we'll get back to you promptly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className={`p-6 sm:p-8 rounded-2xl ${cardClass} space-y-6`}>
            <h3 className="text-2xl font-semibold text-brand-blue">
              Send us a message
            </h3>

            {status.message && (
              <div className={`p-3 rounded-lg ${status.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {status.message}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 transition`}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 transition`}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 transition`}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass} focus:outline-none focus:ring-2 transition`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg bg-brand-green hover:bg-green-700 text-white font-semibold transition-colors shadow-md ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>

          {/* Contact Details */}
          <div className={`p-6 sm:p-8 rounded-2xl ${cardClass}`}>
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
                    <p className="font-medium">Phone</p>
                    <a
                      href="tel:+254708289680"
                      className="hover:underline"
                    >
                      +254 708 289 680
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaEnvelope className="mt-1 text-brand-green" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href="mailto:contact@ecodeed.co.ke"
                      className="hover:underline"
                    >
                      contact@ecodeed.co.ke
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FaGlobe className="mt-1 text-brand-green" />
                  <div>
                    <p className="font-medium">Website</p>
                    <a
                      href="https://www.ecodeed.co.ke"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
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
                  href="https://calendly.com/talk-to-miriam"
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
                <div className="flex items-center gap-4">
                  {[
                    { icon: FaFacebookF, url: "https://www.facebook.com/ecodeedcompany/", color: "bg-blue-600" },
                    { icon: FaInstagram, url: "https://www.instagram.com/ecodeedcompany/", color: "bg-gradient-to-r from-pink-500 to-purple-500" },
                    { icon: FaLinkedinIn, url: "https://www.linkedin.com/company/ecodeed-consultancy-company", color: "bg-blue-700" },
                    { icon: FaTwitter, url: "https://x.com/EcodeedC", color: "bg-gray-800" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-full text-white hover:scale-110 transition-transform ${social.color}`}
                      aria-label={social.icon.name.replace("Fa", "")}
                    >
                      <social.icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;