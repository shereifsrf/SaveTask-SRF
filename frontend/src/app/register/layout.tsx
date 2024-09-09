import type { Metadata } from "next";
import { constant } from "@/util/constant";

export const metadata: Metadata = {
  title: "Register SaveTask - SRF",
  description: constant.mainDescription,
};

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section>{children}</section>;
}
