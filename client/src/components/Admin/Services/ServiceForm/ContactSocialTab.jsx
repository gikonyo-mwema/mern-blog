import { Label, TextInput, Button, Select } from 'flowbite-react';
import { HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

const socialPlatforms = [
  { value: 'twitter', label: 'Twitter' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
];

const ContactSocialTab = ({
  contactInfo,
  handleContactInfoChange,
  socialLinks,
  handleSocialLinkChange,
  addSocialLink,
  removeSocialLink,
  errors,
  loading
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="md:col-span-2">
        <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
      </div>

      <div>
        <Label htmlFor="contactEmail" value="Email" />
        <TextInput
          id="contactEmail"
          name="email"
          type="email"
          value={contactInfo.email}
          onChange={handleContactInfoChange}
          color={errors.email ? 'failure' : 'gray'}
          helperText={errors.email}
          disabled={loading}
          placeholder="info@ecodeed.co.ke"
        />
      </div>

      <div>
        <Label htmlFor="contactPhone" value="Phone" />
        <TextInput
          id="contactPhone"
          name="phone"
          value={contactInfo.phone}
          onChange={handleContactInfoChange}
          color={errors.phone ? 'failure' : 'gray'}
          helperText={errors.phone}
          disabled={loading}
          placeholder="+254791233100"
        />
      </div>

      <div>
        <Label htmlFor="website" value="Website" />
        <TextInput
          id="website"
          name="website"
          value={contactInfo.website}
          onChange={handleContactInfoChange}
          color={errors.website ? 'failure' : 'gray'}
          helperText={errors.website}
          disabled={loading}
          placeholder="https://www.ecodeed.co.ke"
        />
      </div>

      <div>
        <Label htmlFor="calendlyLink" value="Calendly Link" />
        <TextInput
          id="calendlyLink"
          name="calendlyLink"
          value={contactInfo.calendlyLink}
          onChange={handleContactInfoChange}
          disabled={loading}
          placeholder="https://calendly.com/ecodeed"
        />
      </div>

      <div className="md:col-span-2 mt-6">
        <h3 className="text-lg font-semibold mb-3">Social Links</h3>
        {socialLinks.map((link, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
            <div className="md:col-span-2">
              <Label value="Platform" />
              <Select
                value={link.platform}
                onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                disabled={loading}
              >
                <option value="">Select platform</option>
                {socialPlatforms.map(platform => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label value="URL" />
              <TextInput
                value={link.url}
                onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                color={errors[`socialUrl${index}`] ? 'failure' : 'gray'}
                helperText={errors[`socialUrl${index}`]}
                disabled={loading}
                placeholder="https://"
              />
            </div>
            <div className="flex items-end">
              <Button
                color="failure"
                size="xs"
                onClick={() => removeSocialLink(index)}
                disabled={socialLinks.length <= 1 || loading}
              >
                <HiOutlineTrash />
              </Button>
            </div>
          </div>
        ))}
        <Button
          gradientMonochrome="info"
          onClick={addSocialLink}
          disabled={loading}
        >
          <HiOutlinePlus className="mr-2" /> Add Social Link
        </Button>
      </div>
    </div>
  );
};

export default ContactSocialTab;