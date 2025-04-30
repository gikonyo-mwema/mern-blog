import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiEye } from 'react-icons/fi';
import { FaTwitter, FaFacebook, FaPinterest, FaExclamationTriangle } from 'react-icons/fa';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { getDefaultImageUrl } from '../utils/cloudinary';

const defaultProfilePic = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

const categoryColors = {
  'climate-change': 'bg-orange-100 text-orange-800',
  'renewable-energy': 'bg-blue-100 text-blue-800',
  'sustainable-agriculture': 'bg-green-100 text-green-800',
  'conservation': 'bg-amber-100 text-amber-800',
  'zero-waste': 'bg-teal-100 text-teal-800',
  'ocean-preservation': 'bg-cyan-100 text-cyan-800',
  'green-tech': 'bg-purple-100 text-purple-800',
  'environmental-policy': 'bg-indigo-100 text-indigo-800',
  'sustainable-architecture': 'bg-emerald-100 text-emerald-800',
  'eco-tourism': 'bg-lime-100 text-lime-800',
  'default': 'bg-gray-100 text-gray-800'
};

// Helper function to extract headings from content
const extractHeadings = (html) => {
  if (!html) return [];
  const div = document.createElement('div');
  div.innerHTML = html;
  const headings = div.querySelectorAll('h2, h3');
  return Array.from(headings).map(h => h.textContent);
};

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  // Fetch the post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  // Fetch recent posts
  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!currentUser || !currentUser._id) {
    console.error('currentUser is undefined or does not have an _id');
    return null;
  }

  if (loading) return (
    <div className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mt-10 animate-pulse"></div>
      <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mt-5 animate-pulse"></div>
      <div className="h-96 bg-gray-200 rounded w-full mt-10 animate-pulse"></div>
      <div className="space-y-3 mt-10 max-w-2xl mx-auto w-full">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className='flex justify-center items-center min-h-screen flex-col gap-2'>
      <FaExclamationTriangle className="text-red-500 text-4xl" />
      <h1 className='text-xl'>Failed to load post</h1>
      <Button color="gray" onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  );

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      {/* Scroll progress indicator */}
      <div className="fixed top-0 left-0 h-1 bg-teal-500 z-50" style={{ width: `${scrollProgress}%` }}></div>

      {/* Post title */}
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post?.title}
      </h1>

      {/* Author and metadata */}
      <div className="flex items-center gap-4 self-center mt-5">
        <img
          src={post?.authorProfile || defaultProfilePic}
          alt={post?.author}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.src = defaultProfilePic;
          }}
        />
        <div className="text-center">
          <Link 
            to={`/user/${post?.userId}`} 
            className="font-medium hover:text-teal-600 transition-colors"
          >
            {post?.author}
          </Link>
          <div className="text-xs text-gray-500">
            {post && new Date(post.createdAt).toLocaleDateString()} &bull; {post && (post.content.length / 1000).toFixed(0)} min read
          </div>
        </div>
      </div>

      {/* Category */}
      <Link
        to={`/search?category=${post?.category}`}
        className='self-center mt-3'
      >
        <Button 
          className={`${categoryColors[post?.category] || categoryColors.default} hover:opacity-80`}
          pill 
          size='xs'
        >
          {post?.category?.replace(/-/g, ' ')}
        </Button>
      </Link>

      {/* Post image */}
      <div className="mt-10 p-3 max-h-[600px] w-full relative overflow-hidden bg-gray-100 rounded-lg">
        {post?.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = getDefaultImageUrl();
            }}
          />
        )}
      </div>

      {/* View count and social sharing */}
      <div className="flex items-center justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-sm">
        <div className="flex items-center gap-1">
          <FiEye className="text-gray-500" />
          <span>{post?.views || 0} views</span>
        </div>
        <div className="flex gap-2">
          <button className="text-gray-500 hover:text-blue-500">
            <FaTwitter />
          </button>
          <button className="text-gray-500 hover:text-blue-800">
            <FaFacebook />
          </button>
          <button className="text-gray-500 hover:text-red-500">
            <FaPinterest />
          </button>
        </div>
      </div>

      {/* Table of contents */}
      {post?.content.includes('<h2') && (
        <div className="p-3 max-w-2xl mx-auto w-full bg-gray-50 rounded-lg my-5">
          <h3 className="font-bold mb-2">Table of Contents</h3>
          <div className="text-sm space-y-1">
            {extractHeadings(post.content).map((heading, i) => (
              <a 
                key={i} 
                href={`#heading-${i}`}
                className="block hover:text-teal-600"
              >
                {heading}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Post content */}
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post?.content }}
      ></div>

      {/* Call to action */}
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>

      {/* Comment section */}
      <CommentSection postId={post._id} />

      {/* Related articles */}
      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Related articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentPosts
            ?.filter(p => p.category === post?.category && p._id !== post?._id)
            .slice(0, 3)
            .map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}