import React from 'react';
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

export default function Courses() {
  // Course offerings data
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
    },
    // Add more FAQs as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-teal-700 mb-4">Environmental Consultancy Training Program</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From Zero to Paid Projects: Start & Grow Your Environmental Consultancy
          </p>
        </div>

        {/* Program Overview */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12 border border-teal-100">
          <h2 className="text-3xl font-bold text-teal-800 mb-6">This Program Is For You If:</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>You're fresh out of school & unsure how to start</li>
              <li>You've heard of EIA & Audits but don't know what to offer</li>
            </ul>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>You want real guidance from someone doing it in the field</li>
              <li>You're tired of waiting for "connections" to make it</li>
            </ul>
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-teal-800 mb-8 text-center">What You'll Learn</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100">
              <HiOutlineClipboardCheck className="w-8 h-8 mb-3 text-teal-600" />
              <h3 className="text-xl font-semibold text-teal-700 mb-2">Business Setup</h3>
              <p className="text-gray-600">How to legally set up your consultancy practice</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100">
              <HiOutlineChartBar className="w-8 h-8 mb-3 text-teal-600" />
              <h3 className="text-xl font-semibold text-teal-700 mb-2">Core Services</h3>
              <p className="text-gray-600">Breakdown of EIA, Audits and other key services</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100">
              <HiOutlineCurrencyDollar className="w-8 h-8 mb-3 text-teal-600" />
              <h3 className="text-xl font-semibold text-teal-700 mb-2">Pricing Strategies</h3>
              <p className="text-gray-600">How to price services + write winning reports</p>
            </div>
            {/* Add more learning points */}
          </div>
        </div>

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
              <Button gradientDuoTone="tealToLime">Book Your Session Now</Button>
            </div>
          </div>
        </div>

        {/* About Instructor */}
        <div className="bg-teal-50 rounded-xl p-8 mb-12 border border-teal-100">
          <h2 className="text-2xl font-bold text-teal-800 mb-4">About Your Instructor</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4 flex justify-center">
              <div className="w-32 h-32 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                <HiOutlineUserCircle className="w-16 h-16" />
              </div>
            </div>
            <div className="md:w-3/4">
              <h3 className="text-xl font-semibold text-teal-700 mb-2">Mukami Mwema</h3>
              <p className="text-gray-600 mb-4">
                Licensed environmental expert, consultant, and founder of Ecodeed Consultancy with years of experience helping clients navigate environmental compliance and sustainability challenges.
              </p>
              <p className="text-gray-600">
                "I created this program to help you skip the years of confusion and start actually building your consultancy with confidence."
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-teal-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-teal-700 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-teal-700 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Consultancy Journey?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Choose the program that fits your needs and begin building your environmental consultancy today.
          </p>
          <Button 
            gradientDuoTone="tealToLime"
            size="lg"
            className="mx-auto"
          >
            Compare All Options
          </Button>
        </div>

      </div>
    </div>
  );
}