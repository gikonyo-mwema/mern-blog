import { Label, TextInput, Textarea, Button, Select } from 'flowbite-react';
import { HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

const benefitIcons = [
  { value: '✅', label: 'Check Mark' },
  { value: '⏱️', label: 'Time' },
  { value: '💰', label: 'Money' },
  { value: '🛡️', label: 'Shield' },
  { value: '🌱', label: 'Sustainability' },
];

const BenefitsTab = ({
  benefits,
  handleBenefitChange,
  addBenefit,
  removeBenefit,
  errors,
  loading
}) => {
  return (
    <div className="mt-4 space-y-4">
      <Label value="Service Benefits*" />
      {benefits.map((benefit, index) => (
        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <Label value={`Benefit ${index + 1} Title*`} />
              <TextInput
                value={benefit.title}
                onChange={(e) => handleBenefitChange(index, 'title', e.target.value)}
                color={errors[`benefitTitle${index}`] ? 'failure' : 'gray'}
                helperText={errors[`benefitTitle${index}`]}
                disabled={loading}
                placeholder="Expertise you can trust"
              />
            </div>
            <div className="flex items-end justify-end">
              <Button
                color="failure"
                size="xs"
                onClick={() => removeBenefit(index)}
                disabled={benefits.length <= 1 || loading}
              >
                <HiOutlineTrash className="mr-1" /> Remove
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label value="Icon" />
              <Select
                value={benefit.icon || '✅'}
                onChange={(e) => handleBenefitChange(index, 'icon', e.target.value)}
                disabled={loading}
              >
                {benefitIcons.map(icon => (
                  <option key={icon.value} value={icon.value}>{icon.label} {icon.value}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label value={`Description*`} />
              <Textarea
                value={benefit.description}
                onChange={(e) => handleBenefitChange(index, 'description', e.target.value)}
                rows={3}
                color={errors[`benefitDesc${index}`] ? 'failure' : 'gray'}
                helperText={errors[`benefitDesc${index}`]}
                disabled={loading}
                placeholder="Our team is fully licensed and certified..."
              />
            </div>
          </div>
        </div>
      ))}
      <Button
        gradientMonochrome="info"
        onClick={addBenefit}
        disabled={loading}
      >
        <HiOutlinePlus className="mr-2" /> Add Benefit
      </Button>
    </div>
  );
};

export default BenefitsTab;