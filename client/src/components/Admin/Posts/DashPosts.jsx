import { Table, Modal, Button, Alert, TextInput, Select } from 'flowbite-react';
import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FiUpload, FiEdit2 } from 'react-icons/fi';
import { uploadToCloudinary } from '../../../utils/cloudinary.js';

const ReactQuill = lazy(() => import('react-quill'));
import 'react-quill/dist/quill.snow.css';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  
  // Create post state (restored original)
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'uncategorized',
    image: ''
  });
  const [publishError, setPublishError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'uncategorized', label: '🌍 Select a category' },
    { value: 'climate-change', label: '🔥 Climate Change' },
    { value: 'renewable-energy', label: '☀️ Renewable Energy' },
    { value: 'sustainable-agriculture', label: '🌱 Sustainable Agriculture' },
    { value: 'conservation', label: '🐘 Wildlife Conservation' },
    { value: 'zero-waste', label: '♻️ Zero Waste' },
    { value: 'ocean-preservation', label: '🌊 Ocean Health' },
    { value: 'green-tech', label: '💡 Green Tech' },
    { value: 'environmental-policy', label: '📜 Eco Policy' },
    { value: 'sustainable-cities', label: '🏙️ Sustainable Cities' },
    { value: 'eco-tourism', label: '✈️ Responsible Travel' }
  ];

  // Fetch posts function (unchanged)
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/post/getPosts', {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `HTTP error! status: ${res.status}`);
      }

      setUserPosts(data.posts || []);
      setShowMore(data.posts.length >= 9);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPublishError(error.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser.token]);

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchPosts();
    }
  }, [fetchPosts, currentUser]);

  // Delete post function (fixed)
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/deletePost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete post');
      }

      setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
    } catch (error) {
      console.error('Error deleting post:', error);
      setPublishError(error.message);
    }
  };

  // Edit post functions (new)
  const handleEditPost = (post) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category,
      image: post.image
    });
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPublishError(null);

    try {
      const res = await fetch(`/api/post/updatePost/${currentPost._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update post');
      }

      setShowEditForm(false);
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      setPublishError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create post functions (restored original)
  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError('Please select an image');
      return;
    }

    try {
      setImageUploadProgress(0);
      setImageUploadError(null);
      
      const result = await uploadToCloudinary(file, {
        onProgress: (progress) => {
          setImageUploadProgress(Math.round(progress));
        }
      });
      
      if (!result?.url) {
        throw new Error('Image upload failed - no URL returned');
      }

      setFormData(prev => ({ ...prev, image: result.url }));
      setImageUploadProgress(null);
    } catch (error) {
      console.error('Image upload error:', error);
      setImageUploadError(error.message || 'Image upload failed');
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPublishError(null);

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.content.trim() || formData.content === '<p><br></p>') {
        throw new Error('Content is required');
      }
      if (!formData.image) {
        throw new Error('Please upload an image');
      }

      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          ...formData,
          userId: currentUser._id
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      // Reset form
      setFormData({
        title: '',
        content: '',
        category: 'uncategorized',
        image: ''
      });
      setFile(null);
      setShowCreateForm(false);
      
      // Refresh posts
      await fetchPosts();
    } catch (error) {
      console.error('Post creation error:', error);
      setPublishError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          You are not authorized to view this content.
        </p>
      </div>
    );
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Manage Posts</h1>
        <Button
          gradientDuoTone="purpleToPink"
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setShowEditForm(false);
          }}
          disabled={loading}
        >
          {showCreateForm ? 'Hide Form' : 'Create New Post'}
        </Button>
      </div>

      {publishError && (
        <Alert color="failure" className="mb-4" onDismiss={() => setPublishError(null)}>
          {publishError}
        </Alert>
      )}

      {/* Original Create Post Form (unchanged) */}
      {showCreateForm && (
        <div className='mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <h2 className='text-xl font-semibold mb-4'>Create New Post</h2>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
              <TextInput
                type='text'
                placeholder='Title'
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className='flex-1'
              />
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
              <input
                type='file'
                accept='image/*'
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setImageUploadError(null);
                }}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                disabled={!!imageUploadProgress}
              />
              <Button
                type='button'
                gradientDuoTone='purpleToBlue'
                size='sm'
                outline
                onClick={handleUploadImage}
                disabled={!!imageUploadProgress || !file}
              >
                {imageUploadProgress ? `Uploading ${imageUploadProgress}%` : 'Upload Image'}
              </Button>
            </div>
            
            {imageUploadError && (
              <Alert color='failure' onDismiss={() => setImageUploadError(null)}>
                {imageUploadError}
              </Alert>
            )}
            
            {formData.image && (
              <div className='relative group'>
                <img
                  src={formData.image}
                  alt='Preview'
                  className='w-full h-72 object-cover rounded-lg'
                  onError={() => {
                    setImageUploadError('Failed to load image preview');
                    setFormData(prev => ({ ...prev, image: '' }));
                  }}
                />
              </div>
            )}

            <Suspense fallback={<div className="h-72 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p>Loading editor...</p>
            </div>}>
              <ReactQuill
                theme='snow'
                placeholder='Write your post content here...'
                className='h-72 mb-12 bg-white dark:bg-gray-700 rounded-lg'
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    ['link', 'image'],
                    ['clean']
                  ]
                }}
              />
            </Suspense>
            
            <Button
              type='submit'
              gradientDuoTone='purpleToPink'
              disabled={isSubmitting || !formData.image || !formData.content.trim()}
              isProcessing={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </Button>
          </form>
        </div>
      )}

      {/* Edit Post Form (new) */}
      {showEditForm && currentPost && (
        <div className='mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <h2 className='text-xl font-semibold mb-4'>Edit Post</h2>
          <form className='flex flex-col gap-4' onSubmit={handleUpdatePost}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
              <TextInput
                type='text'
                placeholder='Title'
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className='flex-1'
              />
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
              <input
                type='file'
                accept='image/*'
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setImageUploadError(null);
                }}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                disabled={!!imageUploadProgress}
              />
              <Button
                type='button'
                gradientDuoTone='purpleToBlue'
                size='sm'
                outline
                onClick={handleUploadImage}
                disabled={!!imageUploadProgress || !file}
              >
                {imageUploadProgress ? `Uploading ${imageUploadProgress}%` : 'Upload Image'}
              </Button>
            </div>
            
            {imageUploadError && (
              <Alert color='failure' onDismiss={() => setImageUploadError(null)}>
                {imageUploadError}
              </Alert>
            )}
            
            {formData.image && (
              <div className='relative group'>
                <img
                  src={formData.image}
                  alt='Preview'
                  className='w-full h-72 object-cover rounded-lg'
                />
              </div>
            )}

            <Suspense fallback={<div className="h-72 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p>Loading editor...</p>
            </div>}>
              <ReactQuill
                theme='snow'
                placeholder='Write your post content here...'
                className='h-72 mb-12 bg-white dark:bg-gray-700 rounded-lg'
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    ['link', 'image'],
                    ['clean']
                  ]
                }}
              />
            </Suspense>
            
            <div className="flex gap-4">
              <Button
                type='submit'
                gradientDuoTone='purpleToPink'
                disabled={isSubmitting}
                isProcessing={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Post'}
              </Button>
              <Button
                color="gray"
                onClick={() => setShowEditForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Posts Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading posts...</p>
        </div>
      ) : userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userPosts.map((post) => (
                <Table.Row key={post._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-10 object-cover rounded"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium text-gray-500 dark:text-white hover:underline" to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="capitalize">
                    {post.category.replace('-', ' ')}
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="font-medium text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => handleEditPost(post)}
                      className="font-medium text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <FiEdit2 /> Edit
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {showMore && (
            <div className="flex justify-center mt-4">
              <Button
                outline
                gradientDuoTone="purpleToBlue"
                onClick={() => {
                  // Implement pagination logic here
                }}
              >
                Show More
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            You have no posts yet!
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}