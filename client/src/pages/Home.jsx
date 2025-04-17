import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        const res = await fetch(`/api/post/getposts?page=${currentPage}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch posts');
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message); // Set error message
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage]);

  // Function to create alternating grid layout
  const renderPostGrid = () => {
    if (loading) return <div>Loading...</div>;
    
    const gridLayouts = [
      [0, 1],    // First row: 2 cards
      [2, 3, 4],  // Second row: 3 cards
      [5, 6]      // Third row: 2 cards
    ];
    
    return gridLayouts.map((row, rowIndex) => (
      <div key={rowIndex} className={`grid gap-4 mb-6 ${
        row.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'
      }`}>
        {row.map(index => posts[index] && (
          <PostCard key={posts[index]._id} post={posts[index]} />
        ))}
      </div>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Main content area */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left sidebar - 25% width */}
        <div className="md:w-1/4">
          <Sidebar />
        </div>

        {/* Main content - 75% width */}
        <div className="md:w-3/4">
          <h1 className="text-3xl font-bold mb-6">Latest Articles</h1>
          
          {/* Error message or alternating post grid */}
          {error ? (
            <div className="text-red-500 p-4">Error: {error}</div>
          ) : (
            renderPostGrid()
          )}
          
          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
