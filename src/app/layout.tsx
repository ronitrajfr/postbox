import "~/styles/globals.css";
import Providers from "~/components/Provider";
import { Toaster } from "~/components/ui/toaster";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Clave",
  description:
    "A coding quiz app to challenge and test your programming knowledge. Compete with friends and learn together! :D ",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <Providers>
        <body>{children}</body>
        <Toaster />
      </Providers>
    </html>
  );
}
