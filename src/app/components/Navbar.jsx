"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-2xl font-bold">
                    <Link href="/">
                        <span className="relative group text-white border-2 border-white p-2 rounded cursor-pointer hover:bg-white hover:text-gray-800 hover:border-black-800 rounded">
                            Casual Todo's
                        </span>
                    </Link>
                </h1>
                <div className="hidden md:flex space-x-4">
                    <span className="relative group text-2xl text-2.5xl text-white hover:text-gray-300 cursor-pointer">
                        <Link href="/">Home</Link>
                        <span className="absolute m-0 left-0 top-8 bottom-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                    </span>

                    <span className="relative group text-2xl text-2.5xl text-white hover:text-gray-300 cursor-pointer">
                        <Link href="/addtask">Add Task</Link>
                        <span className="absolute m-0 left-0 top-8 bottom-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                    </span>

                    <span className="relative group text-2xl text-2.5xl text-white hover:text-gray-300 cursor-pointer">
                        <Link href="/showtask">Show Task</Link>
                        <span className="absolute m-0 left-0 bottom-0 top-8 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                    </span>
                </div>
                <div className='hidden md:flex space-x-4'>
                    <span className="relative group text-2xl text-white border-2 p-2 border-white rounded hover:border-black hover:bg-white hover:text-gray-800 cursor-pointer">
                        <Link href="/login">Login</Link>
                    </span>

                    <span className="relative group text-2xl text-white border-2 p-2 border-white rounded hover:border-black hover:bg-white hover:text-gray-800 cursor-pointer">
                        <Link href="/signup">Signup</Link>
                    </span>
                </div>
                <button
                    className="text-white md:hidden focus:outline-none"
                    onClick={toggleMenu}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {isOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            ></path>
                        )}
                    </svg>
                </button>
            </div>
            {isOpen && (
                <div className="md:hidden flex flex-col px-2 py-1 space-y-1 bg-gray-800 rounded">
                    <Link href="/">
                        <span className="flex group text-2xl px-1 py-1 m-2 text-white m-1.5 p-2" onClick={toggleMenu}>
                            Home
                        </span>
                    </Link>
                
                    <Link href="/addtask">
                        <span className="flex group text-2xl px-1 py-1 m-2 text-white m-1.5 p-2" onClick={toggleMenu}>
                            Add Task
                        </span>
                    </Link>
                
                    <Link href="/showtask">
                        <span className="flex group text-2xl px-1 py-1 m-2 text-white m-1.5 p-2" onClick={toggleMenu}>
                            Show Task
                        </span>
                    </Link>
                
                    <Link href="/login">
                        <span className="flex group text-2xl m-0 text-black border-2 rounded border-fit-content m-2 text-white m-1.5 p-2" onClick={toggleMenu}>
                            Login
                        </span>
                    </Link>
                
                    <Link href="/signup">
                        <span className="flex group text-2xl m-0 text-black border-2 rounded border-fit-content m-2 text-white m-1.5 p-2" onClick={toggleMenu}>
                            Signup
                        </span>
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
