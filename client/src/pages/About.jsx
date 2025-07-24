import { Link } from "react-router-dom";
import { FaHandshake, FaLightbulb, FaShieldAlt, FaChartLine } from "react-icons/fa";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-brand-blue text-white py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Transforming Compliance Into Competitive Advantage
              </h1>
              <p className="text-xl text-brand-yellow">
                Where environmental responsibility meets business success
              </p>
              <Link
                to="/contact"
                className="inline-block bg-brand-green hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
              >
                Get Started
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://res.cloudinary.com/dcrubaesi/image/upload/v1737333837/ECODEED_COLORED_LOGO_wj2yy8.png"
                alt="Ecodeed Logo"
                className="w-64 h-64 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-blue dark:text-white mb-4">
              Our Mission
            </h2>
            <div className="w-24 h-1 bg-brand-green mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              At Ecodeed Consulting, we empower businesses, governments, and communities to navigate
              environmental compliance, implement sustainable practices, and future-proof their
              operations—so no dream is lost due to regulatory hurdles.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/3 flex justify-center">
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/dcrubaesi/image/upload/v1753008847/EcodeedUser2_ekhqvm.jpg"
                  alt="Miriam Mukami Mwema"
                  className="w-64 h-64 rounded-full object-cover border-4 border-brand-yellow shadow-lg"
                />
                <div className="absolute -bottom-4 -right-4 bg-brand-green text-white px-4 py-2 rounded-lg shadow-md">
                  <span className="font-bold">CEO & Founder</span>
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-brand-blue dark:text-white mb-6">
                Meet Our Founder: Miriam Mukami Mwema
              </h2>
              <div className="w-24 h-1 bg-brand-green mb-6"></div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Miriam Mukami Mwema is an environmental strategist, sustainability educator, and the
                driving force behind Ecodeed Consulting. With over{" "}
                <span className="font-bold">8 years of experience</span> in environmental impact
                assessments, audits, and regulatory compliance, she has led{" "}
                <span className="font-bold">100+ projects</span> across Kenya, helping businesses and
                counties align with environmental laws while fostering sustainable growth.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                A licensed <span className="font-bold">Environmental Impact Assessment & Audit (EIA/EA) Expert</span>,
                Miriam holds a degree in <span className="font-bold">Environmental Science</span> from Maseno University
                and is trained in <span className="font-bold">ISO 14001:2015 Environmental Management Systems</span>.
              </p>
              <div className="mt-6">
                <Link
                  to="/team"
                  className="inline-flex items-center text-brand-green hover:text-green-700 font-medium transition duration-300"
                >
                  Meet the full team
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founding Story */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-blue dark:text-white mb-4">
              Why Ecodeed Exists
            </h2>
            <div className="w-24 h-1 bg-brand-green mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A story that changed everything
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-700 p-8 rounded-lg shadow-md">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-yellow text-brand-blue">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <blockquote className="text-lg italic text-gray-700 dark:text-gray-300">
                  "That woman's pain became my purpose. I couldn't stand by while dreams were crushed
                  by lack of knowledge or guidance. At Ecodeed, we don't just ensure compliance—we
                  protect visions, livelihoods, and legacies."
                </blockquote>
                <div className="mt-2 text-sm font-medium text-brand-green">
                  — Miriam Mukami Mwema
                </div>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="mb-4">
                Eight years ago, Miriam encountered a woman who had lost her petrol station
                business—and her life's savings—due to <span className="font-bold">unintentional non-compliance</span>{" "}
                with NEMA regulations. Fined, prosecuted, and left in financial ruin, this woman's
                struggle became Miriam's turning point.
              </p>
              <p className="mb-4">
                This moment birthed <span className="font-bold">Ecodeed Consulting</span>—a firm dedicated to:
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-start">
                  <span className="flex-shrink-0 mt-1 mr-2 text-brand-green">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span>Guiding businesses through environmental approvals seamlessly</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 mt-1 mr-2 text-brand-green">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span>Educating clients on compliance to avoid costly penalties</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 mt-1 mr-2 text-brand-green">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span>Championing sustainability as a tool for long-term success</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 mt-1 mr-2 text-brand-green">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span>Ensuring no entrepreneur loses everything due to regulatory gaps</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-blue dark:text-white mb-4">
              What We Stand For
            </h2>
            <div className="w-24 h-1 bg-brand-green mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaShieldAlt className="w-10 h-10 text-brand-green" />,
                title: "Expertise",
                description: "Licensed, experienced, and constantly updating our knowledge"
              },
              {
                icon: <FaChartLine className="w-10 h-10 text-brand-green" />,
                title: "Impact",
                description: "From County Environmental Action Plans to ESG audits, we turn policies into action"
              },
              {
                icon: <FaHandshake className="w-10 h-10 text-brand-green" />,
                title: "Empathy",
                description: "We listen, educate, and walk with clients every step of the way"
              },
              {
                icon: <FaLightbulb className="w-10 h-10 text-brand-green" />,
                title: "Advocacy",
                description: "Pushing for sustainable development in both grassroots projects and national policy"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-brand-blue dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-blue text-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Movement</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Whether you're a <span className="font-bold">business owner</span>,{" "}
            <span className="font-bold">government agency</span>, or{" "}
            <span className="font-bold">community leader</span>, Ecodeed is your partner in{" "}
            <span className="font-bold">building ethically</span>,{" "}
            <span className="font-bold">operating sustainably</span>, and{" "}
            <span className="font-bold">thriving legally</span>.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/contact"
              className="inline-block bg-brand-green hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300"
            >
              Contact Us Today
            </Link>
            <Link
              to="/services"
              className="inline-block bg-brand-yellow hover:bg-yellow-600 text-brand-blue font-medium py-3 px-8 rounded-lg transition duration-300"
            >
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}