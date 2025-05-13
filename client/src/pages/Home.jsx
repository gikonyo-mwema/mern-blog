import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import RightSidebar from '../components/RightSidebar';
import Pagination from '../components/Pagination';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/post/getPosts?page=${currentPage}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch posts');
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        
        // Extract unique categories from posts
        const uniqueCategories = [...new Set(data.posts.map(post => post.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage]);

  const renderPostGrid = () => {
    if (loading) return (
      <div className="space-y-6">
        {[...Array(3)].map((_, rowIndex) => (
          <div 
            key={rowIndex} 
            className={`grid gap-6 ${rowIndex % 3 === 1 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}
          >
            {[...Array(rowIndex % 3 === 1 ? 3 : 2)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse h-full">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );

    if (error) return <div className="text-red-500 dark:text-red-400 p-4">Error: {error}</div>;

    // Create groups of posts following the 2-3-2 pattern
    const postGroups = [];
    for (let i = 0; i < posts.length; i += 7) {
      postGroups.push(posts.slice(i, i + 2)); // First row: 2 cards
      postGroups.push(posts.slice(i + 2, i + 5)); // Second row: 3 cards
      postGroups.push(posts.slice(i + 5, i + 7)); // Third row: 2 cards
    }

    return (
      <div className="space-y-6">
        {postGroups.map((group, rowIndex) => (
          <div 
            key={rowIndex} 
            className={`grid gap-6 ${group.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}
          >
            {group.map(post => (
              <PostCard 
                key={post._id} 
                post={post} 
                isCompact={group.length === 3} 
                className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900"
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Latest Articles</h1>
          {renderPostGrid()}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-8"
          />
          {categories.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Browse Categories</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Link 
                    key={category} 
                    to={`/category/${category.toLowerCase()}`}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full text-sm font-medium transition-colors text-gray-800 dark:text-gray-200"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="lg:w-1/4">
          <RightSidebar className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900 rounded-lg p-4" />
        </div>
      </div>
    </div>
  );
}