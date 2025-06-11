import React from 'react';
import { Button, TextInput, Textarea, Select, Label, Checkbox } from 'flowbite-react';
import { HiOutlineArrowLeft, HiOutlinePlus } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export const CourseForm = ({ 
  formData, 
  handleChange, 
  handleFeatureChange, 
  addFeatureField, 
  removeFeatureField, 
  handleSubmit, 
  error, 
  loading, 
  title, 
  submitButtonText 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard?tab=courses">
          <Button outline gradientDuoTone="tealToLime" className="mb-6">
            <HiOutlineArrowLeft className="mr-2" /> Back to Courses
          </Button>
        </Link>

        <div className="bg-white rounded-xl shadow-md p-8 border border-teal-100">
          <h1 className="text-3xl font-bold text-teal-800 mb-6">{title}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" value="Course Title" />
                <TextInput
                  id="title"
                  type="text"
                  placeholder="Enter course title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="slug" value="URL Slug" />
                <TextInput
                  id="slug"
                  type="text"
                  placeholder="e.g. private-mentorship"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  helperText="Used in the course URL (lowercase, hyphens, no spaces)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="price" value="Price (KES)" />
                <TextInput
                  id="price"
                  type="number"
                  placeholder="Enter price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="100"
                />
              </div>

              <div>
                <Label htmlFor="paymentOption" value="Payment Option" />
                <Select
                  id="paymentOption"
                  value={formData.paymentOption}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select payment option</option>
                  <option value="one-time">One-time Payment</option>
                  <option value="subscription">Subscription</option>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="shortDescription" value="Short Description" />
              <Textarea
                id="shortDescription"
                placeholder="Brief description for course cards (max 100 characters)"
                rows={2}
                maxLength={100}
                value={formData.shortDescription}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description" value="Full Description" />
              <Textarea
                id="description"
                placeholder="Detailed course description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="externalUrl" value="External Platform URL" />
              <TextInput
                id="externalUrl"
                type="url"
                placeholder="https://external-platform.com/course"
                required
                value={formData.externalUrl}
                onChange={handleChange}
                helperText="Where users will be redirected to enroll"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isPopular"
                checked={formData.isPopular}
                onChange={handleChange}
              />
              <Label htmlFor="isPopular">Mark as Popular Course</Label>
            </div>

            <div>
              <Label htmlFor="cta" value="Call to Action Text" />
              <TextInput
                id="cta"
                type="text"
                placeholder="e.g. 'Enroll Now' or 'Book Session'"
                value={formData.cta}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label value="Course Features" />
                <Button
                  type="button"
                  outline
                  gradientDuoTone="tealToLime"
                  size="xs"
                  onClick={addFeatureField}
                >
                  <HiOutlinePlus className="mr-1" /> Add Feature
                </Button>
              </div>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <TextInput
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    className="flex-1"
                    required
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type="button"
                      color="failure"
                      size="xs"
                      onClick={() => removeFeatureField(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                gradientDuoTone="tealToLime"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {submitButtonText}
                  </span>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>

            {error && (
              <div className="mt-4 text-center">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};