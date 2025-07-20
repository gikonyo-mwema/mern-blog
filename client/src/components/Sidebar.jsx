import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from 'flowbite-react';

export default function Sidebar() {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState({
    trending: true,
    categories: true,
    quote: true
  });
  const [error, setError] = useState({
    trending: null,
    categories: null,
    quote: null
  });

  useEffect(() => {
    // Fetch trending posts
    const fetchTrending = async () => {
      try {
        const res = await fetch('/api/posts/trending');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch trending posts');
        setTrendingPosts(data.posts);
      } catch (err) {
        setError(prev => ({...prev, trending: err.message}));
      } finally {
        setLoading(prev => ({...prev, trending: false}));
      }
    };

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch categories');
        setCategories(data);
      } catch (err) {
        setError(prev => ({...prev, categories: err.message}));
      } finally {
        setLoading(prev => ({...prev, categories: false}));
      }
    };

    // Fetch random quote (with fallback)
    const fetchQuote = async () => {
      try {
        const res = await fetch('https://api.quotable.io/random');
        const data = await res.json();
        if (!res.ok) throw new Error('Failed to fetch quote');
        setQuote(data);
      } catch (err) {
        // Fallback quote if API fails
        setQuote({
          content: "The environment is where we all meet; where we all have a mutual interest; it is the one thing all of us share.",
          author: "Lady Bird Johnson"
        });
        setError(prev => ({...prev, quote: err.message}));
      } finally {
        setLoading(prev => ({...prev, quote: false}));
      }
    };

    fetchTrending();
    fetchCategories();
    fetchQuote();
  }, []);

  return (
    <div className="space-y-6">
      {/* Search Widget - Updated with brand colors */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="font-bold mb-2 text-gray-800 dark:text-white">Search</h3>
        <div className="flex">
          <input 
            type="text" 
            placeholder="Search posts..."
            className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button className="bg-brand-green text-white px-4 py-2 rounded-r-md hover:bg-brand-green/90 transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Trending Posts */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="font-bold mb-3 text-gray-800 dark:text-white">Trending Now</h3>
        {loading.trending ? (
          <div className="flex justify-center py-4">
            <Spinner size="sm" />
          </div>
        ) : error.trending ? (
          <div className="text-red-500 text-sm">{error.trending}</div>
        ) : (
          <div className="space-y-3">
            {trendingPosts?.length > 0 ? (
              trendingPosts.map(post => (
                <Link 
                  key={post._id} 
                  to={`/post/${post.slug}`}
                  className="flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                >
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 hover:underline line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No trending posts found</p>
            )}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="font-bold mb-3 text-gray-800 dark:text-white">Categories</h3>
        {loading.categories ? (
          <div className="flex justify-center py-4">
            <Spinner size="sm" />
          </div>
        ) : error.categories ? (
          <div className="text-red-500 text-sm">{error.categories}</div>
        ) : (
          <div className="space-y-2">
            {categories?.length > 0 ? (
              categories.map(cat => (
                <div 
                  key={cat._id} 
                  className="flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                >
                  <Link 
                    to={`/category/${cat.slug}`} 
                    className="text-gray-700 dark:text-gray-300 hover:text-brand-green dark:hover:text-brand-yellow hover:underline flex-grow"
                  >
                    {cat.name}
                  </Link>
                  <span className="bg-gray-100 dark:bg-gray-600 px-2 rounded-full text-xs text-gray-800 dark:text-gray-200">
                    {cat.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No categories found</p>
            )}
          </div>
        )}
      </div>

      {/* Quote Widget */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="font-bold mb-3 text-gray-800 dark:text-white">Environmental Quote</h3>
        {loading.quote ? (
          <div className="flex justify-center py-4">
            <Spinner size="sm" />
          </div>
        ) : (
          <>
            <blockquote className="italic text-gray-700 dark:text-gray-300">"{quote?.content}"</blockquote>
            <cite className="block text-right mt-2 text-sm text-gray-600 dark:text-gray-400">— {quote?.author}</cite>
          </>
        )}
      </div>
    </div>
  );
}