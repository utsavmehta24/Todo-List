"use client";
import React, { useContext, useEffect } from "react";
import Link from "next/link";
import UserContext from "@/context/userContext";
import { logOut } from "../Services/userService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

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
        {
          user?.email === "" ? (
            <>
              <div className="hidden md:flex space-x-4">
                <button className="relative group text-2xl text-white border-2 p-2 border-white rounded hover:border-black hover:bg-white hover:text-gray-800 cursor-pointer">
                  <Link href="/login">
                    Login
                  </Link>
                </button>
                <button className="relative group text-2xl text-white border-2 p-2 border-white rounded hover:border-black hover:bg-white hover:text-gray-800 cursor-pointer">
                  <Link href="/signup">
                    Signup
                  </Link>
                </button>
              </div>
            </>
          ) : (
            <><div className="hidden md:flex space-x-4">
              <span className="relative group text-2xl text-white hover:text-gray-300 cursor-pointer">
                <Link href="/">Home</Link>
                <span className="absolute m-0 left-0 top-8 bottom-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </span>

              <span className="relative group text-2xl text-white hover:text-gray-300 cursor-pointer">
                <Link href="/addtask">Add Task</Link>
                <span className="absolute m-0 left-0 top-8 bottom-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </span>

              <span className="relative group text-2xl text-white hover:text-gray-300 cursor-pointer">
                <Link href="/showtask">Show Task</Link>
                <span className="absolute m-0 left-0 bottom-0 top-8 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
              </span>
            </div>

              <div className="hidden md:flex space-x-4">
                <span className="relative group text-2xl text-white border-2 p-2 border-white rounded hover:border-black hover:bg-white hover:text-gray-800 cursor-pointer">
                  <Link href="/Dashboard">{user?.name}</Link>
                </span>

                <span className="relative group text-2xl text-white border-2 p-2 border-white rounded hover:border-black hover:bg-white hover:text-gray-800 cursor-pointer">
                  <button onClick={doLogout}>Logout</button>
                </span>
              </div>
            </>)
        }
      </div>
    </nav>
  );
};

export default Navbar;
