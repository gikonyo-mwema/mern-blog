import React from 'react';
import { 
  HiOutlineGlobe,
  HiOutlineUsers,
  HiOutlineChartSquareBar,
  HiOutlineOfficeBuilding,
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
    {
      name: 'Ecodeed Technical Team',
      role: 'Environmental Specialists',
      expertise: 'Impact Assessments & Compliance',
      bio: 'Multidisciplinary team specializing in environmental planning, social safeguards, and natural resource management.',
      qualifications: [
        'NEMA-accredited professionals',
        'Field experience across Kenya',
        'Community engagement specialists'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-teal-700 mb-4">About Ecodeed Consultancy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kenyan-based experts in environmental safeguards, sustainability, and regulatory compliance.
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12 border border-teal-100">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-teal-800 mb-4">Our Foundation</h2>
              <p className="text-gray-600 mb-4">
                Ecodeed Consultancy Company Ltd. was established to deliver science-based environmental solutions that meet Kenya's regulatory standards while promoting sustainable development.
              </p>
              <p className="text-gray-600 mb-4">
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
            <div className="md:w-1/2 bg-gray-100 rounded-lg flex items-center justify-center">
              <HiOutlineOfficeBuilding className="w-32 h-32 text-teal-600 opacity-30" />
              {/* Replace with actual company image */}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-100">
              <div className="flex justify-center text-teal-600 mb-2">
                {stat.icon}
              </div>
              <p className="text-3xl font-bold text-teal-800">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mission & Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-teal-800 mb-8 text-center">Our Approach</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100">
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Mission</h3>
              <p className="text-gray-600">
                To deliver precise environmental safeguards that align projects with Kenya's sustainability goals while ensuring regulatory compliance.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100">
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Vision</h3>
              <p className="text-gray-600">
                A Kenya where development progresses hand-in-hand with environmental protection and community well-being.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100">
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Core Values</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Regulatory Excellence</li>
                <li>Scientific Rigor</li>
                <li>Community-Centric Solutions</li>
                <li>Practical Sustainability</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-teal-800 mb-8 text-center">Meet Our Experts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
                <div className="p-6">
                  <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4 mx-auto">
                    <HiOutlineUsers className="w-10 h-10" />
                    {/* Replace with team avatars */}
                  </div>
                  <h3 className="text-xl font-bold text-teal-800 text-center">{member.name}</h3>
                  <p className="text-teal-600 text-center mb-2">{member.role}</p>
                  <p className="text-sm font-semibold text-gray-500 text-center mb-3">{member.expertise}</p>
                  <p className="text-gray-600 text-center mb-4">{member.bio}</p>
                  
                  {member.qualifications && (
                    <div className="mb-3">
                      <h4 className="font-medium text-teal-700 mb-1">Qualifications:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {member.qualifications.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {member.notableProjects && (
                    <div>
                      <h4 className="font-medium text-teal-700 mb-1">Notable Projects:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {member.notableProjects.map((project, i) => (
                          <li key={i}>• {project}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-teal-700 rounded-xl p-8 text-center text-white">
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