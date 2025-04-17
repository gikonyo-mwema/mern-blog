import React from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  // Category colors mapping
  const categoryColors = {
    technology: 'bg-blue-100 text-blue-800',
    business: 'bg-green-100 text-green-800',
    health: 'bg-red-100 text-red-800',
    design: 'bg-purple-100 text-purple-800',
    default: 'bg-gray-100 text-gray-800'
  };

  // Calculate reading time (approx 200 words per minute)
  const words = post.content.split(' ').length;
  const readingTime = Math.ceil(words / 200);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Thumbnail */}
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image || '/default-thumbnail.jpg'}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      </Link>

      {/* Card Content */}
      <div className="p-4">
        {/* Category Badge */}
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          categoryColors[post.category.toLowerCase()] || categoryColors.default
        }`}>
          {post.category}
        </span>

        {/* Title */}
        <h3 className="font-bold text-lg mt-2 mb-1 line-clamp-2">
          <Link to={`/post/${post.slug}`}>{post.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {post.excerpt || post.content.substring(0, 100) + '...'}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{post.author}</span>
          <div className="flex items-center gap-2">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{readingTime} min read</span>
            <span>•</span>
            <span>👁️ {post.views || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}