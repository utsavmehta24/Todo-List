"use client";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import UserContext from "@/context/userContext";

const LoginPage = () => {
    const router = useRouter();
    const context = useContext(UserContext);
    const [submitData, setSubmitData] = useState({
        email: "",
        password: "",
    });

    // console.log(context);

    const handleSubmitData = async (event) => {
        event.preventDefault(); 
        if (submitData.email.trim() === "" || submitData.email == null) {
            toast.warning("Email is required", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (submitData.password.trim() === "" || submitData.password == null) {
            toast.warning("Password is required", {
                position: "top-center",
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
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Login Success!!", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                console.log("result in the LoginPage.jsx",result);
                context.setUser(result.user);
                router.push("/Dashboard");
            } else {
                toast.error(result.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            toast.error("An unexpected error occurred", {
                position: "top-center",
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
        <div className="bg-gray-800 py-10 md:py-20 px-4 md:px-10">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between mx-auto max-w-7xl">
                {/* Image Section */}
                <div className="w-full md:w-6/12 flex justify-center mb-10 md:mb-0">
                    <img
                        src="https://th.bing.com/th/id/OIG4.fd5mWCok__tCVA9Kuzb6?w=1024&h=1024&rs=1&pid=ImgDetMain"
                        className="rounded-full md:rounded-xl shadow-2xl"
                        alt="Health"
                    />
                </div>

                {/* Form Section */}
                <div className="w-full md:w-6/12 max-w-md">
                    <div className="bg-gray-700 shadow-2xl rounded-xl p-6 md:p-10">
                        <form onSubmit={handleSubmitData}>
                            <p className="text-2xl md:text-4xl font-medium text-center text-white">
                                Login In for an account
                            </p>
                            <div className="mt-6 space-y-6">
                                <div className="relative">
                                    <p className="absolute -top-3 left-2 bg-gray-700 px-1 text-gray-300 font-medium">
                                        Email
                                    </p>
                                    <input
                                        placeholder="123@ex.com"
                                        type="text"
                                        className="w-full bg-gray-700 text-white border border-gray-300 rounded-md py-2 px-3 mt-2 placeholder-gray-400 focus:outline-none focus:border-white"
                                        name="email"
                                        onChange={(e) => setSubmitData({ ...submitData, email: e.target.value })}
                                        value={submitData.email}
                                    />
                                </div>
                                <div className="relative">
                                    <p className="absolute -top-3 left-2 bg-gray-700 px-1 text-gray-300 font-medium">
                                        Password
                                    </p>
                                    <input
                                        className="w-full bg-gray-700 text-white border border-gray-300 rounded-md py-2 px-3 mt-2 placeholder-gray-400 focus:outline-none focus:border-white"
                                        name="password"
                                        onChange={(e) => setSubmitData({ ...submitData, password: e.target.value })}
                                        placeholder="Password"
                                        type="password"
                                        value={submitData.password}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-500 text-white rounded-lg py-2 px-4 text-lg font-medium transition duration-200 hover:bg-indigo-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
