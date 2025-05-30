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
      {/* Search Widget (commented out but with dark mode support)
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md dark:shadow-gray-900/50">
        <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Search</h3>
        <form className="flex">
          <input
            type="text"
            placeholder="Search articles..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white px-4 py-2 rounded-r-lg transition-colors"
          >
            Go
          </button>
        </form>
      </div>
      */}

      {/* Trending Posts */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md dark:shadow-gray-900/50">
        <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Trending Now</h3>
        <ul className="space-y-2">
          {trendingPosts.map(post => (
            <li key={post.id}>
              <Link 
                to={`/post/${post.slug}`} 
                className="flex items-center gap-2 hover:text-teal-500 dark:hover:text-teal-400 transition-colors text-gray-700 dark:text-gray-300"
              >
                <span className="text-gray-500 dark:text-gray-400">{post.views} views</span>
                <span className="flex-1 truncate">{post.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Categories */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md dark:shadow-gray-900/50">
        <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Popular Categories</h3>
        <ul className="space-y-2">
          {popularCategories.map(category => (
            <li key={category.name}>
              <Link 
                to={`/category/${category.name.toLowerCase()}`}
                className="flex justify-between items-center hover:text-teal-500 dark:hover:text-teal-400 transition-colors text-gray-700 dark:text-gray-300"
              >
                <span>{category.name}</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300">
                  {category.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md dark:shadow-gray-900/50">
        <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Newsletter</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Stay updated with our latest articles and news.
        </p>
        <form className="space-y-2">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white py-2 rounded-lg transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}