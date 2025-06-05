import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { HiOutlineCheckCircle } from 'react-icons/hi'; 
import { 
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineClipboardCheck,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineMail,
  HiOutlineUserCircle
} from 'react-icons/hi';
import { Button, Badge } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import CourseCard from '../components/Admin/Courses/CourseCard';
import PaymentModal from '../components/PaymentModal';

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  // Course data for the card view
  const courseCards = [
    {
      id: 1,
      slug: 'private-mentorship',
      title: "Private Mentorship",
      shortDescription: "1-on-1 guidance with custom learning plan",
      icon: <HiOutlineUserCircle className="w-12 h-12 text-teal-600" />
    },
    {
      id: 2,
      slug: '90-day-mentorship',
      title: "90-Day Mentorship",
      shortDescription: "Structured program with group support",
      icon: <HiOutlineCalendar className="w-12 h-12 text-teal-600" />
    },
    {
      id: 3,
      slug: 'self-paced-course',
      title: "Self-Paced Course",
      shortDescription: "Learn at your own pace with full resources",
      icon: <HiOutlineClock className="w-12 h-12 text-teal-600" />
    }
  ];

  // Full course details (would normally come from API)
  const courseDetails = {
    'private-mentorship': {
      id: 1,
      title: "Private Mentorship",
      price: "Ksh 20,000",
      paymentOption: "or 2 payments of Ksh 10,000",
      badge: "Most Popular",
      features: [
        "Private onboarding call + custom mentorship plan",
        "Unlimited Email/WhatsApp access during working hours",
        "Full access to the online course + bonuses",
        "Priority scheduling for 1:1 calls (up to 8 sessions)",
        "Custom resources and templates"
      ],
      description: "Get personalized guidance with our premium 1-on-1 mentorship program designed to accelerate your consulting business growth with tailored strategies.",
      cta: "Book a discovery call with Mukami",
      icon: <HiOutlineUserCircle className="w-8 h-8 mb-3 text-teal-600" />,
      externalUrl: "https://external-platform.com/private-mentorship"
    },
    '90-day-mentorship': {
      id: 2,
      title: "90-Day Mentorship + Course",
      price: "Ksh 10,000",
      features: [
        "Full access to the complete online course",
        "Bi-weekly group or 1:1 mentorship calls (6 sessions)",
        "Accountability check-ins",
        "Bonus templates and guides"
      ],
      description: "Our structured 3-month program combines comprehensive course materials with regular mentorship sessions to keep you on track and accountable.",
      cta: "Enroll Now",
      icon: <HiOutlineCalendar className="w-8 h-8 mb-3 text-teal-600" />,
      externalUrl: "https://external-platform.com/90-day-mentorship"
    },
    'self-paced-course': {
      id: 3,
      title: "Self-Paced Course Only",
      price: "Ksh 5,000",
      features: [
        "Full access to pre-recorded course",
        "Downloadable worksheets and tools",
        "Lifetime access + all bonuses",
        "Option to book paid support sessions"
      ],
      description: "Perfect for independent learners, this comprehensive course gives you lifetime access to all materials with the flexibility to learn at your own pace.",
      cta: "Get Instant Access",
      icon: <HiOutlineClock className="w-8 h-8 mb-3 text-teal-600" />,
      externalUrl: "https://external-platform.com/self-paced-course"
    }
  };

  const consultation = {
    title: "90-Minute 'Pick My Brain' Session",
    price: "Ksh 1,000",
    description: "Got questions? Need clarity on a specific challenge? This 90-minute 1:1 session gives you direct insight and action steps.",
    features: [
      "Tailored strategy for your specific needs",
      "Session recording (optional)",
      "Immediate clarity and next steps"
    ],
    icon: <HiOutlineClipboardCheck className="w-8 h-8 mb-3 text-teal-600" />,
    externalUrl: "https://external-platform.com/consultation"
  };

  const faqs = [
    {
      question: "Who is this mentorship program for?",
      answer: "This program is designed for new, aspiring, and practicing environmental consultants who want to build a profitable and purpose-driven consultancy business."
    },
    {
      question: "Can I join from outside Kenya?",
      answer: "Yes! The entire program is online and accessible globally. All live calls are held via Zoom or Google Meet."
    }
  ];

  // Check if we're viewing a specific course (from URL)
  const { slug } = useParams();
  const isCourseDetailView = slug && courseDetails[slug];

  if (isCourseDetailView) {
    const course = courseDetails[slug];
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            outline 
            gradientDuoTone="tealToLime" 
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            ← Back to All Courses
          </Button>
          
          <div className="bg-white rounded-xl shadow-md p-8 border border-teal-100">
            <div className="flex justify-center mb-6">
              {course.icon}
            </div>
            <h1 className="text-3xl font-bold text-teal-800 mb-4 text-center">{course.title}</h1>
            <p className="text-gray-600 mb-8 text-center">{course.description}</p>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">What's Included:</h2>
              <ul className="space-y-3">
                {course.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <HiOutlineCheckCircle className="h-5 w-5 text-teal-500 mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-teal-50 p-6 rounded-lg border border-teal-100 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-2xl font-bold text-teal-800">{course.price}</p>
                  {course.paymentOption && (
                    <p className="text-gray-600 text-sm">{course.paymentOption}</p>
                  )}
                </div>
                <Button
                  gradientDuoTone="tealToLime"
                  size="lg"
                  onClick={() => window.location.href = course.externalUrl}
                >
                  {course.cta}
                </Button>
              </div>
            </div>

            {course.badge && (
              <div className="flex justify-center mb-6">
                <Badge color="success" size="lg">
                  {course.badge}
                </Badge>
              </div>
            )}
          </div>

          {/* FAQ Section */}
          <div className="mt-12 bg-white rounded-xl shadow-md p-8 border border-teal-100">
            <h2 className="text-2xl font-bold text-teal-800 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                  <p className="text-gray-600 mt-1">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default view - all courses grid
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-teal-800 mb-4">Our Courses & Programs</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the learning path that fits your goals and schedule. All programs include lifetime access to materials.
          </p>
        </div>



        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {courseCards.map((course) => (
            <Link to={`/courses/${course.slug}`} key={course.id} className="block">
              <CourseCard course={course} />
            </Link>
          ))}
        </div>


        {/* Consultation Option */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12 border border-teal-100">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3 flex justify-center">
              {consultation.icon}
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-teal-800 mb-2">{consultation.title}</h2>
              <p className="text-xl text-teal-600 mb-4">{consultation.price}</p>
              <p className="text-gray-600 mb-4">{consultation.description}</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-6">
                {consultation.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <Button 
                gradientDuoTone="tealToLime"
                onClick={() => window.location.href = consultation.externalUrl}
              >
                Book Your Session Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;