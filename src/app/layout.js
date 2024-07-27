import { Inter } from "next/font/google";
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import UserProvider from "@/context/userProvider";
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  stylesheets: [
    {
      href: "https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css",
      rel: "stylesheet",
    },
    {
      hrefs: "https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css",
      rels: "stylesheet",
    },
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          < ToastContainer />
          <Navbar />
          {children}
          <Footer />
        </UserProvider>
      </body>
    </html >
  );
}
