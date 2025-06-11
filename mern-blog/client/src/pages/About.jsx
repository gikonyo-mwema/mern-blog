import React from 'react';
import { 
  HiOutlineGlobe,
  HiOutlineUsers,
  HiOutlineChartSquareBar,
  HiOutlineHand
} from 'react-icons/hi';
import { Button } from 'flowbite-react';

export default function AboutUs() {
  const stats = [
    { value: '5+', label: 'Years Experience', icon: <HiOutlineChartSquareBar className="w-6 h-6" /> },
    { value: '40+', label: 'Projects Completed', icon: <HiOutlineGlobe className="w-6 h-6" /> },
    { value: '20+', label: 'Clients Served', icon: <HiOutlineUsers className="w-6 h-6" /> },
    { value: '100%', label: 'NEMA Compliance', icon: <HiOutlineHand className="w-6 h-6" /> },
  ];

  const team = [
    {
      name: 'Miriam Mukami Mwema',
      role: 'Lead Consultant',
      expertise: 'Environmental Safeguards & Sustainability',
      bio: 'NEMA-certified expert with 5+ years in ESIAs, audits, and occupational health & safety across mining, healthcare, and infrastructure sectors.',
      qualifications: [
        'BSc Environmental Science (Maseno University)',
        'NEMA Registered Expert (Reg. No. 10568)',
        'Member, Environment Institute of Kenya'
      ],
      notableProjects: [
        'Nyeri County Government environmental audits',
        'Mining EIAs (Valencia Mining, Zheng Wei Technical)',
        'Infrastructure projects (Sino Hydro, STECOL)'
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-teal-700 dark:text-teal-400 mb-4">About Ecodeed Consultancy</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Kenyan-based experts in environmental safeguards, sustainability, and regulatory compliance.
          </p>
        </div>

        {/* Our Company */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-12 border border-teal-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-teal-800 dark:text-teal-300 mb-4">Our Company</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Ecodeed Consultancy Company Ltd. was established to deliver science-based environmental solutions that meet Kenya's regulatory standards while promoting sustainable development.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                With our NEMA-certified leadership, we've successfully guided 40+ projects through environmental compliance processes across diverse sectors including mining, healthcare, and infrastructure.
              </p>
              <Button 
                gradientDuoTone="tealToLime"
                className="w-full md:w-auto"
                onClick={() => {/* Add portfolio modal */}}
              >
                View Our Project Portfolio
              </Button>
            </div>
            <div className="md:w-1/2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center p-4">
              <img 
                src="https://res.cloudinary.com/dcrubaesi/image/upload/v1737333837/ECODEED_COLORED_LOGO_wj2yy8.png" 
                alt="Ecodeed Logo" 
                className="max-h-48 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center border border-gray-100 dark:border-gray-700">
              <div className="flex justify-center text-teal-600 dark:text-teal-400 mb-2">
                {stat.icon}
              </div>
              <p className="text-3xl font-bold text-teal-800 dark:text-teal-300">{stat.value}</p>
              <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mission & Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-teal-800 dark:text-teal-300 mb-8 text-center">Our Approach</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-teal-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-teal-700 dark:text-teal-400 mb-3">Mission</h3>
              <p className="text-gray-600 dark:text-gray-300">
                To deliver precise environmental safeguards that align projects with Kenya's sustainability goals while ensuring regulatory compliance.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-teal-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-teal-700 dark:text-teal-400 mb-3">Vision</h3>
              <p className="text-gray-600 dark:text-gray-300">
                A Kenya where development progresses hand-in-hand with environmental protection and community well-being.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-teal-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-teal-700 dark:text-teal-400 mb-3">Core Values</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                <li>Regulatory Excellence</li>
                <li>Scientific Rigor</li>
                <li>Community-Centric Solutions</li>
                <li>Practical Sustainability</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Section - Updated to horizontal layout */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-teal-800 dark:text-teal-300 mb-8 text-center">Meet Our Experts</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-teal-100 dark:border-gray-700 w-full md:max-w-2xl">
                <div className="p-6">
                  <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4 mx-auto">
                    <HiOutlineUsers className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-teal-800 dark:text-teal-300 text-center">{member.name}</h3>
                  <p className="text-teal-600 dark:text-teal-400 text-center mb-2">{member.role}</p>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 text-center mb-3">{member.expertise}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-4">{member.bio}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {member.qualifications && (
                      <div className="mb-3">
                        <h4 className="font-medium text-teal-700 dark:text-teal-400 mb-1">Qualifications:</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          {member.qualifications.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {member.notableProjects && (
                      <div className="mb-3">
                        <h4 className="font-medium text-teal-700 dark:text-teal-400 mb-1">Notable Projects:</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          {member.notableProjects.map((project, i) => (
                            <li key={i}>• {project}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-teal-700 dark:bg-teal-800 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Need Environmental Compliance Support?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Our team is ready to guide your project through NEMA requirements with precision and efficiency.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              gradientDuoTone="tealToLime"
              size="lg"
              onClick={() => {/* Add services link */}}
            >
              Our Services
            </Button>
            <Button 
              outline
              color="light"
              size="lg"
              onClick={() => {/* Add contact link */}}
            >
              Contact Miriam Directly
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}