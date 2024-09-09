import type { Metadata } from "next";
import "./globals.css";
import { constant } from "@/util/constant";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "SaveTask - SRF",
  description: constant.mainDescription,
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
