import React, { useEffect, useState } from 'react'
import { Button, Select, TextInput } from 'flowbite-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',
    });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMore, setShowMore] = useState(false);

    const location = useLocation();
    const Navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value });
        }
        if (e.target.id === 'sort') {
            const order = e.target.value || 'desc';
        }
            fetchPosts();
        }

        }
        if (e.target.id === 'category') {
            const category = e.target.value || 'uncategorized';
            setSidebarData({ ...sidebarData, category });
        }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');
        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl,
            });
        }

        fetchPosts();
    }, [location.search]);

    const fetchPosts = async () => {
        setLoading(true);
        const urlParams = new URLSearchParams(location.search);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (res.ok) {
            const data = await res.json();
            setPosts(data.posts);
            setLoading(false);
            if (data.posts.length === 9) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        const searchQuery = urlParams.toString();
        Navigate(`/search?${searchQuery}`);
    };

    const handleShowMore = () => {
        const numberOfPosts = posts.length;
    const handleShowMore = async () => {
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!res.ok) {
            const data = await res.json();
        }  
        if (res.ok) {
            const data = await res.json();
            setPosts([...posts, ...data.posts]);
            if (data.posts.length === 9) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        }
    }

  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
            <form  onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className="flex items-center gap-2">
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <TextInput placeholder="Search..."
                    id='searchTerm'
                    type='text'
                    value={sidebarData.searchTerm}
                    onChange={handleChange}
                />

                </div>
                <div className="flex items-center gap-2">
                <label className='font-semibold'>Sort</label>
                <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
                    <option value='desc'>Latest</option>
                    <option value='asc'>Oldest</option>
                </Select>
                </div>
                <div className="flex items-center gap-2">
                <label className='font-semibold'>Category</label>
                <Select onChange={handleChange} value={sidebarData.category} id='category'>
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
        <div className='w-full'>
            <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Posts results:</h1>
            <div className="p-7 flex flex-wrap gap-4">
                {!loading && posts.length === 0 && (
                <p className='text-xl text-gray-500'>No posts found.</p>
                )}
                {loading && <p className='text-xl text-gray-500'>Loading...</p>}
                {!loading &&
                  posts &&
                  posts.map((post)  => <PostCard key={post._id}
                post={post} />)}
                {
                    showMore && <button
                    className='text-teal-500 text-lg hover:underline p-7 w-full'>
                        Show More
                
                    </button>
                }
            </div>
        </div>
      
    </div>
  )
}