import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';

export default function PostCard({ post, isCompact = false }) {
  const categoryColors = {
    technology: 'bg-blue-100 text-blue-800',
    business: 'bg-green-100 text-green-800',
    health: 'bg-red-100 text-red-800',
    design: 'bg-purple-100 text-purple-800',
    sustainability: 'bg-teal-100 text-teal-800',
    'renewable energy': 'bg-amber-100 text-amber-800',
    environment: 'bg-emerald-100 text-emerald-800',
    policy: 'bg-indigo-100 text-indigo-800',
    science: 'bg-cyan-100 text-cyan-800',
    default: 'bg-gray-100 text-gray-800'
  };

  const readingTime = Math.ceil(post.content.split(' ').length / 200);
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col ${
      isCompact ? 'border-l-4 border-teal-500' : ''
    }`}>
      {/* Thumbnail */}
      <Link to={`/post/${post.slug}`} className="block aspect-w-16 aspect-h-9">
        <img
          src={post.image || '/default-thumbnail.jpg'}
          alt={post.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category Badge */}
        <div className="mb-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            categoryColors[post.category.toLowerCase()] || categoryColors.default
          }`}>
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-bold mb-2 line-clamp-2 ${
          isCompact ? 'text-lg' : 'text-xl'
        }`}>
          <Link to={`/post/${post.slug}`} className="hover:text-teal-600 transition-colors">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-2 flex-1">
          {post.excerpt || post.content.substring(0, 120) + '...'}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
          <span className="font-medium">{post.author}</span>
          <div className="flex items-center space-x-3">
            <span>{formattedDate}</span>
            <span className="flex items-center space-x-1">
              <FiEye className="text-gray-400" />
              <span>{post.views || 0}</span>
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