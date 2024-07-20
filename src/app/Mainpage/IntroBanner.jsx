import Link from 'next/link';

export default function IntroBanner() {
  return (
    <div className="w-full">
      <nav className="bg-gray-900 shadow-lg">
        <div className="md:flex items-center justify-between py-0 px-8 md:px-12">
          <div className="flex justify-between items-center">
            {/* <div className="text-2xl font-bold text-white md:text-3xl">
              <Link href="#">
                <p>Brand</p>
              </Link>
            </div> */}
            <div className="md:hidden">
              <button
                type="button"
                className="block text-white hover:text-gray-400 focus:text-gray-400 focus:outline-none"
              >
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path
                    className="hidden"
                    d="M16.24 14.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 0 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12l2.83 2.83z"
                  />
                  <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                </svg>
              </button>
            </div>
          </div>
          {/* <div className="flex flex-col md:flex-row hidden md:block -mx-2">
            <Link href="#">
              <p className="text-white rounded hover:bg-gray-800 hover:text-gray-300 hover:font-medium py-2 px-2 md:mx-2">
                Home
              </p>
            </Link>
            <Link href="#">
              <p className="text-white rounded hover:bg-gray-800 hover:text-gray-300 hover:font-medium py-2 px-2 md:mx-2">
                About
              </p>
            </Link>
            <Link href="#">
              <p className="text-white rounded hover:bg-gray-800 hover:text-gray-300 hover:font-medium py-2 px-2 md:mx-2">
                Contact
              </p>
            </Link>
          </div> */}
        </div>
      </nav>
      <div className="flex bg-gray-900" style={{ height: '600px' }}>
        <div className="flex items-center text-center lg:text-left px-8 md:px-12 lg:w-1/2">
          <div>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Build Your New <span className="text-indigo-400">Day</span>
            </h2>
            <p className="mt-2 text-sm text-gray-400 md:text-base">
              Let your day be orgainzed and focus on your work. Be productive.
              This is your new way of life. Where you can get your work done. Schedule your tasks and set your priorities.
              Once a time we live but always live life to the fullest....
            </p>
            <div className="flex justify-center lg:justify-start mt-6">
              <Link href="login">
                <p className="px-4 py-3 bg-gray-700 text-gray-200 text-xs font-semibold rounded hover:bg-gray-600">
                  Login
                </p>
              </Link>
              <Link href="signup">
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
