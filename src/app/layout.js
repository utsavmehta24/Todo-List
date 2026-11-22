import { Inter } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import UserProvider from "@/context/userProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "TaskFlow — Built by Utsav",
    template: "%s | TaskFlow by Utsav",
  },
  description: "Energy-Aware Flow Engine for Modern Task Management · Crafted for Developers, Creators & ADHD Focus · Built by Utsav",
  applicationName: "TaskFlow",
  authors: [{ name: "Utsav Mehta", url: "https://github.com/utsavmehta24" }],
  creator: "Utsav Mehta",
  publisher: "Utsav Mehta",
  manifest: "/manifest.json",
  openGraph: {
    title: "TaskFlow — Built by Utsav",
    description: "Modern, energy-aware to-do application with natural-language capture, deep-work Pomodoro mode, and offline-first persistence.",
    url: "https://github.com/utsavmehta24/Todo-List",
    siteName: "TaskFlow by Utsav",
    locale: "en_US",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white`}>
        <UserProvider>
          <Navbar />
          <ToastContainer
            theme="dark"
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
          />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
