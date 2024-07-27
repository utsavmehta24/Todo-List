"use client";
import { useEffect } from 'react';

export default function Slider() {
  useEffect(() => {
    const slider = document.querySelector('#slider');
    let currentLeft = 0;
    const interval = setInterval(() => {
      const max = slider.scrollWidth - slider.clientWidth;
      const left = slider.clientWidth;

      if (currentLeft + left >= max) {
        currentLeft = 0;
      } else {
        currentLeft += left;
      }

      slider.scrollTo({ left: currentLeft, behavior: 'smooth' });
    }, 3000); // Adjusted interval for better viewing experience

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden flex flex-nowrap text-center rounded" id="slider">
      {/* Slide 1 */}
      <div className="relative bg-gray-800 flex-none w-full flex flex-col items-center justify-center">
        <img src="https://th.bing.com/th/id/OIG3.rcqbtX.HXmil.rRhEOWn?pid=ImgGn" alt="Missed Deadlines" className="absolute inset-0 object-cover blur-md" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-4xl max-w-md">Missed Deadlines</h2>
          <p className="max-w-md">Not managing your tasks effectively often results in missed deadlines and lost opportunities.</p>
        </div>
      </div>
      {/* Slide 2 */}
      <div className="relative bg-gray-700 flex-none w-full flex flex-col items-center justify-center">
        <img src="https://th.bing.com/th/id/OIG3.ngaKfhg2nF4xz1zRgOKG?pid=ImgGn" alt="Increased Stress" className="absolute inset-0 object-cover blur-md" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-4xl max-w-md">Increased Stress</h2>
          <p className="max-w-md">Failure to keep track of your tasks can lead to increased stress and anxiety as deadlines approach.</p>
          <p className="max-w-md mt-4">Stress can manifest physically and emotionally, affecting your overall well-being.</p>
        </div>
      </div>
      {/* Slide 3 */}
      <div className="relative bg-gray-600 flex-none w-full flex flex-col items-center justify-center">
        <img src="https://th.bing.com/th/id/OIG3.5Dhp5.Qk7oNZ9R4PrObt?pid=ImgGn" alt="Decreased Productivity" className="absolute inset-0 object-cover blur-md" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h2 className="text-4xl max-w-md">Decreased Productivity</h2>
          <p className="max-w-md">When tasks are not organized, productivity decreases as time is wasted trying to remember what needs to be done.</p>
        </div>
      </div>
      {/* Slide 4 */}
      {/* ... other slides ... */}
    </div>
  );
}
