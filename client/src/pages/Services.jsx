import React, { useState, useEffect, useCallback } from 'react';
import { 
  Button, Badge, Spinner, Alert, Dropdown, 
  TextInput, RangeSlider, Skeleton 
} from 'flowbite-react';
import { 
  HiSearch, HiArrowUp, HiPrinter, 
  HiDownload, HiChevronDown, HiFilter 
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';
import ErrorBoundary from '../components/ErrorBoundary';
import EmptyState from '../components/EmptyState';
import useDebounce from '../hooks/useDebounce';

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
  
  const debouncedSearch = useDebounce(searchQuery, 300);

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

  // Fetch services
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/services');
      setServices(data);
      setFilteredServices(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and sort services
  useEffect(() => {
    if (services.length === 0) return;

    let result = [...services];

    // Category filter
    if (activeTab !== 'all') {
      result = result.filter(service => service.category === activeTab);
    }

    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(service => 
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query)
      );
    }

    // Price filter
    result = result.filter(service => 
      service.price >= priceRange[0] && service.price <= priceRange[1]
    );

    // Sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-high': return b.price - a.price;
        case 'price-low': return a.price - b.price;
        case 'name-asc': return a.title.localeCompare(b.title);
        case 'name-desc': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

    setFilteredServices(result);
    setVisibleCount(6); // Reset visible count when filters change
  }, [services, activeTab, debouncedSearch, priceRange, sortOption]);

  // Initial fetch
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Load more handler
  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  // Print services list
  const printServices = () => {
    const printWindow = window.open('', '_blank');
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
              <h2>${service.title}</h2>
              <p>${service.shortDescription}</p>
              <p class="price">KES ${service.price.toLocaleString()}</p>
            </div>
          `).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  // Download as PDF
  const downloadBrochure = async () => {
    try {
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
    } catch (err) {
      setError('Failed to download brochure');
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-8 w-32 mx-auto mb-4" />
            <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Alert color="failure" className="max-w-md mx-4">
            <span className="font-medium">Error loading services:</span> {error}
            <Button 
              gradientDuoTone="tealToLime" 
              onClick={fetchServices}
              className="mt-4"
            >
              Try Again
            </Button>
          </Alert>
        </div>
      </ErrorBoundary>
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
              <Button color="light" onClick={printServices}>
                <HiPrinter className="mr-2" />
                Print
              </Button>
              <Button color="light" onClick={downloadBrochure}>
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
                  {sortOptions.find(opt => opt.value === sortOption)?.label}
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
                onChange={(e) => setPriceRange([parseInt(e.target.value[0]), parseInt(e.target.value[1])])}
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
                  Load More Services
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No services found"
            description="Try adjusting your filters or search query"
            action={
              <Button color="light" onClick={() => {
                setActiveTab('all');
                setSearchQuery('');
                setPriceRange([0, 100000]);
              }}>
                Reset Filters
              </Button>
            }
          />
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