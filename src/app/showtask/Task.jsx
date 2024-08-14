"use client";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';

const Task = ({ task, deletetaskParent }) => {
    const [status, setStatus] = useState(task.status);

    const deleteTask = (id) => {
        deletetaskParent(id);
    };

    const updateStatus = async (newStatus) => {
        setStatus(newStatus);
        try {
            const updatedTask = await axios.put(`/api/works/${task._id}`, {
                title: task.title,
                description: task.description,
                status: newStatus
            });
            console.log("Task updated:", updatedTask.data);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const addedDate = new Date(task.addedDate);
    const formattedDate = addedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-gray-700 rounded-lg p-5 mb-4 shadow-inner">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-blue-300">{task.title}</h3>
                <RxCross2 onClick={() => deleteTask(task._id)} className="w-6 h-6 text-gray-300 hover:text-red-500 cursor-pointer shadow-lg bg-gray-800 rounded-full p-1 transition duration-300" />
            </div>

            <p className="text-gray-300 mt-2">{task.description}</p>
            <div className="flex justify-between items-center mt-4">
                <div>
                    <span className="text-sm text-gray-400">Status:</span>
                    <select
                        className={`text-sm bg-gray-600 rounded p-1 ml-2 ${status === 'completed' ? 'text-green-400' : 'text-red-400'
                            }`}
                        value={status}
                        onChange={(e) => updateStatus(e.target.value)}
                    >
                        <option value="completed"  className="text-green-400">Completed</option>
                        <option value="pending" className="text-red-400">Pending</option>
                        {/* <option value="in-progress" className="text-yellow-400">In Progress</option> */}
                    </select>

                </div>
                <span className="text-lg text-gray-400">Added: {formattedDate}</span>
            </div>
        </div>
    );
};

export default Task;
