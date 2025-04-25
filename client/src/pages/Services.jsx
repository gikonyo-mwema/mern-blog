import React, { useState } from 'react';
import { 
  HiOutlineClipboardCheck,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineGlobe
} from 'react-icons/hi';
import { Button, Badge } from 'flowbite-react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100 transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-center">
          {service.icon}
        </div>
        <h3 className="text-xl font-bold text-teal-800 mb-3 text-center">
          {service.title}
        </h3>
        <p className="text-gray-600 mb-4 text-center">
          {service.description}
        </p>
        
        <div className="mt-6 flex justify-center">
          <Link to={`/service/${service.id}`}>
            <Button outline gradientDuoTone="tealToLime" size="sm">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function Services() {
  const [activeTab, setActiveTab] = useState('all');
  
  const services = [
    {
      id: 1,
      title: "Project Environmental Impact Assessments",
      icon: <HiOutlineClipboardCheck className="w-8 h-8 mb-3 text-teal-600" />,
      description: "Comprehensive assessments to understand and mitigate environmental and social impacts of new projects.",
      category: "assessments",
      features: [
        "Compliance with national and international standards",
        "Stakeholder engagement and mitigation strategy development",
        "Enhances reputation and competitive advantage",
        "Secures timely approvals and funding",
        "Maximizes return while maintaining environmental performance"
      ]
    },
    {
      id: 2,
      title: "Environmental Auditing",
      icon: <HiOutlineChartBar className="w-8 h-8 mb-3 text-teal-600" />,
      description: "Go beyond compliance to mitigate long-term risk and improve organizational effectiveness.",
      category: "compliance",
      features: [
        "Identifies and manages environmental risks",
        "Improves sustainability performance",
        "Demonstrates efforts to key stakeholders",
        "Achieves greater organizational effectiveness",
        "Maximizes business value from EHSS activities"
      ]
    },
    {
      id: 3,
      title: "Environmental & Social Safeguards",
      icon: <HiOutlineUsers className="w-8 h-8 mb-3 text-teal-600" />,
      description: "Manage social impacts and build productive relationships with communities.",
      category: "safeguards",
      features: [
        "Community engagement and impact management",
        "Corporate social responsibility programs",
        "Reputation and risk management",
        "Stakeholder relationship building",
        "Prevention of project delays and financial consequences"
      ]
    },
    {
      id: 4,
      title: "Design-Phase Impact & Risk Mitigation",
      icon: <HiOutlineShieldCheck className="w-8 h-8 mb-3 text-teal-600" />,
      description: "Early identification and addressing of environmental risks in project design.",
      category: "planning",
      features: [
        "Comprehensive site investigations",
        "Enhanced risk analysis and characterization",
        "Regulatory standard compliance",
        "Sustainability-focused design solutions",
        "Faster, smarter decision-making for proposed sites"
      ]
    },
    {
      id: 5,
      title: "Regulatory Permitting & NEMA Approvals",
      icon: <HiOutlineDocumentText className="w-8 h-8 mb-3 text-teal-600" />,
      description: "Streamlined environmental compliance licensing and approvals.",
      category: "compliance",
      features: [
        "Waste transport license acquisition",
        "Effluent discharge licensing",
        "Plastic packaging clearances",
        "Emission licenses",
        "Future compliance planning and commercial advantage"
      ]
    },
    {
      id: 6,
      title: "Green Economy & Sustainability Solutions",
      icon: <HiOutlineGlobe className="w-8 h-8 mb-3 text-teal-600" />,
      description: "Sustainability reporting and brand development aligned with global standards.",
      category: "sustainability",
      features: [
        "Sustainability reporting framework development",
        "Data evaluation and presentation",
        "Sustainability branding and messaging",
        "Infographic and visual content creation",
        "Alignment with international best practices"
      ]
    }
  ];

  const filteredServices = activeTab === 'all' 
    ? services 
    : services.filter(service => service.category === activeTab);

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'assessments', name: 'Assessments' },
    { id: 'compliance', name: 'Compliance' },
    { id: 'safeguards', name: 'Safeguards' },
    { id: 'planning', name: 'Planning' },
    { id: 'sustainability', name: 'Sustainability' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-teal-700 mb-4">Our Comprehensive Consultancy Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert solutions to navigate environmental compliance, mitigate risks, and achieve sustainable development goals.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <Badge
              key={category.id}
              color={activeTab === category.id ? 'success' : 'gray'}
              onClick={() => setActiveTab(category.id)}
              className="cursor-pointer px-4 py-2 rounded-full"
            >
              {category.name}
            </Badge>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-teal-700 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Enhance Your Environmental Strategy?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Get a free consultation to discuss how we can help you meet compliance requirements and achieve your sustainability objectives.
          </p>
          <Button 
            gradientDuoTone="tealToLime"
            size="lg"
            className="mx-auto"
          >
            Request Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}