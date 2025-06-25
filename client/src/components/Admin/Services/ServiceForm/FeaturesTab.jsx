import { Label, TextInput, Textarea, Button } from 'flowbite-react';
import { HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

const FeaturesTab = ({
  features,
  handleFeatureChange,
  addFeature,
  removeFeature,
  errors,
  loading
}) => {
  return (
    <div className="mt-4 space-y-4">
      <Label value="Service Features*" />
      {features.map((feature, index) => (
        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <Label value={`Feature ${index + 1} Title*`} />
              <TextInput
                value={feature.title}
                onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                color={errors[`featureTitle${index}`] ? 'failure' : 'gray'}
                helperText={errors[`featureTitle${index}`]}
                disabled={loading}
                placeholder="Custom solutions"
              />
            </div>
            <div className="flex items-end justify-end">
              <Button
                color="failure"
                size="xs"
                onClick={() => removeFeature(index)}
                disabled={features.length <= 1 || loading}
              >
                <HiOutlineTrash className="mr-1" /> Remove
              </Button>
            </div>
          </div>
          <div>
            <Label value={`Feature ${index + 1} Description*`} />
            <Textarea
              value={feature.description}
              onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
              rows={3}
              color={errors[`featureDesc${index}`] ? 'failure' : 'gray'}
              helperText={errors[`featureDesc${index}`]}
              disabled={loading}
              placeholder="Detailed description of this feature"
            />
          </div>
        </div>
      ))}
      <Button
        gradientMonochrome="info"
        onClick={addFeature}
        disabled={loading}
      >
        <HiOutlinePlus className="mr-2" /> Add Feature
      </Button>
    </div>
  );
};

export default FeaturesTab;