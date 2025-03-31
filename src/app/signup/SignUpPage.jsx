"use client";

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { signUp } from '../Services/userService';
import { useRouter } from 'next/navigation';

const Signup_Page_Client = () => {
    const router = useRouter();
    const [submitData, setSubmitData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmitData = async (event) => {
        event.preventDefault();
        
        const { name, email, password } = submitData;

        if (!name.trim()) {
            toast.warning("Name is required", {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (!email.trim()) {
            toast.warning("Email is required", {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (!password.trim()) {
            toast.warning("Password is required", {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        
        try {
            const result = await signUp(submitData);
            toast.success("Signup Successfully", {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setSubmitData({
                name: "",
                email: "",
                password: "",
            });
            router.push("/login");
        } catch (error) {
            console.error(error);
            toast.error(`Error Creating the user: ${error.response?.data?.message || 'Unknown error'}`, {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <div className="bg-gray-800 relative lg:py-20">
            <div className="flex flex-col items-center justify-between px-10 max-w-7xl mx-auto lg:flex-row">
                <div className="flex flex-col items-center w-full lg:flex-row">
                    <div className="w-full lg:w-7/12 relative max-w-md lg:max-w-2xl">
                        <div className="flex flex-col items-center justify-center w-full h-full relative lg:pr-10">
                            <img src="https://cdn.pixabay.com/photo/2024/04/18/15/06/ai-generated-8704489_1280.jpg" className="btn- rounded-full" alt="Health" />
                        </div>
                    </div>
                    <div className="w-full mt-20 relative z-10 max-w-2xl lg:mt-0 lg:w-5/12">
                        <form className='z-0' onSubmit={handleSubmitData}>
                            <div className="flex flex-col items-start justify-start p-10 bg-gray-700 shadow-2xl rounded-xl">
                                <p className="w-full text-4xl font-medium text-center text-white">Sign up for an account</p>
                                <div className="w-full mt-6 space-y-8">
                                    <div className="relative">
                                        <label htmlFor='user_name' className="bg-gray-700 px-2 -mt-3 font-medium text-gray-300 absolute">Username</label>
                                        <input id='user_name' placeholder="Enter Your name here" type="text" className="border placeholder-gray-400 focus:outline-none focus:border-white w-full p-4 mt-2 text-base block bg-gray-700 text-white border-gray-300 rounded-md" name='name'
                                            onChange={(event) => setSubmitData({
                                                ...submitData,
                                                name: event.target.value,
                                            })}
                                            value={submitData.name} />
                                    </div>
                                    <div className="relative">
                                        <label htmlFor='user_email' className="bg-gray-700 px-2 -mt-3 font-medium text-gray-300 absolute">Email</label>
                                        <input id='user_email' placeholder="123@ex.com" type="email" className="border placeholder-gray-400 focus:outline-none focus:border-white w-full p-4 mt-2 text-base block bg-gray-700 text-white border-gray-300 rounded-md"
                                            name='email'
                                            onChange={(event) => setSubmitData({
                                                ...submitData,
                                                email: event.target.value,
                                            })}
                                            value={submitData.email} />
                                    </div>
                                    <div className="relative">
                                        <label htmlFor='user_password' className="bg-gray-700 px-2 -mt-3 font-medium text-gray-300 absolute">Password</label>
                                        <input id='user_password' placeholder="Password" type="password" className="border placeholder-gray-400 focus:outline-none focus:border-white w-full p-4 mt-2 text-base block bg-gray-700 text-white border-gray-300 rounded-md"
                                            name='password'
                                            onChange={(event) => setSubmitData({
                                                ...submitData,
                                                password: event.target.value,
                                            })}
                                            value={submitData.password} />
                                    </div>
                                    <div className="relative">
                                        <button type='submit' className="w-full inline-block py-4 px-5 text-xl font-medium text-center text-white bg-indigo-500 rounded-lg transition duration-200 hover:bg-indigo-600">
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
  );
}

export default Signup_Page_Client;
