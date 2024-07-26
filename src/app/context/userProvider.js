"use client";
import React, { useEffect, useState } from 'react'
import UserContext  from './userContext'
import { curentUser } from '../Services/userService';
import { toast } from 'react-toastify';

const UserProviderFunction = ({ children }) => {
    const [usera, setUsera] = useState(undefined);

    useEffect(async () => {
        try {
            const CurrentUser = await curentUser();
            console.log(CurrentUser);
            setUsera({ ...usera });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setUsera(undefined);
        }
    }, []);

    return (
        <UserContext.Provider value={{ usera, setUsera }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProviderFunction