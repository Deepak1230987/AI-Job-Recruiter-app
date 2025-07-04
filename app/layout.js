import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { AuthProvider } from "./contexts/AuthContext";

import { Toaster } from "@/components/ui/sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Intervu.AI - AI-Powered Recruitment",
  description: "Transform your hiring process with AI-powered recruitment tools",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Provider>
            {children}
            <Toaster />
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
