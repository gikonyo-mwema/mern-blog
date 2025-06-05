import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Badge, 
  Alert, 
  ListGroup,
  Spinner,
  Tooltip
} from 'flowbite-react';
import { 
  HiPhone, 
  HiMail, 
  HiCalendar, 
  HiShare,
  HiOutlineExternalLink
} from 'react-icons/hi';
import { 
  FaTwitter, 
  FaFacebook, 
  FaLinkedin, 
  FaInstagram, 
  FaYoutube 
} from 'react-icons/fa';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';

const LoadingSpinner = () => (
  <div className="flex justify-center py-12">
    <Spinner size="xl" />
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="flex justify-center py-12">
    <Alert color="failure">
      {message}
      <Button color="gray" onClick={() => window.location.reload()} className="ml-2">
        Try Again
      </Button>
    </Alert>
  </div>
);

const getSocialIcon = (platform) => {
  switch (platform.toLowerCase()) {
    case 'twitter': return <FaTwitter className="w-6 h-6" />;
    case 'facebook': return <FaFacebook className="w-6 h-6" />;
    case 'linkedin': return <FaLinkedin className="w-6 h-6" />;
    case 'instagram': return <FaInstagram className="w-6 h-6" />;
    case 'youtube': return <FaYoutube className="w-6 h-6" />;
    default: return <HiOutlineExternalLink className="w-6 h-6" />;
  }
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
        const res = await axios.get(`/api/services/${id}`);
        setService(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load service');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleBookSession = () => {
    if (service?.calendlyLink) {
      window.open(service.calendlyLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCall = () => {
    if (service?.contactPhone) {
      window.location.href = `tel:${service.contactPhone}`;
    }
  };

  const handleEmail = () => {
    if (service?.contactEmail) {
      window.location.href = `mailto:${service.contactEmail}?subject=Inquiry about ${service.title}`;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!service) return <div className="text-center py-12">Service not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center text-6xl mb-6">
              {service.icon || '📋'}
            </div>
            
            <h1 className="text-3xl font-bold text-teal-800 mb-2 text-center">
              {service.title}
            </h1>
            
            <div className="flex justify-center mb-6">
              <Badge color="info" className="text-sm">
                {service.category}
              </Badge>
              {service.isFeatured && (
                <Badge color="success" className="text-sm ml-2">
                  Featured
                </Badge>
              )}
            </div>

            {service.price !== undefined && service.price > 0 && (
              <div className="text-center text-2xl font-bold text-green-700 mb-6">
                KES {Number(service.price).toLocaleString()}
              </div>
            )}

            <div className="prose max-w-none mb-8">
              {service.fullDescription || service.description}
            </div>

            {service.features?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Key Features</h2>
                <ListGroup>
                  {service.features.map((feature, index) => (
                    <ListGroup.Item key={index} className="flex items-start">
                      <span className="text-teal-500 mr-2">✓</span>
                      {feature}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}

            <div className="bg-teal-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Ready to get started?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.calendlyLink && (
                  <Button 
                    gradientDuoTone="tealToLime" 
                    onClick={handleBookSession}
                    className="flex items-center justify-center"
                  >
                    <HiCalendar className="mr-2" />
                    Book a Session
                  </Button>
                )}
                {service.contactPhone && (
                  <Button 
                    gradientDuoTone="purpleToBlue" 
                    onClick={handleCall}
                    className="flex items-center justify-center"
                  >
                    <HiPhone className="mr-2" />
                    Call Us
                  </Button>
                )}
                {service.contactEmail && (
                  <Button 
                    gradientDuoTone="pinkToOrange" 
                    onClick={handleEmail}
                    className="flex items-center justify-center"
                  >
                    <HiMail className="mr-2" />
                    Email Us
                  </Button>
                )}
                <div className="flex gap-2">
                  <TwitterShareButton url={shareUrl} title={service.title}>
                    <Button 
                      outline 
                      gradientDuoTone="tealToLime"
                      className="flex items-center justify-center flex-1"
                    >
                      <HiShare className="mr-2" />
                      Share
                    </Button>
                  </TwitterShareButton>
                </div>
              </div>
            </div>

            {service.socialLinks?.length > 0 && (
              <div className="flex justify-center space-x-4">
                {service.socialLinks.map((link, index) => (
                  <Tooltip key={index} content={`Follow us on ${link.platform}`}>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-800 transition-colors"
                    >
                      {getSocialIcon(link.platform)}
                    </a>
                  </Tooltip>
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <Link to="/services">
                <Button outline gradientDuoTone="tealToLime">
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}