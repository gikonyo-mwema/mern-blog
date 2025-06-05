import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100 transition-all hover:shadow-lg h-full flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-center text-4xl mb-3">
          {service.icon || '📋'}
        </div>
        <h3 className="text-xl font-bold text-teal-800 mb-3 text-center">
          {service.title}
        </h3>
        <p className="text-gray-600 mb-4 text-center line-clamp-3">
          {service.shortDescription || service.description}
        </p>
      </div>
      <div className="p-4 border-t border-gray-100">
        <Link to={`/services/${service._id}`} className="block w-full">
          <Button outline gradientDuoTone="tealToLime" size="sm" className="w-full">
            Learn More
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;