import React, { useState, useEffect, useCallback } from 'react';
import { 
  Button, Badge, Spinner, Alert, Dropdown, 
  TextInput, RangeSlider 
} from 'flowbite-react';
import { 
  HiSearch, HiArrowUp, HiPrinter, 
  HiDownload, HiChevronDown, HiFilter 
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ServiceCard from '../components/Admin/Services/serviceCard';

const Services = () => {
  // State management
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortOption, setSortOption] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(6);
  
  // Categories data
  const categories = [
    { id: 'all', name: 'All Services', icon: '🌐' },
    { id: 'assessments', name: 'Assessments', icon: '📊' },
    { id: 'compliance', name: 'Compliance', icon: '✅' },
    { id: 'safeguards', name: 'Safeguards', icon: '🛡️' },
    { id: 'planning', name: 'Planning', icon: '🗺️' },
    { id: 'sustainability', name: 'Sustainability', icon: '♻️' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price (High to Low)' },
    { value: 'price-low', label: 'Price (Low to High)' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' }
  ];

  // Fetch services with improved error handling
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/services');
      
      // Handle both possible response formats
      let servicesData = [];
      if (Array.isArray(response.data)) {
        // If backend returns direct array
        servicesData = response.data;
      } else if (response.data?.data?.services && Array.isArray(response.data.data.services)) {
        // If backend returns wrapped response
        servicesData = response.data.data.services;
      } else {
        throw new Error('Invalid data format received from server');
      }

      // Validate each service item
      const validatedData = servicesData.map(service => ({
        _id: service._id || Math.random().toString(36).substr(2, 9),
        title: service.title || 'Untitled Service',
        description: service.description || '',
        shortDescription: service.shortDescription || service.description?.substring(0, 100) || '',
        category: service.category || 'uncategorized',
        price: Number(service.price) || 0,
        createdAt: service.createdAt || new Date().toISOString(),
        image: service.image || '/images/service-placeholder.jpg'
      }));

      setServices(validatedData);
      setFilteredServices(validatedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load services');
      setServices([]);
      setFilteredServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and sort services with safety checks
  useEffect(() => {
    try {
      // Early return if services is not an array or empty
      if (!Array.isArray(services) || services.length === 0) {
        setFilteredServices([]);
        return;
      }

      let result = [...services]; // Safe spread operation

      // Category filter
      if (activeTab !== 'all') {
        result = result.filter(service => 
          service.category && service.category.toLowerCase() === activeTab.toLowerCase()
        );
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        result = result.filter(service => 
          (service.title && service.title.toLowerCase().includes(query)) ||
          (service.description && service.description.toLowerCase().includes(query)) ||
          (service.category && service.category.toLowerCase().includes(query))
        );
      }

      // Price filter
      result = result.filter(service => {
        const price = Number(service.price) || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      });

      // Sorting with fallbacks
      result.sort((a, b) => {
        const aTitle = a.title || '';
        const bTitle = b.title || '';
        const aPrice = Number(a.price) || 0;
        const bPrice = Number(b.price) || 0;
        const aDate = new Date(a.createdAt || 0);
        const bDate = new Date(b.createdAt || 0);

        switch (sortOption) {
          case 'newest': return bDate - aDate;
          case 'oldest': return aDate - bDate;
          case 'price-high': return bPrice - aPrice;
          case 'price-low': return aPrice - bPrice;
          case 'name-asc': return aTitle.localeCompare(bTitle);
          case 'name-desc': return bTitle.localeCompare(aTitle);
          default: return 0;
        }
      });

      setFilteredServices(result);
      setVisibleCount(6);
    } catch (err) {
      console.error('Error filtering services:', err);
      setError('Error processing services data');
      setFilteredServices([]);
    }
  }, [services, activeTab, searchQuery, priceRange, sortOption]);

  // Initial fetch
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Load more handler
  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, filteredServices.length));
  };

  // Print services list
  const printServices = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>Our Services</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #047857; }
              .service { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
              .price { font-weight: bold; color: #065f46; }
            </style>
          </head>
          <body>
            <h1>Our Services</h1>
            ${filteredServices.slice(0, visibleCount).map(service => `
              <div class="service">
                <h2>${service.title || 'Untitled Service'}</h2>
                <p>${service.shortDescription || ''}</p>
                <p class="price">KES ${(service.price || 0).toLocaleString()}</p>
              </div>
            `).join('')}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
    } catch (err) {
      console.error('Error printing services:', err);
      setError('Failed to generate print preview');
    }
  };

  // Download as PDF
  const downloadBrochure = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/services/brochure', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ecodeed-services-brochure.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setLoading(false);
    } catch (err) {
      console.error('Error downloading brochure:', err);
      setError('Failed to download brochure');
      setLoading(false);
    }
  };

  // Loading state with Spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Spinner size="xl" className="mx-auto" />
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Alert color="failure" className="max-w-md mx-4">
          <span className="font-medium">Error:</span> {error}
          <Button 
            gradientDuoTone="tealToLime" 
            onClick={fetchServices}
            className="mt-4"
          >
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge color="success" className="mb-4 mx-auto text-sm font-semibold">
            OUR SERVICES
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-teal-800 dark:text-teal-300 mb-4">
            Environmental Impact Solutions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Helping your project move forward—the right way.
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="mb-12 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  color={activeTab === category.id ? 'success' : 'gray'}
                  onClick={() => setActiveTab(category.id)}
                  pill
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <span className="text-lg">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button color="light" onClick={printServices} disabled={filteredServices.length === 0}>
                <HiPrinter className="mr-2" />
                Print
              </Button>
              <Button color="light" onClick={downloadBrochure} disabled={loading}>
                <HiDownload className="mr-2" />
                Brochure
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput
              icon={HiSearch}
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Dropdown
              label={
                <>
                  <HiFilter className="mr-2" />
                  {sortOptions.find(opt => opt.value === sortOption)?.label || 'Sort By'}
                </>
              }
              placement="bottom-start"
            >
              {sortOptions.map(option => (
                <Dropdown.Item 
                  key={option.value}
                  onClick={() => setSortOption(option.value)}
                >
                  {option.label}
                </Dropdown.Item>
              ))}
            </Dropdown>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price Range: KES {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
              </label>
              <RangeSlider
                min={0}
                max={100000}
                step={1000}
                value={priceRange}
                onChange={(e) => setPriceRange([
                  parseInt(e.target.value[0] || 0), 
                  parseInt(e.target.value[1] || 100000)
                ])}
              />
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {filteredServices.slice(0, visibleCount).map(service => (
                <ServiceCard 
                  key={service._id} 
                  service={service}
                  hoverEffect
                  className="h-full transition-all hover:scale-[1.02] hover:shadow-xl"
                />
              ))}
            </div>

            {visibleCount < filteredServices.length && (
              <div className="text-center mt-8">
                <Button 
                  gradientDuoTone="tealToLime"
                  onClick={loadMore}
                  className="mx-auto"
                >
                  Load More Services ({filteredServices.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No services found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {services.length === 0 ? 
                'No services available' : 
                'Try adjusting your filters or search query'}
            </p>
            <Button color="light" onClick={() => {
              setActiveTab('all');
              setSearchQuery('');
              setPriceRange([0, 100000]);
              setSortOption('newest');
            }}>
              Reset Filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl p-8 md:p-12 text-center text-white shadow-lg mt-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Need Custom Environmental Solutions?
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                gradientDuoTone="tealToLime" 
                size="lg"
                as={Link}
                to="/contact"
                className="min-w-[200px]"
              >
                Get a Quote
              </Button>
              <Button 
                outline 
                color="light"
                size="lg"
                as={Link}
                to="/projects"
                className="min-w-[200px]"
              >
                View Case Studies
              </Button>
            </div>
          </div>
        </div>

        {/* Back to Top */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            pill
            color="light"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
          >
            <HiArrowUp className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Services;