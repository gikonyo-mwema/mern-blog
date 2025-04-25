import React, { useEffect, useState } from 'react';
import { Button, Select, TextInput, Alert } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiUpload } from 'react-icons/fi';

export default function UpdatePost() {
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { postId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    // Fetch post data on component mount
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json();
                
                if (!res.ok) {
                    throw new Error(data.message || 'Failed to fetch post');
                }

                if (data.posts.length > 0) {
                    setFormData(data.posts[0]);
                }
            } catch (error) {
                setPublishError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPost();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.content || !formData.image) {
            return setPublishError('Title, content, and image are required');
        }

        try {
            setIsLoading(true);
            const res = await fetch(
                `/api/post/updatePost/${postId}/${currentUser._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || 'Failed to update post');
            }

            navigate(`/post/${data.slug}`);
        } catch (error) {
            setPublishError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, image: reader.result });
        };
        reader.readAsDataURL(file);
    };

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

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Update Post</h1>
            
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput
                        type='text'
                        placeholder='Title'
                        required
                        value={formData.title || ''}
                        onChange={(e) => 
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />
                    <Select
                        value={formData.category || 'uncategorized'}
                        onChange={(e) => 
                            setFormData({ ...formData, category: e.target.value })
                        }
                    >
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </Select>
                </div>

                <div className='flex flex-col gap-4'>
                    <label className='block text-sm font-medium text-gray-700'>
                        Featured Image
                    </label>
                    <div className='flex items-center gap-4'>
                        <label className='cursor-pointer'>
                            <span className='sr-only'>Choose image</span>
                            <input
                                type='file'
                                accept='image/*'
                                className='hidden'
                                onChange={handleImageChange}
                            />
                            <Button
                                type='button'
                                gradientDuoTone='purpleToBlue'
                                size='sm'
                                outline
                            >
                                <FiUpload className='mr-2' />
                                Change Image
                            </Button>
                        </label>
                        {formData.image && (
                            <img
                                src={formData.image}
                                alt='Preview'
                                className='w-20 h-20 object-cover rounded'
                            />
                        )}
                    </div>
                </div>

                <ReactQuill
                    theme='snow'
                    placeholder='Write your post content...'
                    className='h-72 mb-12'
                    value={formData.content || ''}
                    onChange={(value) => 
                        setFormData({ ...formData, content: value })
                    }
                />

                <Button
                    type='submit'
                    gradientDuoTone='purpleToPink'
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Update Post'}
                </Button>

                {publishError && (
                    <Alert color='failure' className='mt-4'>
                        {publishError}
                    </Alert>
                )}
            </form>
        </div>
    );
}
