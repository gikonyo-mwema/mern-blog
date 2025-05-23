import { Button, Spinner, Tooltip } from 'flowbite-react';
import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiEye, FiCopy, FiArrowUp } from 'react-icons/fi';
import { FaTwitter, FaFacebook, FaPinterest, FaExclamationTriangle } from 'react-icons/fa';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { getDefaultImageUrl } from '../utils/cloudinary';

const defaultProfilePic = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

const categoryColors = {
  'climate-change': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'renewable-energy': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'sustainable-agriculture': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'conservation': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'zero-waste': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  'ocean-preservation': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  'green-tech': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'environmental-policy': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  'sustainable-architecture': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  'eco-tourism': 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
  'default': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
};

const calculateReadingTime = (content) => {
  if (!content) return 0;
  const textOnly = content.replace(/<[^>]+>/g, ' ');
  const wordCount = textOnly.split(/\s+/).length;
  return Math.ceil(wordCount / 200);
};

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const readingTime = useMemo(() => calculateReadingTime(post?.content), [post?.content]);

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

  // Fetch recommended posts
  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          const filtered = data.posts.filter(p => p._id !== post?._id);
          if (filtered.length < 3) {
            const additionalRes = await fetch(`/api/post/getposts?limit=${3 - filtered.length + 1}`);
            const additionalData = await additionalRes.json();
            if (additionalRes.ok) {
              const additionalFiltered = additionalData.posts.filter(p => p._id !== post?._id);
              setRecommendedPosts([...filtered, ...additionalFiltered].slice(0, 3));
            }
          } else {
            setRecommendedPosts(filtered.slice(0, 3));
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchRecommendedPosts();
  }, [post?._id]);

  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(progress);
      setShowBackToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!currentUser || !currentUser._id) {
    console.error('currentUser is undefined or does not have an _id');
    return null;
  }

  if (loading) return (
    <div className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mt-10 animate-pulse"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto mt-5 animate-pulse"></div>
      <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded w-full mt-10 animate-pulse"></div>
      <div className="space-y-3 mt-10 max-w-4xl mx-auto w-full">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
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
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen dark:bg-gray-900 dark:text-gray-100'>
      {/* Scroll progress indicator */}
      <div className="fixed top-0 left-0 h-1 bg-teal-500 z-50" style={{ width: `${scrollProgress}%` }}></div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-teal-500 text-white rounded-full shadow-lg hover:bg-teal-600 transition-colors z-40"
          aria-label="Back to top"
        >
          <FiArrowUp size={20} />
        </button>
      )}

      {/* Post title */}
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-4xl mx-auto lg:text-4xl'>
        {post?.title}
      </h1>

      {/* Category - moved up to top */}
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
      <div className="mt-10 w-full max-w-4xl mx-auto">
        {post?.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto max-h-[600px] object-contain rounded-lg"
            loading="lazy"
            onError={(e) => {
              e.target.src = getDefaultImageUrl();
            }}
          />
        )}
      </div>

      {/* View count and social sharing */}
      <div className="flex items-center justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-4xl text-sm">
        <div className="flex items-center gap-1">
          <FiEye className="text-gray-500 dark:text-gray-400" />
          <span className="dark:text-gray-300">{post?.views || 0} views</span>
        </div>
        <div className="flex gap-2 items-center">
          <Tooltip content="Copy link">
            <button 
              onClick={handleCopyLink}
              className="text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 p-1 rounded-full"
            >
              <FiCopy size={16} />
            </button>
          </Tooltip>
          <button className="text-gray-500 hover:text-blue-500 p-1 rounded-full">
            <FaTwitter size={16} />
          </button>
          <button className="text-gray-500 hover:text-blue-800 p-1 rounded-full">
            <FaFacebook size={16} />
          </button>
          <button className="text-gray-500 hover:text-red-500 p-1 rounded-full">
            <FaPinterest size={16} />
          </button>
        </div>
      </div>

      {/* Post content */}
      <div
        className='p-3 max-w-4xl mx-auto w-full post-content dark:prose-invert prose'
        dangerouslySetInnerHTML={{ __html: post?.content }}
      ></div>

      {/* Author section - moved below post content */}
      <div className="max-w-4xl mx-auto w-full mt-10 p-5 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <img
            src={post?.authorProfile || defaultProfilePic}
            alt={post?.author}
            className="w-16 h-16 rounded-full object-cover"
            onError={(e) => {
              e.target.src = defaultProfilePic;
            }}
          />
          <div>
            <Link 
              to={`/user/${post?.userId}`} 
              className="font-medium text-lg hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              {post?.author}
            </Link>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Published on {post && new Date(post.createdAt).toLocaleDateString()} &bull; {readingTime} min read
            </div>
            {post?.authorBio && (
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {post.authorBio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className='max-w-4xl mx-auto w-full mt-10'>
        <CallToAction />
      </div>

      {/* Comment section */}
      <CommentSection postId={post._id} />

      {/* Recommended articles */}
      <div className='flex flex-col justify-center items-center mb-5 mt-10'>
        <h1 className='text-xl mb-5'>Recommended articles</h1>
        <div className='flex flex-wrap gap-5 justify-center w-full max-w-6xl'>
          {recommendedPosts.map((post) => (
            <div key={post._id} className="flex-1 min-w-[300px] max-w-[400px]">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}