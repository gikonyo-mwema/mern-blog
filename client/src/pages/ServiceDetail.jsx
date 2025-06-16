import React, { useState, useEffect } from 'react';
import { 
  Button, Badge, Alert, Spinner, Tooltip, 
  Card, ListGroup, Accordion 
} from 'flowbite-react';
import { 
  HiPhone, HiMail, HiCalendar, HiShare,
  HiOutlineExternalLink, HiCheck, HiInformationCircle
} from 'react-icons/hi';
import { 
  FaTwitter, FaFacebook, FaLinkedin, 
  FaInstagram, FaYoutube 
} from 'react-icons/fa';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';

const LoadingSpinner = () => (
  <div className="flex justify-center py-12">
    <Spinner size="xl" aria-label="Loading service..." />
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="flex justify-center py-12">
    <Alert color="failure" className="max-w-md">
      <span className="font-medium">Error loading service:</span> {message}
      <Button color="gray" onClick={() => window.location.reload()} className="ml-2 mt-2">
        Try Again
      </Button>
    </Alert>
  </div>
);

const getSocialIcon = (platform) => {
  const icons = {
    twitter: <FaTwitter className="w-5 h-5" />,
    facebook: <FaFacebook className="w-5 h-5" />,
    linkedin: <FaLinkedin className="w-5 h-5" />,
    instagram: <FaInstagram className="w-5 h-5" />,
    youtube: <FaYoutube className="w-5 h-5" />
  };
  return icons[platform.toLowerCase()] || <HiOutlineExternalLink className="w-5 h-5" />;
};

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(window.location.href);
    const fetchService = async () => {
      try {
        const { data } = await axios.get(`/api/services/${id}`);
        setService(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load service');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleContactAction = (type) => {
    const actions = {
      call: () => window.location.href = `tel:${service.contactPhone}`,
      email: () => window.location.href = `mailto:${service.contactEmail}?subject=Inquiry about ${service.title}`,
      book: () => window.open(service.calendlyLink, '_blank', 'noopener,noreferrer')
    };
    if (service[type]) actions[type]();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!service) return <div className="text-center py-12">Service not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl shadow-lg overflow-hidden text-white">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
              <div className="text-8xl bg-white/20 p-6 rounded-full">
                {service.icon || '📋'}
              </div>
            </div>
            <div className="md:w-2/3 text-center md:text-left">
              <Badge color="light" className="mb-4 w-fit mx-auto md:mx-0">
                {service.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {service.title}
              </h1>
              <p className="text-xl opacity-90 mb-6">
                {service.heroText || 'Professional environmental solutions tailored to your needs'}
              </p>
              {service.price > 0 && (
                <div className="text-2xl font-bold bg-white/10 px-4 py-2 rounded-lg inline-block">
                  KES {service.price.toLocaleString()}
                  {service.priceNote && (
                    <Tooltip content={service.priceNote}>
                      <HiInformationCircle className="ml-2 inline" />
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <Card className="rounded-xl">
          <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300 mb-4">
            About This Service
          </h2>
          <div className="prose prose-teal dark:prose-invert max-w-none">
            {service.introduction || service.fullDescription || service.description}
          </div>
        </Card>

        {/* Process Steps */}
        {service.processSteps?.length > 0 && (
          <Card className="rounded-xl">
            <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300 mb-6">
              Our Process
            </h2>
            <div className="space-y-4">
              {service.processSteps.map((step, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Project Types */}
        {service.projectTypes?.length > 0 && (
          <Card className="rounded-xl">
            <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300 mb-6">
              Supported Project Types
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.projectTypes.map((type, index) => (
                <div key={index} className="flex items-start gap-3">
                  <HiCheck className="text-teal-500 dark:text-teal-400 mt-1 flex-shrink-0" />
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Benefits */}
        {service.benefits?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow h-full">
                <h3 className="text-xl font-semibold text-teal-700 dark:text-teal-300 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <Card className="bg-teal-50 dark:bg-teal-900/30 border-teal-100 dark:border-teal-800 rounded-xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-200 mb-2">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Contact us today to discuss how we can help with your project.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {service.contactPhone && (
                <Button 
                  gradientDuoTone="tealToLime"
                  onClick={() => handleContactAction('call')}
                  className="min-w-[200px]"
                >
                  <HiPhone className="mr-2" />
                  Call Us
                </Button>
              )}
              {service.contactEmail && (
                <Button 
                  gradientDuoTone="purpleToBlue"
                  onClick={() => handleContactAction('email')}
                  className="min-w-[200px]"
                >
                  <HiMail className="mr-2" />
                  Email Us
                </Button>
              )}
              {service.calendlyLink && (
                <Button 
                  gradientDuoTone="pinkToOrange"
                  onClick={() => handleContactAction('book')}
                  className="min-w-[200px]"
                >
                  <HiCalendar className="mr-2" />
                  Book Consultation
                </Button>
              )}
            </div>
          </div>

          {/* Social Sharing */}
          <div className="mt-8 flex flex-col items-center">
            <p className="text-gray-600 dark:text-gray-300 mb-3">Share this service:</p>
            <div className="flex gap-4">
              <TwitterShareButton url={shareUrl} title={service.title}>
                <Button color="light" size="sm">
                  <FaTwitter className="mr-2" />
                  Twitter
                </Button>
              </TwitterShareButton>
              <FacebookShareButton url={shareUrl}>
                <Button color="light" size="sm">
                  <FaFacebook className="mr-2" />
                  Facebook
                </Button>
              </FacebookShareButton>
              <LinkedinShareButton url={shareUrl}>
                <Button color="light" size="sm">
                  <FaLinkedin className="mr-2" />
                  LinkedIn
                </Button>
              </LinkedinShareButton>
            </div>
          </div>
        </Card>

        {/* Back to Services */}
        <div className="text-center">
          <Link to="/services">
            <Button outline gradientDuoTone="tealToLime">
              ← Back to All Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}