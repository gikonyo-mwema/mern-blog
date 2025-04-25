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
    { value: '15+', label: 'Years Experience', icon: <HiOutlineChartSquareBar className="w-6 h-6" /> },
    { value: '200+', label: 'Projects Completed', icon: <HiOutlineGlobe className="w-6 h-6" /> },
    { value: '50+', label: 'Clients Worldwide', icon: <HiOutlineUsers className="w-6 h-6" /> },
    { value: '100%', label: 'Compliance Rate', icon: <HiOutlineHand className="w-6 h-6" /> },
  ];

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Founder & CEO',
      expertise: 'Environmental Policy',
      bio: 'PhD in Environmental Science with 20 years of industry experience.'
    },
    {
      name: 'Michael Chen',
      role: 'Lead Consultant',
      expertise: 'Sustainability Audits',
      bio: 'Specialized in circular economy implementations across manufacturing sectors.'
    },
    // Add more team members...
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-teal-700 mb-4">About Our Environmental Consultancy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pioneering sustainable solutions through science, innovation, and decades of expertise.
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12 border border-teal-100">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-teal-800 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2008, our consultancy began as a small team of environmental scientists passionate about making a tangible difference. 
              </p>
              <p className="text-gray-600 mb-4">
                Today, we've grown into a global leader in environmental solutions, helping organizations across industries navigate complex sustainability challenges while maintaining operational excellence.
              </p>
              <Button 
                gradientDuoTone="tealToLime"
                className="w-full md:w-auto"
                onClick={() => {/* Add history modal */}}
              >
                Our Journey Timeline
              </Button>
            </div>
            <div className="md:w-1/2 bg-gray-100 rounded-lg flex items-center justify-center">
              <HiOutlineOfficeBuilding className="w-32 h-32 text-teal-600 opacity-30" />
              {/* Replace with actual image */}
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
          <h2 className="text-3xl font-bold text-teal-800 mb-8 text-center">Our Mission & Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100">
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Mission</h3>
              <p className="text-gray-600">
                To empower organizations with science-based environmental strategies that drive sustainable growth while protecting our planet.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100">
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Vision</h3>
              <p className="text-gray-600">
                A world where economic development and environmental stewardship work in harmony for future generations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100">
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Core Values</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Scientific Integrity</li>
                <li>Sustainable Innovation</li>
                <li>Client Partnership</li>
                <li>Environmental Justice</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-teal-800 mb-8 text-center">Meet Our Leadership</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
                <div className="p-6">
                  <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4 mx-auto">
                    <HiOutlineUsers className="w-10 h-10" />
                    {/* Replace with actual avatar */}
                  </div>
                  <h3 className="text-xl font-bold text-teal-800 text-center">{member.name}</h3>
                  <p className="text-teal-600 text-center mb-2">{member.role}</p>
                  <p className="text-sm font-semibold text-gray-500 text-center mb-3">{member.expertise}</p>
                  <p className="text-gray-600 text-center">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-teal-700 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Want to Join Our Mission?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            We're always looking for passionate environmental professionals to join our growing team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              gradientDuoTone="tealToLime"
              size="lg"
              onClick={() => {/* Add careers link */}}
            >
              View Open Positions
            </Button>
            <Button 
              outline
              color="light"
              size="lg"
              onClick={() => {/* Add contact link */}}
            >
              Contact Our Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}