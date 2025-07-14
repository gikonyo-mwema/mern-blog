#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/service.model.js';

// Load environment variables
dotenv.config();

// Utility function to generate a URL-friendly slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace spaces/punctuation with dashes
    .replace(/(^-|-$)+/g, '');   // Trim starting/ending dashes
}

// Full services data
const servicesData = [
  {
    title: "Environmental Impact Assessment (EIA) Services",
    shortDescription: "Helping your project move forward—the right way with comprehensive EIA services.",
    fullDescription: `Starting a project can be exciting… and overwhelming. You’ve got a vision, a plan, and maybe even some investors ready to go. But then comes the NEMA Approval process, the paperwork, the site visits, and the public consultations. It’s easy to feel stuck or unsure about what comes next. That’s where Ecodeed steps in. We’re not just about ticking boxes or writing reports. We’re your partners in navigating the entire EIA journey, from the moment you bring your project idea to us, all the way through licensing and beyond.

Our team has helped more than 70 projects get their environmental approvals in Kenya. We’ve walked the path with petrol station owners, hospital builders, farmers, quarry operators, and many more. We’ve seen the common hurdles and learned how to get projects moving smoothly without wasting time or money.`,
    icon: "eia-icon.svg",
    benefits: [
      {
        title: "Expertise you can trust",
        description: "Our team is fully licensed and certified, with deep experience in Kenya’s environmental regulations."
      },
      {
        title: "Hands-on support",
        description: "We guide you through every step, keeping things simple and transparent."
      },
      {
        title: "Saving you time and money",
        description: "We handle the complex parts so you can focus on building your project."
      },
      {
        title: "Respect and communication",
        description: "We listen to your concerns and tailor solutions to your unique situation."
      }
    ],
    examples: [
      "Petrol stations and fuel storage",
      "Hospitals and health centers",
      "Agricultural farms and agribusiness",
      "Residential and commercial developments",
      "Mining and quarry operations",
      "Processing plants like dairies and factories",
      "Road construction and maintenance",
      "Irrigation and water supply projects",
      "Schools and educational institutions"
    ],
    faqs: [
      {
        question: "How long does the EIA process typically take?",
        answer: "The duration varies depending on project complexity, but we work efficiently to complete the process as quickly as possible while ensuring all requirements are met."
      },
      {
        question: "What documents do I need to start the EIA process?",
        answer: "Basic project details and site information are enough to get started. We'll guide you on any additional documents needed as we progress."
      }
    ]
  },
  {
    title: "Environmental Audit Services",
    shortDescription: "Keeping your business compliant, responsible, and sustainable with professional environmental audits.",
    fullDescription: `Do you know if your project is truly meeting environmental standards? It's not always easy to tell — especially when regulations change, operations evolve, and environmental expectations grow. But one thing is clear: regular environmental audits are essential to protect your investment, comply with NEMA regulations, and demonstrate your commitment to sustainability.

For years, we've partnered with businesses and institutions across Kenya to conduct thorough, professional environmental audits. From the bustling agricultural farms to busy factories and critical health facilities, we bring clarity and confidence to your environmental performance.`,
    icon: "audit-icon.svg",
    benefits: [
      {
        title: "Experienced and Certified Team",
        description: "Our auditors are fully licensed environmental experts who understand the nuances of Kenyan regulations and industry standards."
      },
      {
        title: "Tailored, Practical Solutions",
        description: "We don't just identify issues — we help you develop practical steps to improve your environmental management and compliance."
      },
      {
        title: "Transparent Reporting",
        description: "Our audit reports are clear, detailed, and designed to help you make informed decisions and satisfy NEMA requirements."
      },
      {
        title: "Ongoing Support",
        description: "Environmental audits are not a one-time exercise. We provide guidance on how to maintain compliance year-round and prepare for future audits."
      }
    ],
    examples: [
      "Annual Environmental Audit for Kuri Quarry and Crushing Project, Chaka",
      "Annual Environmental Audit for Keremara Limited Agricultural Farm",
      "Initial Environmental Audit for Othaya Market",
      "Initial Environmental Audit for Nyeri Referral Hospital",
      "Initial Environmental Audit for Karatina Sub-County Hospital",
      "Initial Environmental Audit for Karatina Market",
      "Annual Environmental Audit for Nyeri Slaughterhouse",
      "Initial Environmental Audit for Rukira Vocational Training Centre",
      "Initial Environmental Audit for Karatina Children's Home",
      "Annual Environmental Audit for Kagumo Teachers Training College"
    ],
    faqs: [
      {
        question: "How often should environmental audits be conducted?",
        answer: "Most businesses require annual audits, but frequency depends on your industry and regulatory requirements. We can advise on the optimal schedule for your operations."
      },
      {
        question: "What's the difference between Initial and Annual Environmental Audits?",
        answer: "An Initial Environmental Audit establishes your baseline compliance, while Annual Audits track progress and identify new areas for improvement."
      }
    ]
  },
  {
    title: "Environmental Safeguards & Policy Advisory",
    shortDescription: "Shaping stronger policies, building sustainable futures with expert advisory services.",
    fullDescription: `Are you struggling to navigate complex environmental and social safeguards? With ever-evolving regulations, financing requirements, and sustainability goals, integrating safeguards into your business/institution and policies can feel overwhelming. You know environmental stewardship matters, but how do you translate that into actionable strategies that satisfy regulators, partners, employees, donors, and communities?

At Ecodeed, we make it simple. We've walked this path with counties governments, Institutions, and donor-funded programs across Kenya. From crafting in-depth State of the Environment Reports to developing county-level Environmental Action Plans, we help you turn data and regulations into clear, actionable policies that drive impact.`,
    icon: "policy-icon.svg",
    benefits: [
      {
        title: "Deep Local Expertise",
        description: "We understand Kenya's environmental governance landscape and donor expectations."
      },
      {
        title: "Proven Track Record",
        description: "Our work has shaped policies and safeguards that guide some of the most critical county-level environmental initiatives."
      },
      {
        title: "Collaborative Approach",
        description: "We partner closely with your team, ensuring solutions are practical, locally relevant, and owned by those who implement them."
      },
      {
        title: "Holistic Perspective",
        description: "We don't just focus on compliance — we help build resilience and sustainability into the heart of your policies and programs."
      }
    ],
    examples: [
      "Environmental and Social Safeguard Assessments (ESSAs)",
      "Environmental Action Plans (EAPs)",
      "State of the Environment (SoE) Reports",
      "Capacity Building and Training",
      "Policy Analysis & Advisory",
      "Mainstreaming Safeguards into county strategies"
    ],
    faqs: [
      {
        question: "What makes Environmental and Social Safeguard Assessments different from other environmental assessments?",
        answer: "ESSAs specifically evaluate social as well as environmental risks for projects, often required by donors to ensure projects benefit communities without causing harm."
      },
      {
        question: "How do County Environmental Action Plans relate to other county plans?",
        answer: "CEAPs align closely with the County Integrated Development Plans (CIDPs) and sector strategies to ensure environment is part of the county's long-term vision."
      }
    ]
  },
  {
    title: "Climate Change & Sustainability Solutions",
    shortDescription: "Transform your business for a low-carbon future — navigate risk, capture opportunity, build trust.",
    fullDescription: `Climate change isn't coming, it's here. Investors demand proof you're managing environmental risks. Customers won't buy from companies they don't trust. Communities hold businesses accountable. Employees want to work for purpose-driven organizations. Your competitors are already racing to embed sustainability into their core strategies. The question is: where do you stand?

Ignoring climate risks isn't just risky, it's costly. Delayed action means lost investments, shrinking market share, legal liabilities, and damaged reputation. But this challenge is also your greatest chance to lead.`,
    icon: "climate-icon.svg",
    benefits: [
      {
        title: "Comprehensive Climate Risk & Opportunity Assessment",
        description: "We analyze your entire value chain identifying vulnerabilities and growth potentials in the face of climate change."
      },
      {
        title: "Tailored Climate Scenario Analysis",
        description: "We test how your business performs under multiple climate futures to sharpen your strategy."
      },
      {
        title: "Financial Impact Modelling",
        description: "We translate climate data into clear cost and revenue projections for informed decision-making."
      },
      {
        title: "Strategic Sustainability Roadmap",
        description: "A step-by-step plan that integrates climate action into your business operations and reporting frameworks."
      }
    ],
    examples: [
      "Climate Risk & Opportunity Assessment",
      "Climate Scenario Analysis",
      "Financial Impact Modelling",
      "Stakeholder Engagement & Capacity Building",
      "Sustainability Roadmapping",
      "Ongoing Advisory & Compliance Support"
    ],
    faqs: [
      {
        question: "How does climate change specifically affect businesses in Kenya?",
        answer: "Kenyan businesses face physical risks like droughts and floods disrupting operations, transition risks from changing regulations, and market shifts as consumers demand sustainable products."
      },
      {
        question: "Can small and medium businesses benefit from these services?",
        answer: "Absolutely! We tailor our services to businesses of all sizes. Addressing climate risks and opportunities early can give SMEs a competitive advantage."
      }
    ]
  }
];

// Add slug to each service
servicesData.forEach(service => {
  service.slug = generateSlug(service.title);
});

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected for seeding');

    await Service.deleteMany({});
    console.log('🧹 Cleared existing services');

    const inserted = await Service.insertMany(servicesData);
    console.log(`🌱 Seeded ${inserted.length} services successfully!`);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run the seeding script
seedDatabase();

