"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Utsav() {
    const [quote, setQuote] = useState({ text: "", author: "" });
    const [displayedText, setDisplayedText] = useState("");
    const [isFetching, setIsFetching] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const res = await fetch("/quotes.json"); // Fetch from the local JSON file
                if (!res.ok) {
                    throw new Error("Failed to fetch quotes");
                }
                const quotes = await res.json();
                if (quotes.length > 0) {
                    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchQuotes();

        const intervalId = setInterval(() => {
            fetchQuotes();
        }, 5000); // Fetch a new quote every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (isFetching || isTransitioning) return;

        const animateQuote = () => {
            setIsTransitioning(true);

            // Clear previous quote and animate new one
            setDisplayedText(""); // Clear displayed text before animating new quote
            const words = quote.text.split(' ');
            let index = 0;

            const displayNextWord = () => {
                if (index < words.length) {
                    setDisplayedText((prev) => prev + (prev ? ' ' : '') + words[index]);
                    index++;
                } else {
                    setIsTransitioning(false); // Animation complete
                }
            };

            const intervalId = setInterval(displayNextWord, 100); // Adjust delay for word-by-word speed

            return () => clearInterval(intervalId);
        };

        animateQuote();
    }, [quote]);

    // Clean up author string
    const cleanAuthor = (author) => {
        return author?.split(',')[0]?.trim() || "Unknown";
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-900 min-h-screen text-white">
            <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-md shadow-md">
                <h2 className="text-3xl font-bold mb-4 animate-slide-in">Dashboard</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Task Summary */}
                    <Link href="/showtask">
                        <div className="p-4 bg-gray-700 rounded-md shadow-md animate-slide-in flex flex-col items-center justify-center text-center text-3xl cursor-pointer">
                            <h3 className="font-semibold mb-2 text-3xl">Show Task</h3>
                        </div>
                    </Link>

                    {/* Task Creation */}
                    <Link href="/addtask">
                        <div className="p-4 bg-gray-700 rounded-md shadow-md animate-slide-in flex flex-col items-center justify-center text-center text-3xl cursor-pointer">
                            <h3 className="font-semibold mb-2 text-3xl">Create New Task</h3>
                        </div>
                    </Link>

                    {/* Motivational Line */}
                    <div className="p-4 bg-gray-700 rounded-md shadow-md animate-slide-in">
                        <h3 className="text-xl font-semibold mb-2">Thoughts</h3>
                        <div className="mb-4">
                            <p className="whitespace-pre-wrap">{displayedText}</p>
                            <p className="text-blue-400">{cleanAuthor(quote.author)}</p>
                        </div>
                    </div>

                    {/* Links & Updates */}
                    <div className="p-4 bg-gray-700 rounded-md shadow-md animate-slide-in">
                        <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
                        <p>Keep track of the latest updates and features added to the application.</p>
                        <div className="flex justify-center mt-4">
                            <a
                                href="https://github.com/utsavmehta24"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Follow on GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
