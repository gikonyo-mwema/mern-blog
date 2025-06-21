import { Label, TextInput, Textarea, Button } from 'flowbite-react';
import { HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

const ProcessStepsTab = ({
  processSteps,
  handleProcessStepChange,
  addProcessStep,
  removeProcessStep,
  errors,
  loading
}) => {
  return (
    <div className="mt-4 space-y-4">
      <Label value="Our Process Steps*" />
      {processSteps.map((step, index) => (
        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <Label value={`Step ${index + 1} Title*`} />
              <TextInput
                value={step.title}
                onChange={(e) => handleProcessStepChange(index, 'title', e.target.value)}
                color={errors[`processStepTitle${index}`] ? 'failure' : 'gray'}
                helperText={errors[`processStepTitle${index}`]}
                disabled={loading}
                placeholder="Initial site visit and assessment"
              />
            </div>
            <div className="flex items-end justify-end">
              <Button
                color="failure"
                size="xs"
                onClick={() => removeProcessStep(index)}
                disabled={processSteps.length <= 1 || loading}
              >
                <HiOutlineTrash className="mr-1" /> Remove
              </Button>
            </div>
          </div>
          <div>
            <Label value={`Step ${index + 1} Description*`} />
            <Textarea
              value={step.description}
              onChange={(e) => handleProcessStepChange(index, 'description', e.target.value)}
              rows={3}
              color={errors[`processStepDesc${index}`] ? 'failure' : 'gray'}
              helperText={errors[`processStepDesc${index}`]}
              disabled={loading}
              placeholder="Detailed description of this process step"
            />
          </div>
        </div>
      ))}
      <Button
        gradientMonochrome="info"
        onClick={addProcessStep}
        disabled={loading}
      >
        <HiOutlinePlus className="mr-2" /> Add Process Step
      </Button>
    </div>
  );
};

export default ProcessStepsTab;