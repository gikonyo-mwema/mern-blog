import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import { getDefaultImageUrl } from "../utils/cloudinary";

const defaultProfilePic = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

export default function PostCard({ post, isCompact = false, className = '' }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  
  const categoryColors = {
    'climate-change': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'renewable-energy': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'sustainable-agriculture': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'conservation': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    'zero-waste': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    'ocean-preservation': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    'green-tech': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'environmental-policy': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'sustainable-architecture': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    'eco-tourism': 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
    'default': 'bg-brand-yellow text-brand-blue dark:bg-brand-blue dark:text-brand-yellow'
  };

  useEffect(() => {
    if (post?.image) {
      const img = new Image();
      img.src = post.image;
      img.onload = () => {
        setCurrentImage(post.image);
        setImageLoaded(true);
      };
      img.onerror = () => {
        setCurrentImage(getDefaultImageUrl());
        setImageLoaded(true);
      };
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

  return (
    <div className={`rounded-lg shadow-md overflow-hidden hover:shadow-[0_4px_12px_rgba(5,24,54,0.2)] hover:ring-1 hover:ring-brand-blue transition-all duration-300 h-full flex flex-col bg-white dark:bg-gray-800 dark:shadow-gray-900/50 ${className}`}>
      {/* Image Container */}
      <Link 
        to={`/post/${post?.slug || '#'}`} 
        className="block relative overflow-hidden group"
        style={{
          aspectRatio: '16/9',
          backgroundColor: !imageLoaded ? '#f3f4f6' : 'transparent'
        }}
      >
        {currentImage && (
          <img
            src={currentImage}
            alt={post?.title || 'Post image'}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-105 transition-transform duration-500`}
            loading="lazy"
            onError={() => {
              setCurrentImage(getDefaultImageUrl());
              setImageLoaded(true);
            }}
          />
        )}

        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        )}

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
        } text-gray-900 dark:text-white`}>
          <Link 
            to={`/post/${post?.slug || '#'}`} 
            className="hover:text-brand-green dark:hover:text-brand-green transition-colors"
          >
            {post?.title || 'Untitled Post'}
          </Link>
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-1">
          {cleanExcerpt}
        </p>

        {/* Footer Section */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto whitespace-nowrap overflow-hidden">
          <div className="flex items-center space-x-2 overflow-hidden">
            <Link 
              to={`/user/${post?.userId || ''}`} 
              className="flex items-center space-x-2 hover:underline truncate"
            >
              <img 
                src={post?.authorProfile || defaultProfilePic} 
                alt={post?.author || 'Author'}
                className="w-5 h-5 rounded-full object-cover flex-shrink-0 border border-gray-200 dark:border-gray-600"
                onError={(e) => {
                  e.target.src = defaultProfilePic;
                }}
              />
              <span className="font-medium hover:text-brand-green dark:hover:text-brand-green transition-colors truncate">
                {post?.author || 'Eco Author'}
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="truncate">{formattedDate}</span>
            <FiEye className="text-gray-400 dark:text-gray-500" />
            <span>{post?.views || 0}</span>
            <span className="hidden sm:inline">&bull; {readingTime} min read</span>
          </div>
        </div>
      </div>
    </div>
  );
}
