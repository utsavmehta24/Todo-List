"use client";
import React, { useContext, useEffect, useState } from "react";
import { deleteTasks, getTasksOfUsers } from "../Services/Services";
import UserContext from "@/context/userContext";
import Task from "./Task";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import './showtask.css';

const ShowTaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const context = useContext(UserContext);

  async function loadTask(userId) {
    try {
      const tasks = await getTasksOfUsers(userId);
      console.log(tasks);
      setTasks([...tasks].reverse());
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (context.user) {
      loadTask(context.user._id);
    }
  }, [context.user]);

  async function deleteTaskParent(id) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const result = await deleteTasks(id);
            console.log(result);
            const newTask = tasks.filter((task) => task._id !== id);
            setTasks([...newTask]);
            swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "Your task has been deleted.",
              icon: "success",
            });
          } catch (error) {
            console.log(error);
            toast.error("Error while deleting task");
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Task is safe :)",
            icon: "error",
          });
        }
      });
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 p-10">
      <div className="relative w-full max-w-4xl bg-gray-800 rounded-3xl shadow-xl p-13 flex flex-col">
        <div className="text-2xl font-extrabold text-blue-400 tracking-widest text-center mb-8 p-5">
          Show Tasks <span className="text-white">{`(${tasks.length})`}</span>
        </div>
        {isLoading ? (
          <div className="text-2xl font-extrabold text-blue-400 tracking-widest text-center mb-8">
            Loading...
          </div>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <Task
              task={task}
              key={task._id}
              deletetaskParent={deleteTaskParent}
            />
          ))
        ) : (
          <div className="text-2xl font-extrabold text-blue-400 tracking-widest text-center mb-8">
            No Tasks
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowTaskPage;
