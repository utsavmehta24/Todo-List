// async function takeTime(){
//     await new Promise((resolve) => {
//         setTimeout(resolve, 3000);
//     });
// };

export default async function Utsav() {
    // await takeTime();
    // throw Error('Something went wrong');
    return (
        <div className="flex items-center justify-center flex-col p-24">
            <h1 className="text-3xl font-bold p-4">Utsav</h1>
            <p className="text-2xl p-4 m">Yes, I did it!!</p>
        </div>
    );
}
