import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export default function CreatePost() {
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

  const navigate = useNavigate();

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
          setImageUploadProgress(progress);
        }
      });
      
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
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.content.trim()) {
        throw new Error('Content is required');
      }
      if (!formData.image) {
        throw new Error('Please upload an image');
      }

      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      navigate(`/post/${data.slug}`);
      
    } catch (error) {
      console.error('Post creation error:', error);
      setPublishError(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
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
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
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
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => {
              setFile(e.target.files[0]);
              setImageUploadError(null);
            }}
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUploadImage}
            disabled={!!imageUploadProgress}
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
            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300' />
            <span className='absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded'>
              Preview
            </span>
          </div>
        )}

        <ReactQuill
          theme='snow'
          placeholder='Write your post content here...'
          className='h-72 mb-12'
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
        
        <Button
          type='submit'
          gradientDuoTone='purpleToPink'
          disabled={isSubmitting || !formData.image}
          isProcessing={isSubmitting}
        >
          {isSubmitting ? 'Publishing...' : 'Publish'}
        </Button>
        
        {publishError && (
          <Alert color='failure' className='mt-5' onDismiss={() => setPublishError(null)}>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}