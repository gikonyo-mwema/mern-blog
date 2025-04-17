import React from 'react';
import { Link } from 'react-router-dom';

export default function RightSidebar() {
  // Sample data - replace with actual API calls
  const trendingPosts = [
    { id: 1, title: 'Sustainable Energy Solutions', slug: 'sustainable-energy-solutions', views: 1245 },
    { id: 2, title: 'Green Building Practices', slug: 'green-building-practices', views: 982 },
    { id: 3, title: 'Climate Change Policies', slug: 'climate-change-policies', views: 756 }
  ];

  const popularCategories = [
    { name: 'Sustainability', count: 24 },
    { name: 'Renewable Energy', count: 18 },
    { name: 'Environmental Policy', count: 15 },
    { name: 'Green Technology', count: 12 },
    { name: 'Conservation', count: 9 }
  ];

  return (
    <div className="space-y-8">
      {/* Search Widget */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-3">Search</h3>
        <form className="flex">
          <input
            type="text"
            placeholder="Search articles..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="bg-teal-500 text-white px-4 py-2 rounded-r-lg hover:bg-teal-600 transition-colors"
          >
            Go
          </button>
        </form>
      </div>

      {/* Trending Posts */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-3">Trending Now</h3>
        <ul className="space-y-2">
          {trendingPosts.map(post => (
            <li key={post.id}>
              <Link 
                to={`/post/${post.slug}`} 
                className="flex items-center gap-2 hover:text-teal-500 transition-colors"
              >
                <span className="text-gray-500">{post.views} views</span>
                <span className="flex-1 truncate">{post.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Categories */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-3">Popular Categories</h3>
        <ul className="space-y-2">
          {popularCategories.map(category => (
            <li key={category.name}>
              <Link 
                to={`/category/${category.name.toLowerCase()}`}
                className="flex justify-between items-center hover:text-teal-500 transition-colors"
              >
                <span>{category.name}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                  {category.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-3">Newsletter</h3>
        <p className="text-sm text-gray-600 mb-3">
          Stay updated with our latest articles and news.
        </p>
        <form className="space-y-2">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}