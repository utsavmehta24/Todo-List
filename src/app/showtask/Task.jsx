import { RxCross2 } from "react-icons/rx";

const Task = ({ task,deletetaskParent }) => {
    function deleteTask(id) {
        deletetaskParent(id);
    }
    // Convert addedDate string to a Date object
    const addedDate = new Date(task.addedDate);

    // Format the date as needed, e.g., 'MM/DD/YYYY'
    const formattedDate = addedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Determine the color class based on the task status
    const statusColorClass = task.status === 'completed' ? 'text-green-400' : 'text-red-400';

    return (
        <div className="bg-gray-700 rounded-lg p-5 mb-4 shadow-inner">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-blue-300">{task.title}</h3>
                <RxCross2 onClick={() => deleteTask(task._id)} className="w-6 h-6 text-gray-300 hover:text-red-500 cursor-pointer shadow-lg bg-gray-800 rounded-full p-1 transition duration-300"/>
            </div>

            <p className="text-gray-300 mt-2">{task.description}</p>
            <div className="flex justify-between items-center mt-4">
                <span className={`text-sm ${statusColorClass}`}>Status: {task.status}</span>
                <span className="text-lg text-gray-400">Added: {formattedDate}</span>
            </div>
        </div>
    );
};

export default Task;
