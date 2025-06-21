import React, { useState, useEffect } from 'react';
import { 
  Button, Badge, Alert, Spinner, Tooltip, 
  Card, ListGroup, Accordion, Breadcrumb,
  Modal, Carousel
} from 'flowbite-react';
import { 
  HiPhone, HiMail, HiCalendar, HiShare,
  HiOutlineExternalLink, HiCheck, HiInformationCircle,
  HiChevronDown, HiPrinter, HiDownload, HiArrowLeft
} from 'react-icons/hi';
import { 
  FaTwitter, FaFacebook, FaLinkedin, 
  FaInstagram, FaYoutube, FaQuoteLeft
} from 'react-icons/fa';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import ErrorBoundary from '../components/ErrorBoundary';
import StickyCTA from '../components/StickyCTA';
import FAQ from '../components/FAQ';
import RequestQuoteForm from '../components/RequestQuoteForm';

const LoadingSpinner = () => (
  <div className="flex justify-center py-12">
    <Spinner size="xl" aria-label="Loading service..." />
  </div>
);

const ErrorDisplay = ({ message, onRetry }) => (
  <div className="flex justify-center py-12">
    <Alert color="failure" className="max-w-md">
      <span className="font-medium">Error loading service:</span> {message}
      <Button color="gray" onClick={onRetry} className="ml-2 mt-2">
        Try Again
      </Button>
    </Alert>
  </div>
);

