"use client";
import React, { useState } from 'react';
import { addtask } from '../Services/Services';
import { toast } from 'react-toastify';


const Addtask = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending",
    userId: "6696b6eb7453fe0af988a135"
  });

  const handleAddTask = async (event) => {
    event.preventDefault();
    console.log(task);
    try {
      const result = await addtask(task);
      console.log(result);
      toast.success("Task Added successfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTask({
        title: "",
        description: "",
        status: "pending",
        userId: "6696b6eb7453fe0af988a135"
      });
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
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 p-10">
      <div className="relative w-full max-w-4xl bg-gray-800 rounded-3xl shadow-xl p-10 flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img className="rounded w-full custom-size" src="https://th.bing.com/th/id/OIG1.mSlsDy78oyZlgGcqBnC_?w=1024&h=1024&rs=1&pid=ImgDetMain" alt="ADD TASK" />
        </div>
        <div className="md:w-1/2 mt-4 md:mt-0 md:ml-10">
          <div className="text-2xl font-extrabold text-blue-400 tracking-widest text-center">
            Add Task
          </div>
          <form action="#!" onSubmit={handleAddTask}>
            <div className="mt-8 text-left">
              <label className="block text-gray-300">Title</label>
              <input
                type="text"
                placeholder="Enter your task"
                className="w-full h-12 pl-5 mb-4 text-sm text-gray-300 bg-gray-700 rounded shadow-inner outline-none"
                name="title"
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                value={task.title}
              />
              <label className="block text-gray-300">Description</label>
              <input
                type="text"
                placeholder="Write your information here"
                className="w-full pl-5 text-sm mb-4 text-sm text-gray-300 bg-gray-700 rounded shadow-inner outline-none custom-height"
                name="description"
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                value={task.description}
              />
              <label className="block text-gray-300">Status</label>
              <select
                className="w-full h-12 pl-5 mb-4 text-sm text-gray-300 bg-gray-700 rounded shadow-inner outline-none"
                name="status"
                id="status"
                onChange={(e) => setTask({ ...task, status: e.target.value })}
                value={task.status}
              >
                <option value="none" disabled>-- Select Options --</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <div className="flex justify-space-between w-full">
                <button className="w-full h-10 mt-5 m-1 text-white bg-blue-500 rounded-full shadow hover:shadow-none font-extrabold transition-shadow duration-500">
                  Add Task
                </button>
                <button className="w-full h-10 mt-5 m-1 text-white bg-red-500 rounded-full shadow hover:shadow-none font-extrabold transition-shadow duration-500">
                  Clear
                </button>
              </div>
              {/* {JSON.stringify(task)} */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addtask;
