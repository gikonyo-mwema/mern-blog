import React, { useEffect, useState } from 'react';
import { Button, Select, TextInput } from 'flowbite-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
    // State to manage sidebar filter data
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',
    });
    // State to manage fetched posts
    const [posts, setPosts] = useState([]);
    // State to manage loading status
    const [loading, setLoading] = useState(true);
    // State to manage "Show More" button visibility
    const [showMore, setShowMore] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    // Fetch posts based on current filters
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const urlParams = new URLSearchParams(location.search);
            const res = await fetch(`/api/post/getposts?${urlParams.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts);
                setShowMore(data.posts.length === 9); // Show "Show More" if 9 posts are fetched
            } else {
                console.error('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setSidebarData((prev) => ({
            ...prev,
            [id]: value || (id === 'sort' ? 'desc' : 'uncategorized'),
        }));
    };

    // Apply filters and update the URL
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        navigate(`/search?${urlParams.toString()}`);
    };

    // Load more posts
    const handleShowMore = async () => {
        const startIndex = posts.length; // Pagination start index
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        try {
            const res = await fetch(`/api/post/getposts?${urlParams.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setPosts((prevPosts) => [...prevPosts, ...data.posts]); // Append new posts
                setShowMore(data.posts.length === 9); // Update "Show More" visibility
            } else {
                console.error('Failed to fetch more posts');
            }
        } catch (error) {
            console.error('Error loading more posts:', error);
        }
    };

    // Sync filters from URL to state on component mount and when URL changes
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        setSidebarData({
            searchTerm: urlParams.get('searchTerm') || '',
            sort: urlParams.get('sort') || 'desc',
            category: urlParams.get('category') || 'uncategorized',
        });
        fetchPosts();
    }, [location.search]);

    return (
        <div className='flex flex-col md:flex-row'>
            {/* Sidebar with filters */}
            <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <div className="flex items-center gap-2">
                        <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                        <TextInput
                            placeholder="Search..."
                            id='searchTerm'
                            type='text'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className='font-semibold'>Sort</label>
                        <Select id='sort' value={sidebarData.sort} onChange={handleChange}>
                            <option value='desc'>Latest</option>
                            <option value='asc'>Oldest</option>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className='font-semibold'>Category</label>
                        <Select id='category' value={sidebarData.category} onChange={handleChange}>
                            <option value='uncategorized'>Uncategorized</option>
                            <option value='climate-change'>Climate Change</option>
                            <option value='forest'>Forest</option>
                            <option value='eia'>EIA</option>
                        </Select>
                    </div>
                    <Button type='submit' outline gradientDuoTone='purpleToPink'>
                        Apply Filters
                    </Button>
                </form>
            </div>

            {/* Posts results */}
            <div className='w-full'>
                <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Posts Results:</h1>
                <div className="p-7 flex flex-wrap gap-4">
                    {loading && <p className='text-xl text-gray-500'>Loading...</p>}
                    {!loading && posts.length === 0 && (
                        <p className='text-xl text-gray-500'>No posts found.</p>
                    )}
                    {!loading && posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                    {showMore && (
                        <button
                            className='text-teal-500 text-lg hover:underline p-7 w-full'
                            onClick={handleShowMore}
                        >
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

    
