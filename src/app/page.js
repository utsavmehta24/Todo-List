import MainFeatures from "./Mainpage/Features";
import IntroBanner from "./Mainpage/IntroBanner";
import Slider from "./Mainpage/SliderInfo";

export const metadata = {
  title: "Home : Gerneral Todo's",
  description: "Home",
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
