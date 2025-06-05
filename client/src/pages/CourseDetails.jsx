import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineUserCircle } from 'react-icons/hi';
import { Button } from 'flowbite-react';

const coursesData = {
  'private-mentorship': {
    title: "Private Mentorship",
    description: "Detailed description of the mentorship program...",
    features: [
      "Private onboarding call + custom mentorship plan",
      "Unlimited Email/WhatsApp access",
      // ... other features
    ],
    price: "Ksh 20,000",
    externalUrl: "https://external-platform.com/private-mentorship"
  },
  // ... other courses
};

export default function CourseDetails() {
  const { slug } = useParams();
  const course = coursesData[slug];
  const [isProcessing, setIsProcessing] = useState(false);

  if (!course) return <div>Course not found</div>;

  const handleEnroll = () => {
    setIsProcessing(true);
    // Redirect to external payment platform
    window.location.href = course.externalUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-teal-800 mb-6">{course.title}</h1>
        
        <div className="prose max-w-none mb-8">
          <p>{course.description}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Course Features</h2>
          <ul className="space-y-2">
            {course.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <HiOutlineCheckCircle className="h-5 w-5 text-teal-500 mr-2 mt-0.5" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-teal-50 p-6 rounded-lg border border-teal-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-teal-800">{course.price}</p>
              <p className="text-gray-600">One-time payment</p>
            </div>
            <Button
              gradientDuoTone="tealToLime"
              size="lg"
              onClick={handleEnroll}
              disabled={isProcessing}
            >
              {isProcessing ? 'Redirecting...' : 'Enroll Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}