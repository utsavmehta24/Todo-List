import Link from 'next/link';

export default function IntroBanner() {
  return (
    <div className="w-full">
      <nav className="bg-gray-900 shadow-lg">
        <div className="md:flex items-center justify-between py-0 px-8 md:px-12">
          <div className="flex justify-between items-center">
            {/* Brand section removed for simplicity */}
            {/* Removing the hamburger menu icon */}
          </div>
          {/* Navigation links removed for simplicity */}
        </div>
      </nav>
      <div className="flex bg-gray-900" style={{ height: '600px' }}>
        <div className="flex items-center text-center lg:text-left px-8 md:px-12 lg:w-1/2">
          <div>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Build Your New <span className="text-indigo-400">Day</span>
            </h2>
            <p className="mt-2 text-sm text-gray-400 md:text-base">
              Let your day be organized and focus on your work. Be productive.
              This is your new way of life. Where you can get your work done. Schedule your tasks and set your priorities.
              Once a time we live but always live life to the fullest....
            </p>
            <div className="flex justify-center lg:justify-start mt-6">
              <Link href="/login">
                <p className="px-4 py-3 bg-gray-700  text-gray-200 text-xs font-semibold rounded hover:bg-gray-600">
                  Login
                </p>
              </Link>
              <Link href="/signup">
                <p className="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400">
                  Sign Up
                </p>
              </Link>
            </div>
          </div>
        </div>
        <div
          className="hidden lg:block lg:w-1/2"
          style={{ clipPath: 'polygon(10% 0, 100% 0%, 100% 100%, 0 100%)' }}
        >
          <div
            className="h-full object-cover"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1352&q=80)',
            }}
          >
            <div className="h-full bg-black opacity-25"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
