import React from 'react';
import { Button } from 'flowbite-react';

export default function ServiceCard({ service, onPurchaseClick }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100 transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-center text-4xl mb-3">
          {service.icon || '📋'}
        </div>
        <h3 className="text-xl font-bold text-teal-800 mb-2 text-center">
          {service.title}
        </h3>
        <p className="text-gray-600 mb-4 text-center">
          {service.description || 'No description provided.'}
        </p>
        {service.price !== undefined && (
          <div className="text-center font-bold text-lg text-green-700 mb-4">
            KES {Number(service.price).toLocaleString()}
          </div>
        )}
        {onPurchaseClick && (
          <div className="flex justify-center">
            <Button 
              gradientDuoTone="purpleToBlue" 
              size="sm"
              onClick={onPurchaseClick}
            >
              Buy Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
