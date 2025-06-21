import { Label, TextInput, Button } from 'flowbite-react';
import { HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

const ProjectTypesTab = ({
  projectTypes,
  handleProjectTypeChange,
  addProjectType,
  removeProjectType,
  errors,
  loading
}) => {
  return (
    <div className="mt-4 space-y-4">
      <Label value="Supported Project Types*" />
      {projectTypes.map((type, index) => (
        <div key={index} className="flex gap-2 items-center">
          <div className="flex-1">
            <TextInput
              value={type}
              onChange={(e) => handleProjectTypeChange(index, e.target.value)}
              color={errors[`projectType${index}`] ? 'failure' : 'gray'}
              helperText={errors[`projectType${index}`]}
              disabled={loading}
              placeholder="Petrol stations and fuel storage"
            />
          </div>
          <Button
            color="failure"
            size="xs"
            onClick={() => removeProjectType(index)}
            disabled={projectTypes.length <= 1 || loading}
          >
            <HiOutlineTrash />
          </Button>
        </div>
      ))}
      <Button
        gradientMonochrome="info"
        onClick={addProjectType}
        disabled={loading}
      >
        <HiOutlinePlus className="mr-2" /> Add Project Type
      </Button>
    </div>
  );
};

export default ProjectTypesTab;