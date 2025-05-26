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
              <Label htmlFor="price" value="Price" />
              <TextInput
                id="price"
                type="number"
                placeholder="Enter price"
                required
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="description" value="Description" />
              <Textarea
                id="description"
                placeholder="Enter course description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
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
              <Label htmlFor="paymentOption" value="Payment Option" />
              <Select
                id="paymentOption"
                value={formData.paymentOption}
                onChange={handleChange}
              >
                <option value="">Select payment option</option>
                <option value="one-time">One-time Payment</option>
                <option value="subscription">Subscription</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="cta" value="Call to Action Text" />
              <TextInput
                id="cta"
                type="text"
                placeholder="Enter CTA text"
                value={formData.cta}
                onChange={handleChange}
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

            <Button
              type="submit"
              gradientDuoTone="tealToLime"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : submitButtonText}
            </Button>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};