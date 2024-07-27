// async function takeTime(){
//     await new Promise((resolve) => {
//         setTimeout(resolve, 3000);
//     });
// };

export default async function Utsav() {
    // await takeTime();
    // throw Error('Something went wrong');
    return (
        <div className="flex items-center justify-center flex-col p-24 bg-gray-800">
            <div className="p-4 rounded-md shadow-md animate-slide-in">
                <h2 className="text-2xl font-bold">Under Development</h2>
                <p>This application is currently under development. If you encounter any bugs or issues, please report them to <a href="mailto:utsavmehta240702003@gmail.com" className="text-blue-600 hover:text-blue-800">here</a>.</p>
                <ul className="list-disc pl-4">
                    <li>Features are being added regularly</li>
                    <li>Bug fixes are being implemented</li>
                    <li>Performance optimizations are underway</li>
                </ul>
            </div>
            <div className="flex justify-center mt-8 animate-zoom-in">
                <a
                    href="https://github.com/utsavmehta24"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Stay Tuned for Updates!
                </a>
            </div>
        </div>
    );
}