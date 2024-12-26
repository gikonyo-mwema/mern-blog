import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/posts/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Greetings and welcome to our environmental blog! This is your dedicated space for exploring the rich tapestry of our natural world through engaging articles, news updates, and thought-provoking discussions. We aim to empower you with knowledge and inspiration to take meaningful action in your own life. From climate change and conservation to innovative sustainability practices, we cover a wide range of topics that matter. Together, let’s cultivate a deeper understanding of our environment and work towards a healthier, more sustainable future for all.
        </p>
        <Link to="/search" className="text-xs sm:text-sm text-teal-500 font-bold hover:underline">
          View all posts
        </Link>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link to="/search" className="text-lg text-teal-500 hover:underline text-center">
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
