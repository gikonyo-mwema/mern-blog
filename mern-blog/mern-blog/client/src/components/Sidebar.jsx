import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    fetch('/api/posts/trending')
      .then(res => res.json())
      .then(data => {
        setTrendingPosts(data.posts);
        setLoading(prev => ({...prev, trending: false}));
      })
      .catch(err => {
        setError(prev => ({...prev, trending: err.message}));
        setLoading(prev => ({...prev, trending: false}));
      });

    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(prev => ({...prev, categories: false}));
      })
      .catch(err => {
        setError(prev => ({...prev, categories: err.message}));
        setLoading(prev => ({...prev, categories: false}));
      });

    // Fetch random quote (with fallback)
    fetch('https://api.quotable.io/random')
      .then(res => res.json())
      .then(data => {
        setQuote(data);
        setLoading(prev => ({...prev, quote: false}));
      })
      .catch(err => {
        // Fallback quote if API fails
        setQuote({
          content: "The best way to predict the future is to create it.",
          author: "Abraham Lincoln"
        });
        setLoading(prev => ({...prev, quote: false}));
        setError(prev => ({...prev, quote: err.message}));
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Search Widget */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold mb-2">Search</h3>
        <div className="flex">
          <input 
            type="text" 
            placeholder="Search posts..."
            className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none"
          />
          <button className="bg-teal-500 text-white px-4 py-2 rounded-r-md hover:bg-teal-600">
            Go
          </button>
        </div>
      </div>

      {/* Trending Posts */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold mb-3">Trending Now</h3>
        {loading.trending ? (
          <div>Loading trending posts...</div>
        ) : error.trending ? (
          <div className="text-red-500">Error: {error.trending}</div>
        ) : (
          <div className="space-y-3">
            {trendingPosts?.length > 0 ? (
              trendingPosts.map(post => (
                <div key={post._id} className="flex gap-3">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <Link to={`/post/${post.slug}`} className="font-medium hover:underline">
                      {post.title}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No trending posts found</p>
            )}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold mb-3">Categories</h3>
        {loading.categories ? (
          <div>Loading categories...</div>
        ) : error.categories ? (
          <div className="text-red-500">Error: {error.categories}</div>
        ) : (
          <div className="space-y-2">
            {categories?.length > 0 ? (
              categories.map(cat => (
                <div key={cat._id} className="flex justify-between">
                  <Link 
                    to={`/category/${cat.slug}`} 
                    className="hover:underline"
                  >
                    {cat.name}
                  </Link>
                  <span className="bg-gray-100 px-2 rounded-full text-xs">
                    {cat.count}
                  </span>
                </div>
              ))
            ) : (
              <p>No categories found</p>
            )}
          </div>
        )}
      </div>

      {/* Quote Widget */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold mb-3">Quote of the Day</h3>
        {loading.quote ? (
          <div>Loading quote...</div>
        ) : (
          <>
            <blockquote className="italic">"{quote?.content}"</blockquote>
            <cite className="block text-right mt-2 text-sm">— {quote?.author}</cite>
          </>
        )}
      </div>
    </div>
  );
}