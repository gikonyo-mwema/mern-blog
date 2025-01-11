import React from 'react';
import { BsFacebook, BsInstagram, BsYoutube, BsGithub, BsTwitter } from 'react-icons/bs';
import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function FooterComponent() {
    return (
        <Footer container className="border-t-8 border-green-600 bg-gray-50 mt-auto">
            <div className="w-full max-w-7xl mx-auto px-6 py-10">
                {/* Top Section */}
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="mt-5">
                        <Link
                            to="/"
                            className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
                        >
                            <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg text-white">
                                Ecodeed
                            </span>
                            Blog
                        </Link>
                        <p className="mt-3 text-sm text-gray-500">
                            Empowering a sustainable future through expert environmental consulting.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                        {/* About Us */}
                        <div>
                            <Footer.Title title="About Us" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="/about-us" target="_self">
                                    About Us
                                </Footer.Link>
                                <Footer.Link href="/contact" target="_self">
                                    Contact Us
                                </Footer.Link>
                                <Footer.Link href="/blog" target="_self">
                                    Our Blog
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        {/* Services */}
                        <div>
                            <Footer.Title title="Our Services" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="/services/eia" target="_self">
                                    EIA Reports
                                </Footer.Link>
                                <Footer.Link href="/services/audits" target="_self">
                                    Environmental Audits
                                </Footer.Link>
                                <Footer.Link href="/services/surveys" target="_self">
                                    Environmental Surveys
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        {/* Follow Us */}
                        <div>
                            <Footer.Title title="Follow Us" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                    Twitter
                                </Footer.Link>
                                <Footer.Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                                    YouTube
                                </Footer.Link>
                                <Footer.Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                    Facebook
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                {/* Divider */}
                <Footer.Divider />
                {/* Bottom Section */}
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright
                        href="/"
                        by="Ecodeed Blog"
                        year={new Date().getFullYear()}
                    />
                    <div className="flex gap-6 mt-4 sm:mt-0 sm:justify-center">
                        <Footer.Icon href="https://facebook.com" icon={BsFacebook} />
                        <Footer.Icon href="https://instagram.com" icon={BsInstagram} />
                        <Footer.Icon href="https://youtube.com" icon={BsYoutube} />
                        <Footer.Icon href="https://github.com" icon={BsGithub} />
                        <Footer.Icon href="https://twitter.com" icon={BsTwitter} />
                    </div>
                </div>
            </div>
        </Footer>
    );
}

