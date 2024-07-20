"use client";

export default function Uerror({error, reset}) {
    return (
        <div className="flex items-center justify-center flex-col p-24">
            <h1 className="text-3xl font-bold p-4">Error</h1>
            <p className="text-2xl p-4 m">Something went wrong</p>
        </div>
    );
}