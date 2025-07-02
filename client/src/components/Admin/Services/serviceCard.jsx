import { Link } from 'react-router-dom';
import { Button, Badge, Tooltip } from 'flowbite-react';
import { HiInformationCircle, HiMail, HiPhone, HiGlobe, HiCalendar } from 'react-icons/hi';
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';

const ServiceCard = ({ service }) => {
  // Get contact info with fallbacks
  const contactInfo = service.contactInfo || {};
  const { email, phone, website, calendlyLink, socialLinks = [] } = contactInfo;

  // Social platform icons mapping
  const socialIcons = {
    twitter: <FaTwitter className="text-blue-400" />,
    facebook: <FaFacebook className="text-blue-600" />,
    linkedin: <FaLinkedin className="text-blue-700" />,
    instagram: <FaInstagram className="text-pink-600" />,
    youtube: <FaYoutube className="text-red-600" />,
    other: <HiGlobe className="text-gray-500" />
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-teal-100 dark:border-gray-700 transition-all hover:shadow-xl hover:-translate-y-1 h-full flex flex-col group">
      {/* Card Header with Icon */}
      <div className="bg-teal-50 dark:bg-gray-700 p-4 flex justify-center">
        <div className="text-5xl p-4 bg-white dark:bg-gray-800 rounded-full border-2 border-teal-200 dark:border-gray-600 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
          {service.icon || '📋'}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-grow flex flex-col">
        {/* Category Badge */}
        <div className="flex justify-center mb-3">
          <Badge color="info" size="sm" className="w-fit">
            {service.category || 'Service'}
          </Badge>
        </div>

        {/* Title with optional tooltip */}
        <Tooltip content={service.title} animation="duration-500">
          <h3 className="text-xl font-bold text-teal-800 dark:text-teal-300 mb-3 text-center line-clamp-2">
            {service.title}
          </h3>
        </Tooltip>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-center line-clamp-3 flex-grow">
          {service.shortDescription || service.description}
        </p>

        {/* Price Display (conditional) */}
        {service.price > 0 && (
          <div className="text-center mb-4">
            <span className="text-lg font-bold text-teal-700 dark:text-teal-400">
              KES {service.price.toLocaleString()}
            </span>
            {service.priceNote && (
              <Tooltip content={service.priceNote}>
                <HiInformationCircle className="ml-1 inline text-gray-400 hover:text-teal-500 cursor-pointer" />
              </Tooltip>
            )}
          </div>
        )}

        {/* Contact Info (condensed) */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap justify-center gap-3 mb-3">
            {email && (
              <Tooltip content="Email">
                <a href={`mailto:${email}`} className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400">
                  <HiMail className="h-5 w-5" />
                </a>
              </Tooltip>
            )}
            {phone && (
              <Tooltip content="Phone">
                <a href={`tel:${phone}`} className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400">
                  <HiPhone className="h-5 w-5" />
                </a>
              </Tooltip>
            )}
            {website && (
              <Tooltip content="Website">
                <a 
                  href={website.startsWith('http') ? website : `https://${website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
                >
                  <HiGlobe className="h-5 w-5" />
                </a>
              </Tooltip>
            )}
            {calendlyLink && (
              <Tooltip content="Book Appointment">
                <a 
                  href={calendlyLink.startsWith('http') ? calendlyLink : `https://${calendlyLink}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
                >
                  <HiCalendar className="h-5 w-5" />
                </a>
              </Tooltip>
            )}
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex justify-center gap-3">
              {socialLinks.map((link, index) => (
                <Tooltip key={index} content={link.platform}>
                  <a 
                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    {socialIcons[link.platform] || socialIcons.other}
                  </a>
                </Tooltip>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <Link to={`/services/${service._id}`} className="block w-full">
          <Button 
            outline 
            gradientDuoTone="tealToLime" 
            size="md"
            className="w-full group-hover:bg-gradient-to-r group-hover:from-teal-500 group-hover:to-lime-500 group-hover:text-white transition-colors"
          >
            Learn More
            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              &rarr;
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;