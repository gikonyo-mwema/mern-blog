import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import { getDefaultImageUrl } from '../utils/cloudinary';

export default function PostCard({ post, isCompact = false }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImage, setCurrentImage] = useState(getDefaultImageUrl());
  
  const categoryColors = {
    'climate-change': 'bg-orange-100 text-orange-800',
    'renewable-energy': 'bg-blue-100 text-blue-800',
    'sustainable-agriculture': 'bg-green-100 text-green-800',
    'conservation': 'bg-amber-100 text-amber-800',
    'zero-waste': 'bg-teal-100 text-teal-800',
    'ocean-preservation': 'bg-cyan-100 text-cyan-800',
    'green-tech': 'bg-purple-100 text-purple-800',
    'environmental-policy': 'bg-indigo-100 text-indigo-800',
    'sustainable-architecture': 'bg-emerald-100 text-emerald-800',
    'eco-tourism': 'bg-lime-100 text-lime-800',
    'default': 'bg-gray-100 text-gray-800'
  };

  useEffect(() => {
    // Initialize image source when component mounts or post changes
    if (post?.image) {
      setCurrentImage(post.image);
      setImageLoaded(false);
    } else {
      setCurrentImage(getDefaultImageUrl());
      setImageLoaded(true);
    }
  }, [post]);

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return tmp.textContent || tmp.innerText || '';
  };

  const readingTime = Math.ceil((post?.content || '').split(' ').length / 200);
  const formattedDate = new Date(post?.createdAt || new Date()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const cleanExcerpt = post?.excerpt 
    ? stripHtml(post.excerpt)
    : stripHtml(post?.content || '').substring(0, 120) + '...';

  const handleImageError = () => {
    console.warn('Failed to load image:', currentImage);
    setCurrentImage(getDefaultImageUrl());
    setImageLoaded(true);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col ${
      isCompact ? 'border-l-4 border-teal-500' : ''
    }`}>
      {/* Image Container */}
      <Link 
        to={`/post/${post?.slug || '#'}`} 
        className="block relative overflow-hidden"
        style={{
          aspectRatio: '16/9',
          backgroundColor: imageLoaded ? 'transparent' : '#f3f4f6'
        }}
      >
        {/* Main Image */}
        <img
          src={currentImage}
          alt={post?.title || 'Post image'}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
        />

        {/* Loading Skeleton (shown while image is loading) */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}

        {/* Category Badge */}
        {post?.category && (
          <div className="absolute top-2 right-2 z-10">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              categoryColors[post.category] || categoryColors.default
            } shadow-sm`}>
              {post.category.replace(/-/g, ' ')}
            </span>
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className={`font-bold mb-2 line-clamp-2 ${
          isCompact ? 'text-lg' : 'text-xl'
        }`}>
          <Link 
            to={`/post/${post?.slug || '#'}`} 
            className="hover:text-teal-600 transition-colors"
          >
            {post?.title || 'Untitled Post'}
          </Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2 flex-1">
          {cleanExcerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
          <span className="font-medium">{post?.author || 'Eco Author'}</span>
          <div className="flex items-center space-x-3">
            <span>{formattedDate}</span>
            <span className="flex items-center space-x-1">
              <FiEye className="text-gray-400" />
              <span>{post?.views || 0}</span>
            </span>
            <span className="hidden sm:inline-flex items-center space-x-1">
              <span>•</span>
              <span>{readingTime} min read</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}