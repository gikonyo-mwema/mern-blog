import { Link } from 'react-router-dom';
import { Button, Badge, Tooltip } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';

const ServiceCard = ({ service }) => {
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