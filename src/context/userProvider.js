"use client";
import React, { useEffect, useState } from 'react'
import UserContext from './userContext'
import { toast } from 'react-toastify';
import { curentUser } from '@/app/Services/userService';

const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        name: "",
        email: "",
    });
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const currentUser = await curentUser();
                // console.log("Current User in the userProvider", currentUser);
                setUser(currentUser);
                // console.log("This is the user in the curent User in the current user provider", user);
            } catch (error) {
                console.log(error);
                toast.error("Error Loading the current user");
                setUser(null);
            }
        }
        fetchCurrentUser();
    }, []);



    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
};

export default UserProvider

