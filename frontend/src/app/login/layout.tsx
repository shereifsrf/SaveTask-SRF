import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to SaveTask - SRF",
  description: "A brother of SaveSpend.com",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section>{children}</section>;
}
