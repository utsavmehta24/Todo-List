import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap text-left lg:text-left">
          <div className="w-full lg:w-6/12 px-4">
            <h4 className="text-3xl font-semibold text-blue-400">Let's keep in touch!</h4>
            <h5 className="text-lg mt-0 mb-2 text-gray-300">
              Find us on any of these platforms, we respond in 1-2 business days.
            </h5>
            <div className="mt-6 lg:mb-0 mb-6 flex items-center justify-start">
              <a href="https://www.facebook.com/utsav.mehta.566148?mibextid=ZbWKwL" className="hover:text-blue-500 px-3">
                <FaFacebook size={40} />
              </a>
              {/* <a href="/" className="hover:text-blue-500 px-3">
                <FaTwitter size={40} />
              </a> */}
              <a href="https://www.instagram.com/lucid24by7.io?igsh=MWJmZXp6dThuYTRjbw==" className="hover:text-blue-500 px-3">
                <FaInstagram size={40} />
              </a>
              <a href="https://github.com/utsavmehta24" className="hover:text-blue-500 px-3">
                <FaGithub size={40} />
              </a>
              <a href="https://www.linkedin.com/in/utsav-mehta-462653258/" className="hover:text-blue-500 px-3">
                <FaLinkedin size={40} />
              </a>
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="flex flex-wrap items-top mb-6">
              <div className="w-full lg:w-4/12 px-4 ml-auto">
                <span className="block uppercase text-gray-400 text-sm font-semibold mb-2">
                  Useful Links
                </span>
                <ul className="list-unstyled">
                  <li>
                    <Link href="https://github.com/utsavmehta24" className="text-gray-300 hover:text-white font-semibold block pb-2 text-sm">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.instagram.com/lucid24by7.io?igsh=MWJmZXp6dThuYTRjbw==" className="text-gray-300 hover:text-white font-semibold block pb-2 text-sm">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="https://github.com/utsavmehta24" className="text-gray-300 hover:text-white font-semibold block pb-2 text-sm">
                      Github
                    </Link>
                  </li>
                  <li>
                    <Link href="https://github.com/utsavmehta24?tab=repositories" className="text-gray-300 hover:text-white font-semibold block pb-2 text-sm">
                      Free Products
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <span className="block uppercase text-gray-400 text-sm font-semibold mb-2">
                  Other Resources
                </span>
                <ul className="list-unstyled">
                  <li>
                    <Link href="https://www.mit.edu/~amini/LICENSE.md" className="text-gray-300 hover:text-white font-semibold block pb-2 text-sm">
                      MIT License
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.termsfeed.com/public/uploads/2021/12/sample-terms-of-service-template.pdf" className="text-gray-300 hover:text-white font-semibold block pb-2 text-sm">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.termsfeed.com/public/uploads/2021/12/sample-terms-of-service-template.pdf" className="text-gray-300 hover:text-white font-semibold block pb-2 text-sm">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="tel:+919913816941" className="text-gray-300 hover:text-white font-semibold block pb-2 text-sm">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-600" />
        <div className="flex flex-wrap items-center md:justify-between justify-center">
          <div className="w-full md:w-4/12 px-4 mx-auto text-center">
            <div className="text-sm text-gray-400 font-semibold py-1">
              Copyright © <span id="get-current-year">2024</span>
              <Link href="https://www.linkedin.com/in/utsav-mehta-462653258/" className="text-blue-400 hover:text-white" target="_blank">
                {' '}rockingUT /
              </Link>
              <Link href="https://www.linkedin.com/in/utsav-mehta-462653258/" className="text-blue-400 hover:text-white">
                {' '}Utsav Mehta
              </Link>
              .
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
