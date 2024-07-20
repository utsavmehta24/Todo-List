// components/Footer.js
import React from 'react';
// import Head from 'next/head';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaDribbble, FaGithub, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <>
      <footer className="relative bg-blueGray-200 pt-8 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap text-left lg:text-left">
            <div className="w-full lg:w-6/12 px-4">
              <h4 className="text-3xl font-semibold text-blueGray-700">Let's keep in touch!</h4>
              <h5 className="text-lg mt-0 mb-2 text-blueGray-600">
                Find us on any of these platforms, we respond 1-2 business days.
              </h5>
              <div className="mt-6 lg:mb-0 mb-6 flex items-center justify-start">
                <a href="https://facebook.com" className="hover:text-white px-3">
                  <FaFacebook size={40} />
                </a>
                <a href="https://twitter.com" className="hover:text-white px-3">
                  <FaTwitter size={40} />
                </a>
                <a href="https://instagram.com" className="hover:text-white px-3">
                  <FaInstagram size={40} />
                </a>

                {/* <FaDribbble size={40} /> */}
                <a href="https://github.com" className="hover:text-white px-3">
                  <FaGithub size={40} />
                </a>

              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="flex flex-wrap items-top mb-6">
                <div className="w-full lg:w-4/12 px-4 ml-auto">
                  <span className="block uppercase text-blueGray-500 text-sm font-semibold mb-2">
                    Useful Links
                  </span>
                  <ul className="list-unstyled">
                    <li>
                      <Link href="https://www.creative-tim.com/presentation?ref=njs-profile" className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="https://blog.creative-tim.com?ref=njs-profile" className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link href="https://www.github.com/creativetimofficial?ref=njs-profile" className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm">
                        Github
                      </Link>
                    </li>
                    <li>
                      <Link href="https://www.creative-tim.com/bootstrap-themes/free?ref=njs-profile" className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm">
                        Free Products
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <span className="block uppercase text-blueGray-500 text-sm font-semibold mb-2">
                    Other Resources
                  </span>
                  <ul className="list-unstyled">
                    <li>
                      <Link href="https://github.com/creativetimofficial/notus-js/blob/main/LICENSE.md?ref=njs-profile" className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm">
                        MIT License
                      </Link>
                    </li>
                    <li>
                      <Link href="https://creative-tim.com/terms?ref=njs-profile" className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm">
                        Terms & Conditions
                      </Link>
                    </li>
                    <li>
                      <Link href="https://creative-tim.com/privacy?ref=njs-profile" className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="https://creative-tim.com/contact-us?ref=njs-profile" className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm">
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-6 border-blueGray-300" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4 mx-auto text-center">
              <div className="text-sm text-blueGray-500 font-semibold py-1">
                Copyright © <span id="get-current-year">2021</span>
                <Link href="https://www.creative-tim.com/product/notus-js" className="text-blueGray-500 hover:text-gray-800" target="_blank">
                  Notus JS by
                </Link>
                <Link href="https://www.creative-tim.com?ref=njs-profile" className="text-blueGray-500 hover:text-blueGray-800">
                  Creative Tim
                </Link>
                .
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
