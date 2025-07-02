import { Label, TextInput, Textarea, Select, ToggleSwitch, FileInput } from 'flowbite-react';
import { HiOutlinePhotograph } from 'react-icons/hi';

const BasicInfoTab = ({
  formData,
  handleChange,
  setFormData,
  errors,
  loading,
  categories = []
}) => {
  // Static environmental consulting categories as fallback
  const envConsultingCategories = [
    { _id: 'env1', name: 'Environmental Impact Assessment' },
    { _id: 'env2', name: 'Air Quality Monitoring' },
    { _id: 'env3', name: 'Water Resource Management' },
    { _id: 'env4', name: 'Waste Management Consulting' },
    { _id: 'env5', name: 'Sustainability Planning' },
    { _id: 'env6', name: 'Environmental Compliance' },
    { _id: 'env7', name: 'Ecological Surveys' },
    { _id: 'env8', name: 'Carbon Footprint Analysis' },
    { _id: 'env9', name: 'Soil Contamination Studies' },
    { _id: 'env10', name: 'Environmental Auditing' }
  ];

  // Combine dynamic and static categories, removing duplicates
  const allCategories = [
    ...new Map([
      ...envConsultingCategories.map(item => [item._id, item]),
      ...categories.map(item => [item._id, item])
    ]).values()
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* Service Title */}
      <div className="md:col-span-2">
        <Label htmlFor="title" value="Service Title*" />
        <TextInput
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          color={errors.title ? 'failure' : 'gray'}
          helperText={errors.title}
          disabled={loading}
          placeholder="e.g., Environmental Impact Assessment Services"
        />
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category" value="Category*" />
        <TextInput
        id="category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        color={errors.category ? 'failure' : 'gray'}
        helperText={errors.category || "E.g., Environmental Impact Assessment"}
        disabled={loading}
        placeholder="Enter service category"
        />
      </div>

      {/* Price */}
      <div>
        <Label htmlFor="price" value="Price (KES)" />
        <TextInput
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          color={errors.price ? 'failure' : 'gray'}
          helperText={errors.price}
          disabled={loading}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </div>

      {/* Short Description */}
      <div className="md:col-span-2">
        <Label htmlFor="shortDescription" value="Short Description*" />
        <Textarea
          id="shortDescription"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          rows={3}
          color={errors.shortDescription ? 'failure' : 'gray'}
          helperText={errors.shortDescription}
          disabled={loading}
          placeholder="Brief summary of your environmental service"
        />
      </div>

      {/* Full Description */}
      <div className="md:col-span-2">
        <Label htmlFor="description" value="Full Description*" />
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          color={errors.description ? 'failure' : 'gray'}
          helperText={errors.description}
          disabled={loading}
          placeholder="Detailed description of your environmental consulting service..."
        />
      </div>

      {/* Featured Image 
      <div className="md:col-span-2">
        <Label htmlFor="featuredImage" value="Featured Image" />
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiOutlinePhotograph className="h-5 w-5 text-gray-400" />
          </div>
          <FileInput
            id="featuredImage"
            name="featuredImage"
            onChange={(e) => setFormData({
              ...formData,
              featuredImage: e.target.files[0]
            })}
            disabled={loading}
            helperText="Recommended size: 1200x630px"
            className="pl-10"
          />
        </div>
        {formData.imageUrl && (
          <div className="mt-2">
            <img 
              src={formData.imageUrl} 
              alt="Current featured" 
              className="h-20 rounded"
            />
          </div>
        )}
      </div>
      */}

      {/* Meta Fields */}
      <div>
        <Label htmlFor="metaTitle" value="SEO Title" />
        <TextInput
          id="metaTitle"
          name="metaTitle"
          value={formData.metaTitle}
          onChange={handleChange}
          disabled={loading}
          placeholder="Title for search engines"
        />
      </div>
      <div>
        <Label htmlFor="metaDescription" value="SEO Description" />
        <TextInput
          id="metaDescription"
          name="metaDescription"
          value={formData.metaDescription}
          onChange={handleChange}
          disabled={loading}
          placeholder="Description for search engines"
        />
      </div>

      {/* Status Toggle */}
      <div className="md:col-span-2 flex items-center gap-2">
        <ToggleSwitch
          checked={formData.isFeatured || false}
          label="Featured Service"
          onChange={(checked) => setFormData({
            ...formData,
            isFeatured: checked
          })}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;