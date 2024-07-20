import { Inter } from "next/font/google";
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Head from "next/head";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head >
        <link
          rel="stylesheet"
          href="https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css"
        />
        <link
          rel="stylesheet"
          href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css"
        />
      </Head>
      <body className={inter.className}>
        < ToastContainer />
        <Navbar />

        {/* <p className="text-black text-5xl font-bold text-center ms-auto">Hi How are you</p> */}
        {children}
        <Footer />
      </body>
    </html >
  );
}
