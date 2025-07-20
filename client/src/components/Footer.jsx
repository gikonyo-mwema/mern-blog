import React from 'react';
import { BsFacebook, BsInstagram, BsYoutube, BsLinkedin, BsTwitter } from 'react-icons/bs';
import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function FooterComponent() {
    const services = [
        { name: "Environmental Audits", path: "/services#audits" },
        { name: "Climate Change & Sustainability Solutions", path: "/services#climate" },
        { name: "Environmental Impact Assessments", path: "/services#eia" },
        { name: "Environmental Safeguards & Policy Advisory", path: "/services#policy" }
    ];

    return (
        <Footer container className="border-t-8 border-yellow-400 bg-gray-50 dark:bg-[#051836] mt-auto">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center mb-4">
                            <img
                                src="https://res.cloudinary.com/dcrubaesi/image/upload/v1737333837/ECODEED_COLORED_LOGO_wj2yy8.png"
                                alt="Ecodeed Logo"
                                className="h-16 w-16 mr-3 dark:hidden"
                            />
                            <img
                                src="https://res.cloudinary.com/dcrubaesi/image/upload/v1753007363/ECODEED_BLACK_LOGO_xtwjoy.png"
                                alt="Ecodeed Logo"
                                className="h-16 w-16 mr-3 hidden dark:block"
                            />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900 dark:text-white">
                                Ecodeed
                            </span>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Empowering a sustainable future through expert environmental consulting and education.
                        </p>
                        <div className="flex space-x-4 mt-4">
                            <Footer.Icon 
                                href="https://www.facebook.com/ecodeedcompany/" 
                                icon={BsFacebook} 
                                className="text-gray-600 hover:text-[#F8BF0F] dark:text-gray-300 dark:hover:text-[#F8BF0F] transition-colors duration-200"
                            />
                            <Footer.Icon 
                                href="https://x.com/EcodeedC" 
                                icon={BsTwitter} 
                                className="text-gray-600 hover:text-[#F8BF0F] dark:text-gray-300 dark:hover:text-[#F8BF0F] transition-colors duration-200"
                            />
                            <Footer.Icon 
                                href="https://www.instagram.com/ecodeedcompany/" 
                                icon={BsInstagram} 
                                className="text-gray-600 hover:text-[#F8BF0F] dark:text-gray-300 dark:hover:text-[#F8BF0F] transition-colors duration-200"
                            />
                            <Footer.Icon 
                                href="https://youtube.com" 
                                icon={BsYoutube} 
                                className="text-gray-600 hover:text-[#F8BF0F] dark:text-gray-300 dark:hover:text-[#F8BF0F] transition-colors duration-200"
                            />
                            <Footer.Icon 
                                href="https://www.linkedin.com/company/ecodeed-consultancy-company" 
                                icon={BsLinkedin} 
                                className="text-gray-600 hover:text-[#F8BF0F] dark:text-gray-300 dark:hover:text-[#F8BF0F] transition-colors duration-200"
                            />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <Footer.Title title="Quick Links" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white" />
                        <Footer.LinkGroup col className="space-y-2">
                            <Link to="/" className="text-gray-600 hover:text-[#008037] dark:text-gray-300 dark:hover:text-[#008037] transition-colors duration-200">
                                Home
                            </Link>
                            <Link to="/about" className="text-gray-600 hover:text-[#008037] dark:text-gray-300 dark:hover:text-[#008037] transition-colors duration-200">
                                About Us
                            </Link>
                            <Link to="/services" className="text-gray-600 hover:text-[#008037] dark:text-gray-300 dark:hover:text-[#008037] transition-colors duration-200">
                                Services
                            </Link>
                            <Link to="/courses" className="text-gray-600 hover:text-[#008037] dark:text-gray-300 dark:hover:text-[#008037] transition-colors duration-200">
                                Courses
                            </Link>
                        </Footer.LinkGroup>
                    </div>

                    {/* Services */}
                    <div>
                        <Footer.Title title="Our Services" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white" />
                        <Footer.LinkGroup col className="space-y-2">
                            {services.map((service, index) => (
                                <Link 
                                    key={index}
                                    to={service.path}
                                    className="text-gray-600 hover:text-[#008037] dark:text-gray-300 dark:hover:text-[#008037] transition-colors duration-200"
                                >
                                    {service.name}
                                </Link>
                            ))}
                        </Footer.LinkGroup>
                    </div>
                </div>

                {/* Divider */}
                <Footer.Divider className="my-8 border-gray-200 dark:border-yellow-500" />

                {/* Bottom Section - Simplified */}
                <div className="w-full text-center pt-4">
                    <Footer.Copyright
                        href="/"
                        by="Ecodeed"
                        year={new Date().getFullYear()}
                        className="text-gray-600 dark:text-gray-300"
                    />
                </div>
            </div>
        </Footer>
    );
}

