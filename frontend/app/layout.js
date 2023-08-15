"use client";

import { AlertTost } from "@/components/alert";
import "@/styles/globals.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Script from "next/script";
import React from "react";
import { Poppins } from "next/font/google";

const inter = Poppins({ subsets: ["latin"],weight:"500" });

const queryClient = new QueryClient();

const ScriptComponent = () => {
  return (
    <>
      <Script src="https://cdn.lordicon.com/bhenfmcm.js" />
      <Script
        src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
        async
      />
    </>
  );
};

export default function RootLayout({ children }) {
  return (
    <React.StrictMode>
      <html lang="en">
        <head>
          <link rel="icon" href="/logo.png" type="image/x-icon" />
          <meta
            name="description"
            content="youngstorage the private cloud space"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#334afd" />
          <title>youngstorage</title>
          <ScriptComponent />
        </head>
        <body className={inter.className}>
          <AlertTost />
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </body>
      </html>
    </React.StrictMode>
  );
}
