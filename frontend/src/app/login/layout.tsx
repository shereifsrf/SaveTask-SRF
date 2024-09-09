import type { Metadata } from "next";
import { constant } from "@/util/constant";

export const metadata: Metadata = {
  title: "Login to SaveTask - SRF",
  description: constant.mainDescription,
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section>{children}</section>;
}
