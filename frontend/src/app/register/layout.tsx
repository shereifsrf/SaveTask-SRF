import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register SaveTask - SRF",
  description: "A brother of SaveSpend.com",
};

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section>{children}</section>;
}
