import Provider from "./provider";
import "./globals.css";
import Header from "./components/custom/Header";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Footer from "./components/custom/Footer";
import { Roboto } from 'next/font/google'; // Importing the font directly from Next.js
import { Toaster } from "sonner";


const montserrat = Roboto({
  weight: ['100', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: "Kriti AI Studio — Multi-Pipeline AI Web Engineering & Live Sandbox",
  description: "Generate full-stack React web applications from natural language prompts, voice commands, and wireframe sketches with automated ML color harmony and live sandbox editing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body>
       
        <ConvexClientProvider>
        <Provider>
      
        {children}
        <Toaster/>
        </Provider>
        </ConvexClientProvider>
        {/* <div className="flex p-3 items-center justify-center m-0 bg-purple-950 text-white bottom-0 left-0 w-full">
    <p className="text-xs text-gray-300">Copyright 2025</p>
  </div> */}
      </body>
    </html>
  );
}
