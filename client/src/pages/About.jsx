import React from 'react';

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-4xl mx-auto p-5 text-center'>
        <h1 className='text-4xl font-semibold text-teal-600 my-10'>About Ecodeed</h1>
        <div className='text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='border border-teal-500 rounded-lg p-4 hover:shadow-lg transition-all'>
            <h2 className='text-xl font-bold text-teal-700 mb-2'>
              Project Environmental Impact Assessments
            </h2>
            <p>
              We provide thorough assessments to evaluate and mitigate the environmental and social impacts of new projects, ensuring compliance with national and international standards.
            </p>
          </div>
          <div className='border border-teal-500 rounded-lg p-4 hover:shadow-lg transition-all'>
            <h2 className='text-xl font-bold text-teal-700 mb-2'>Environmental Auditing</h2>
            <p>
              Our audit programs help manage risks, improve performance, and demonstrate sustainability efforts, delivering value beyond compliance.
            </p>
          </div>
          <div className='border border-teal-500 rounded-lg p-4 hover:shadow-lg transition-all'>
            <h2 className='text-xl font-bold text-teal-700 mb-2'>Environmental and Social Safeguards</h2>
            <p>
              We assist in managing social and environmental impacts, fostering stakeholder relationships, and aligning operations with corporate social responsibility standards.
            </p>
          </div>
          <div className='border border-teal-500 rounded-lg p-4 hover:shadow-lg transition-all'>
            <h2 className='text-xl font-bold text-teal-700 mb-2'>Design-Phase Impact and Risk Mitigation</h2>
            <p>
              Our solutions identify and address risks during the design phase, enabling smarter decisions and better regulatory compliance.
            </p>
          </div>
          <div className='border border-teal-500 rounded-lg p-4 hover:shadow-lg transition-all'>
            <h2 className='text-xl font-bold text-teal-700 mb-2'>Regulatory Permitting and Approvals</h2>
            <p>
              We streamline the process of securing environmental compliance licenses, minimizing costs while adapting to evolving regulations.
            </p>
          </div>
          <div className='border border-teal-500 rounded-lg p-4 hover:shadow-lg transition-all'>
            <h2 className='text-xl font-bold text-teal-700 mb-2'>Green Economy and Sustainability Solutions</h2>
            <p>
              We support organizations in meeting sustainability requirements and enhancing transparency through effective strategies and reporting tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

