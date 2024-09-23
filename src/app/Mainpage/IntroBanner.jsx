"use client";
import Link from 'next/link';
import UserContext from '@/context/userContext';
import { useContext } from 'react';

export default function IntroBanner() {
  const { user } = useContext(UserContext);
  const bodyText = encodeURIComponent(`Hi! Myself ${user?.name}. I am facing an issue with using the application. Please help me.`);
  const mailtolink = `mailto:utsavmehta24072003@gmail.com?subject=Issue with application&body=${bodyText}`;

  return (
    <div className="relative w-full">
      <nav className="bg-gray-900 shadow-lg z-10">
        <div className="md:flex items-center justify-between py-0 px-8 md:px-12">
          <div className="flex justify-between items-center">
          </div>
        </div>
      </nav>
      <div className="absolute blur-[106px] h-56 bg-gradient-to-br from-purple-400 to-blue-700 z-0"></div>
      <div className="flex bg-gray-900 relative z-10" style={{ height: '600px' }}>
        <div className="flex items-center text-center lg:text-left px-8 md:px-12 lg:w-1/2">
          <div>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Build Your New <span className="text-indigo-400">Day</span>
            </h2>
            <p className="mt-2 text-sm text-gray-400 md:text-base">
              Let your day be organized and focus on your work. Be productive. This is your new way of life. Where you can get your work done. Schedule your tasks and set your priorities. Once a time we live but always live life to the fullest....
            </p>
            <div className="flex justify-center lg:justify-start mt-6">
              {!user?.email ? (
                <>
                  <Link href="/reviews">
                    <p className="px-4 py-3 bg-gray-700 text-gray-200 text-s font-semibold rounded hover:bg-gray-600 cursor-pointer">
                      Reviews
                    </p>
                  </Link>
                  <Link href="/signup">
                    <p className="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-s font-semibold rounded hover:bg-gray-400 cursor-pointer">
                      Sign Up
                    </p>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/write-review">
                    <p className="px-4 py-3 bg-gray-700 text-gray-200 text-s font-semibold rounded hover:bg-gray-600 cursor-pointer">
                      Write Review
                    </p>
                  </Link>
                  <Link href={mailtolink}>
                    <p className="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-s font-semibold rounded hover:bg-gray-400 cursor-pointer">
                      Facing Issues? <sub>Mail Us!</sub>
                    </p>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="hidden lg:block lg:w-1/2" style={{ clipPath: 'polygon(10% 0, 100% 0%, 100% 100%, 0 100%)' }}>
          <div className="h-full object-cover" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1352&q=80)'
          }}>
            <div className="h-full bg-black opacity-25"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
