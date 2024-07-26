import React from 'react'
import LoginPage from './LoginPage'
import { user } from "@/model/user";
import { connectDb } from '@/helper/db';
export const metadata = {
  title: "Todo : Login",
  description: "Login Page",
};

connectDb();
const login = async () => {
  const users = await user.find().select('-password -_id');
  // console.log(users);

  return (
    < LoginPage />
  )
}

export default login