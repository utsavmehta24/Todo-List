"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import UserContext from "@/context/userContext";
import { logOut } from "../Services/userService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa"; // For hamburger and close icons

const Navbar = () => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    // console.log("Context in the Navbar.jsx file", user);
  }, [user]);

  const doLogout = async () => {
    try {
      await logOut();
      const user = { name: "", email: "" };
      setUser(user);
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Error while Logging Out !!");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">
          <Link href="/">
            <span className="relative group text-white border-2 border-white p-2 rounded cursor-pointer hover:bg-white hover:text-gray-800 hover:border-black-800">
              Casual Todo's
            </span>
          </Link>
        </h1>
        
        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white text-3xl">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Links for larger screens */}
        <div className="hidden md:flex space-x-4">
          {user?.email === "" ? (
            <>
              <button className="relative group text-2xl text-white border-2 p-2 border-white rounded hover:border-black hover:bg-white hover:text-gray-800 cursor-pointer">
                <Link href="/login">Login</Link>
              </button>
              <button className="relative group text-2xl text-white border-2 p-2 border-white rounded hover:border-black hover:bg-white hover:text-gray-800 cursor-pointer">
                <Link href="/signup">Signup</Link>
              </button>
            </>
          ) : (
            <>
              <span className="relative group text-2xl text-white hover:text-gray-300 cursor-pointer">
                <Link href="/">Home</Link>
              </span>
              <span className="relative group text-2xl text-white hover:text-gray-300 cursor-pointer">
                <Link href="/addtask">Add Task</Link>
              </span>
              <span className="relative group text-2xl text-white hover:text-gray-300 cursor-pointer">
                <Link href="/showtask">Show Task</Link>
              </span>
              <span className="relative group text-2xl text-white border-2 p-2 border-white rounded hover:border-black hover:bg-white hover:text-gray-800 cursor-pointer">
                <Link href="/Dashboard">{user?.name}</Link>
              </span>
              <span className="relative group text-2xl text-white border-2 p-2 border-white rounded hover:border-black hover:bg-white hover:text-gray-800 cursor-pointer">
                <button onClick={doLogout}>Logout</button>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col space-y-4 mt-4">
          {user?.email === "" ? (
            <>
              <Link href="/login" className="text-white text-xl">
                Login
              </Link>
              <Link href="/signup" className="text-white text-xl">
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className="text-white text-xl">
                Home
              </Link>
              <Link href="/addtask" className="text-white text-xl">
                Add Task
              </Link>
              <Link href="/showtask" className="text-white text-xl">
                Show Task
              </Link>
              <Link href="/Dashboard" className="text-white text-xl">
                {user?.name}
              </Link>
              <button onClick={doLogout} className="text-white text-xl">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
  