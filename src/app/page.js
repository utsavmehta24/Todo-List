import MainFeatures from "./Mainpage/Features";
import IntroBanner from "./Mainpage/IntroBanner";
import Slider from "./Mainpage/SliderInfo";

export const metadata = {
  title: "TaskFlow — Flow-First To-Do Engine · Built by Utsav",
  description: "An energy-aware productivity engine with natural-language input, deep work Pomodoro flow mode, and 100% offline persistence. Built by Utsav.",
};

export default function Home() {
  return (
    <>
      <IntroBanner />
      <MainFeatures />
      <Slider />
    </>
  );
}
