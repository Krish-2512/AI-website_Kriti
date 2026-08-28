"use client";
import React, { useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MessageContext } from "./context/MessageContext";
import { UserContext } from "./context/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "../convex/_generated/api";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import Header from "./components/custom/Header";
import { AppSidebar } from "./components/custom/AppSideBar";
import { ActionContext } from "./context/ActionContext";
import Footer from "./components/custom/Footer";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function Provider({ children }) {
  const convex = useConvex();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [action, setAction] = useState(null);

  const isAuthenticated = async () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsedUser = JSON.parse(stored);
          setUser(parsedUser);

          if (convex && api?.user?.GetUser && parsedUser?.email) {
            try {
              const remoteUser = await convex.query(api.user.GetUser, {
                email: parsedUser.email,
              });
              if (remoteUser) {
                setUser(remoteUser);
              }
            } catch (err) {
              console.warn("Could not sync remote user from Convex:", err);
            }
          }
        }
      } catch (e) {
        console.warn("Error reading user storage:", e);
      }
    }
  };

  useEffect(() => {
    isAuthenticated();
  }, []);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "102837465910-dummyclientid.apps.googleusercontent.com";
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb";

  return (
    <div>
      <GoogleOAuthProvider clientId={googleClientId}>
        <PayPalScriptProvider options={{ clientId: paypalClientId }}>
          <UserContext.Provider value={{ user, setUser }}>
            <MessageContext.Provider value={{ messages, setMessages }}>
              <ActionContext.Provider value={{ action, setAction }}>
                <NextThemesProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange
                >
                  <Header />
                  <SidebarProvider defaultOpen={false}>
                    <AppSidebar />
                    <main className="flex-1 w-full overflow-x-hidden">
                      {children}
                    </main>
                  </SidebarProvider>
                  <Footer />
                </NextThemesProvider>
              </ActionContext.Provider>
            </MessageContext.Provider>
          </UserContext.Provider>
        </PayPalScriptProvider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default Provider;
