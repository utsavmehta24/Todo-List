"use client";
import { useEffect } from 'react';

export default function Slider() {
  useEffect(() => {
    const slider = document.querySelector('#slider');
    let currentIndex = 0;
    const slides = slider.children;
    const totalSlides = slides.length;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      const newLeft = slides[currentIndex].offsetLeft;
      slider.scrollTo({ left: newLeft, behavior: 'smooth' });
    }, 3000); // Adjusted interval for better viewing experience

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <div className="bg-gray-700 p-3">
      <div className="h-screen w-full overflow-hidden flex flex-nowrap text-center bg-gray-700" id="slider">
        {/* Slide 1 */}
        <div className="relative bg-gray-700 flex-none w-full flex flex-col items-center justify-center">
          <img src="https://assets.euromoneydigital.com/dims4/default/f62996c/2147483647/strip/true/crop/2000x1333+0+0/resize/840x560!/quality/90/?url=http%3A%2F%2Feuromoney-brightspot.s3.amazonaws.com%2F07%2Ff1%2Fbe88ebfa4d498c68094ab1466475%2Fadobestock-95012321.jpg" alt="Missed Deadlines" className="w-full rounded-lg" />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-70 p-4 rounded-lg">
            <h2 className="text-4xl max-w-md text-black font-bold text-center">Missed Deadlines</h2>
            <p className="max-w-md text-black text-center">Not managing your tasks effectively often results in missed deadlines and lost opportunities.</p>
          </div>
        </div>
        {/* Slide 2 */}
        <div className="relative bg-gray-700 flex-none w-full flex flex-col items-center justify-center">
          <img
            src="https://www.mccabeandco.com/wp-content/uploads/2018/11/stress-e1541526234162.jpg"
            alt="Increased Stress"
            className="w-full rounded-lg"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-70 p-4 rounded-lg">
            <h2 className="text-4xl max-w-md text-black font-bold text-center">Increased Stress</h2>
            <p className="max-w-md text-black text-center mt-2">
              Failure to keep track of your tasks can lead to increased stress and anxiety as deadlines approach.
            </p>
            <p className="max-w-md text-black text-center mt-4">
              Stress can manifest physically and emotionally, affecting your overall well-being.
            </p>
          </div>
        </div>
        {/* Slide 3 */}
        <div className="relative bg-gray-600 flex-none w-full flex flex-col items-center justify-center">
          <img src="https://empmonitor.com/blog/wp-content/uploads/2024/07/Decreased-Productivity.webp" alt="Decreased Productivity" className="w-full rounded-lg" />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-70 p-4 rounded-lg">
            <h2 className="text-4xl max-w-md text-black font-bold text-center">Decreased Productivity</h2>
            <p className="max-w-md text-black text-center">When tasks are not organized, productivity decreases as time is wasted trying to remember what needs to be done.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