const SocialIcon = ({ platform }) => {
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
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // FAQ data (could come from API)
  const faqs = [
    {
      question: "How long does the EIA process take?",
      answer: "The duration varies depending on project complexity, but typically takes 4-8 weeks."
    },
    {
      question: "What documents do I need to provide?",
      answer: "You'll need project plans, site details, and any relevant environmental studies."
    }
  ];

  // Fetch service data
  const fetchService = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`/api/services/${id}`);
      setService(data);
      setShareUrl(window.location.href);

      // Fetch related services
      const relatedRes = await axios.get(`/api/services/related/${data.category}?exclude=${data._id}`);
      setRelatedServices(relatedRes.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load service');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  // Contact actions
  const handleContactAction = (type) => {
    const actions = {
      call: () => window.location.href = `tel:${service.contactInfo?.phone}`,
      email: () => window.location.href = `mailto:${service.contactInfo?.email}?subject=Inquiry about ${service.title}`,
      book: () => window.open(service.contactInfo?.calendlyLink, '_blank', 'noopener,noreferrer')
    };
    if (service.contactInfo?.[type]) actions[type]();
  };

  // Print service page
  const printService = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${service.title} | Ecodeed</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #047857; }
            .section { margin-bottom: 20px; }
            .process-step { display: flex; margin-bottom: 15px; }
            .step-number { 
              background: #047857; 
              color: white; 
              width: 30px; 
              height: 30px; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center;
              margin-right: 10px;
              flex-shrink: 0;
            }
            .benefit { margin-bottom: 15px; }
            .contact { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <h1>${service.title}</h1>
          <div class="section">
            ${service.fullDescription}
          </div>

          ${service.processSteps?.length > 0 ? `
            <div class="section">
              <h2>Our Process</h2>
              ${service.processSteps.map(step => `
                <div class="process-step">
                  <div class="step-number">${step.order}</div>
                  <div>
                    <h3>${step.title}</h3>
                    <p>${step.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${service.benefits?.length > 0 ? `
            <div class="section">
              <h2>Benefits</h2>
              ${service.benefits.map(benefit => `
                <div class="benefit">
                  <h3>${benefit.title}</h3>
                  <p>${benefit.description}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="contact">
            <h2>Contact Us</h2>
            <p>Phone: ${service.contactInfo?.phone || 'N/A'}</p>
            <p>Email: ${service.contactInfo?.email || 'N/A'}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
  };

  // Download as PDF
  const downloadServicePDF = async () => {
    try {
      const response = await axios.get(`/api/services/${id}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ecodeed-${service.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download service details');
    }
  };

  // Loading state
  if (loading) return <LoadingSpinner />;

  // Error state
  if (error) {
    return (
      <ErrorBoundary>
        <ErrorDisplay message={error} onRetry={fetchService} />
      </ErrorBoundary>
    );
  }

  // No service found
  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Service Not Found
          </h2>
          <p className="mb-6">
            The service you're looking for doesn't exist or may have been removed.
          </p>
          <Button gradientDuoTone="tealToLime" onClick={() => navigate('/services')}>
            Browse All Services
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-4 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <div className="max-w-6xl mx-auto mb-6">
        <Breadcrumb aria-label="Breadcrumb">
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/services">Services</Breadcrumb.Item>
          <Breadcrumb.Item>{service.title}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-between gap-4">
          <Button color="light" onClick={() => navigate(-1)}>
            <HiArrowLeft className="mr-2" />
            Back to Services
          </Button>
          <div className="flex gap-2">
            <Button color="light" onClick={printService}>
              <HiPrinter className="mr-2" />
              Print
            </Button>
            <Button color="light" onClick={downloadServicePDF}>
              <HiDownload className="mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

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
          <div 
            className="prose prose-teal dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: service.fullDescription || service.description }}
          />
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
                    {step.order || index + 1}
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
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{benefit.icon || '✅'}</span>
                  <h3 className="text-xl font-semibold text-teal-700 dark:text-teal-300">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* Image Gallery */}
        {service.images?.length > 0 && (
          <Card className="rounded-xl">
            <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300 mb-6">
              Project Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {service.images.map((image, index) => (
                <div 
                  key={index}
                  className="cursor-pointer"
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setShowImageModal(true);
                  }}
                >
                  <img
                    src={image}
                    alt={`${service.title} example ${index + 1}`}
                    className="rounded-lg h-40 w-full object-cover hover:opacity-90 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* FAQ Section */}
        <FAQ 
          items={faqs}
          title="Frequently Asked Questions"
          className="mt-8"
        />

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-300 mb-6">
              Related Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.slice(0, 3).map(service => (
                <Card 
                  key={service._id} 
                  className="hover:shadow-lg transition-shadow h-full"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-3xl">{service.icon || '📋'}</span>
                    <Badge color="success" className="ml-2">
                      {service.category}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-teal-700 dark:text-teal-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                    {service.shortDescription}
                  </p>
                  <Button 
                    gradientDuoTone="tealToLime"
                    as={Link}
                    to={`/services/${service._id}`}
                    className="mt-4"
                  >
                    Learn More
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Sticky CTA (Mobile) */}
        <StickyCTA>
          <div className="flex gap-2 p-2">
            {service.contactInfo?.phone && (
              <Button 
                gradientMonochrome="success"
                onClick={() => handleContactAction('call')}
                size="sm"
                pill
              >
                <HiPhone className="mr-1" />
                Call
              </Button>
            )}
            <Button 
              gradientMonochrome="info"
              onClick={() => setShowQuoteModal(true)}
              size="sm"
              pill
            >
              Get Quote
            </Button>
          </div>
        </StickyCTA>

        {/* Image Modal */}
        <Modal show={showImageModal} onClose={() => setShowImageModal(false)} size="7xl">
          <Modal.Header>{service.title} Gallery</Modal.Header>
          <Modal.Body>
            <Carousel slide={false} activeIndex={currentImageIndex}>
              {service.images.map((image, index) => (
                <img 
                  key={index}
                  src={image}
                  alt={`${service.title} example ${index + 1}`}
                  className="h-[70vh] object-contain"
                />
              ))}
            </Carousel>
          </Modal.Body>
        </Modal>

        {/* Quote Request Modal */}
        <Modal show={showQuoteModal} onClose={() => setShowQuoteModal(false)} size="2xl">
          <Modal.Header>Request a Quote for {service.title}</Modal.Header>
          <Modal.Body>
            <RequestQuoteForm 
              serviceId={service._id}
              serviceName={service.title}
              onSuccess={() => setShowQuoteModal(false)}
            />
          </Modal.Body>
        </Modal>

        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": service.category,
            "name": service.title,
            "description": service.shortDescription,
            "provider": {
              "@type": "Organization",
              "name": "Ecodeed",
              "url": "https://www.ecodeed.co.ke"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Kenya"
            }
          })}
        </script>
      </div>
    </div>
  );
}