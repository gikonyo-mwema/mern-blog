import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
  const { postSlug } = useParams(); // Get the post slug from the URL parameters
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(false); // State to track error status
  const [post, setPost] = useState(null); // State to store the fetched post
  const [recentPosts, setRecentPosts] = useState(null); // State to store recent posts
  const { currentUser } = useSelector((state) => state.user); // Get the current user from Redux store

  // Fetch the post data based on the slug
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`); // Fetch post data
        const data = await res.json();
        if (!res.ok) {
          setError(true); // Set error if response is not OK
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]); // Set the fetched post
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true); // Handle fetch error
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]); // Re-run the effect when postSlug changes

  // Fetch recent posts
  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`); // Fetch recent posts with a limit of 3
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts); // Set the fetched recent posts
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message); // Log any errors
    }
  }, []);

  // Handle case where currentUser is not defined or invalid
  if (!currentUser || !currentUser._id) {
    console.error('currentUser is undefined or does not have an _id');
    return null; // Render nothing or fallback UI
  }

  // Show a loading spinner while data is being fetched
  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

  // Render the main content of the page
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      {/* Post title */}
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post && post.title}
      </h1>

      {/* Link to user profile */}
      <Link to={`/user/${currentUser._id}`}>User Profile</Link>

      {/* Link to search posts by category */}
      <Link
        to={`/search?category=${post && post.category}`}
        className='self-center mt-5'
      >
        <Button color='gray' pill size='xs'>
          {post && post.category}
        </Button>
      </Link>

      {/* Post image */}
      <img
        src={post && post.image}
        alt={post && post.title}
        className='mt-10 p-3 max-h-[600px] w-full object-cover'
      />

      {/* Post metadata */}
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      {/* Post content */}
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>

      {/* Call to action section */}
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>

      {/* Comment section */}
      <CommentSection postId={post._id} />

      {/* Recent articles section */}
      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}