import React, { useState } from 'react';
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
import PaymentModal from '../components/PaymentModal';

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const courseTiers = [
    {
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
      cta: "Book a discovery call with Mukami",
      icon: <HiOutlineUserCircle className="w-8 h-8 mb-3 text-teal-600" />
    },
    {
      id: 2,
      title: "90-Day Mentorship + Course",
      price: "Ksh 10,000",
      features: [
        "Full access to the complete online course",
        "Bi-weekly group or 1:1 mentorship calls (6 sessions)",
        "Accountability check-ins",
        "Bonus templates and guides"
      ],
      cta: "Enroll Now",
      icon: <HiOutlineCalendar className="w-8 h-8 mb-3 text-teal-600" />
    },
    {
      id: 3,
      title: "Self-Paced Course Only",
      price: "Ksh 5,000",
      features: [
        "Full access to pre-recorded course",
        "Downloadable worksheets and tools",
        "Lifetime access + all bonuses",
        "Option to book paid support sessions"
      ],
      cta: "Get Instant Access",
      icon: <HiOutlineClock className="w-8 h-8 mb-3 text-teal-600" />
    }
  ];

  const consultation = {
    title: "90-Minute 'Pick My Brain' Session",
    price: "Ksh 1,000",
    description: "Got questions? Need clarity on a specific challenge? This 90-minute 1:1 session gives you direct insight and action steps.",
    features: [
      "Tailored strategy for your specific needs",
      "Session recording (optional)",
      "Immediate clarity and next steps"
    ],
    icon: <HiOutlineClipboardCheck className="w-8 h-8 mb-3 text-teal-600" />
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ... HERO, OVERVIEW, LEARNING SECTIONS ... */}

        {/* Course Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-teal-800 mb-8 text-center">Program Options</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courseTiers.map((tier) => (
              <div key={tier.id} className={`bg-white rounded-xl shadow-md overflow-hidden border ${tier.badge ? 'border-teal-300' : 'border-teal-100'}`}>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex justify-center w-full">
                      {tier.icon}
                    </div>
                    {tier.badge && (
                      <Badge color="success" className="ml-2">
                        {tier.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-teal-800 mb-2 text-center">{tier.title}</h3>
                  <p className="text-2xl font-bold text-center mb-2">{tier.price}</p>
                  {tier.paymentOption && (
                    <p className="text-gray-500 text-center mb-4 text-sm">{tier.paymentOption}</p>
                  )}
                  <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <Button 
                    gradientDuoTone={tier.badge ? "tealToLime" : "grayToGray"}
                    className="w-full"
                    onClick={() => {
                      setSelectedCourse(tier);
                      setShowPaymentModal(true);
                    }}
                  >
                    {tier.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
                onClick={() => {
                  setSelectedCourse(consultation);
                  setShowPaymentModal(true);
                }}
              >
                Book Your Session Now
              </Button>
            </div>
          </div>
        </div>

        {/* ... ABOUT, FAQS, CTA SECTIONS ... */}

        {/* Payment Modal */}
        <PaymentModal
          showModal={showPaymentModal}
          setShowModal={setShowPaymentModal}
          item={selectedCourse}
          itemType="course"
          onPaymentSuccess={() => {
            console.log('Payment successful for:', selectedCourse?.title);
          }}
        />
      </div>
    </div>
  );
}
