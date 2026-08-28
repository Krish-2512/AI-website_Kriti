import Provider from "./provider";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Kriti AI Studio — Multi-Pipeline AI Web Engineering & Live Sandbox",
  description: "Generate full-stack React web applications from natural language prompts, voice commands, and wireframe sketches with automated ML color harmony and live sandbox editing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}

