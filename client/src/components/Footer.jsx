import React from 'react';
import { BsFacebook, BsInstagram, BsYoutube, BsLinkedin, BsTwitter } from 'react-icons/bs';
import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function FooterComponent() {
    return (
        <Footer container className="border-t-8 border-yellow-500 bg-gray-50 dark:bg-gray-800 mt-auto">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center mb-4">
                            <img
                                src="https://res.cloudinary.com/dcrubaesi/image/upload/v1737333837/ECODEED_COLORED_LOGO_wj2yy8.png"
                                alt="Ecodeed Logo"
                                className="h-16 w-16 mr-3"
                            />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                                Ecodeed
                            </span>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Empowering a sustainable future through expert environmental consulting and education.
                        </p>
                        <div className="flex space-x-4 mt-4">
                            <Footer.Icon 
                                href="https://facebook.com" 
                                icon={BsFacebook} 
                                className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white"
                            />
                            <Footer.Icon 
                                href="https://twitter.com" 
                                icon={BsTwitter} 
                                className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white"
                            />
                            <Footer.Icon 
                                href="https://instagram.com" 
                                icon={BsInstagram} 
                                className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white"
                            />
                            <Footer.Icon 
                                href="https://youtube.com" 
                                icon={BsYoutube} 
                                className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white"
                            />
                            <Footer.Icon 
                                href="https://linkedin.com" 
                                icon={BsLinkedin} 
                                className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white"
                            />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <Footer.Title title="Quick Links" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white" />
                        <Footer.LinkGroup col className="space-y-2">
                            <Footer.Link href="/" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">
                                Home
                            </Footer.Link>
                            <Footer.Link href="/about" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">
                                About Us
                            </Footer.Link>
                            <Footer.Link href="/blog" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">
                                Blog
                            </Footer.Link>
                            <Footer.Link href="/contact" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">
                                Contact
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>

                    {/* Services */}
                    <div>
                        <Footer.Title title="Our Services" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white" />
                        <Footer.LinkGroup col className="space-y-2">
                            <Footer.Link href="/services/eia" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">
                                EIA Reports
                            </Footer.Link>
                            <Footer.Link href="/services/audits" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">
                                Environmental Audits
                            </Footer.Link>
                            <Footer.Link href="/services/surveys" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">
                                Environmental Surveys
                            </Footer.Link>
                            <Footer.Link href="/services/consulting" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">
                                Consulting Services
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>

                    {/* Contact Info 
                    <div>
                        <Footer.Title title="Contact Us" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white" />
                        <div className="text-gray-600 dark:text-gray-300 space-y-2">
                            <p>123 Greenway Blvd</p>
                            <p>Eco City, EC 12345</p>
                            <p>Email: info@ecodeed.com</p>
                            <p>Phone: (123) 456-7890</p>
                        </div>
                    </div>*/}
                </div>

                {/* Divider */}
                <Footer.Divider className="my-8 border-gray-200 dark:border-gray-700" />

                {/* Bottom Section */}
                <div className="w-full flex flex-col md:flex-row justify-between items-center">
                    <Footer.Copyright
                        href="/"
                        by="Ecodeed"
                        year={new Date().getFullYear()}
                        className="text-gray-600 dark:text-gray-300"
                    />
                    <div className="mt-4 md:mt-0 flex space-x-6">
                        <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">
                            Terms & Conditions
                        </Link>
                        <Link to="/sitemap" className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">
                            Sitemap
                        </Link>
                    </div>
                </div>
            </div>
        </Footer>
    );
}
