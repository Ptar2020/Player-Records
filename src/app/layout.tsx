// layout.jsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./_partials/Navbar";
import Footer from "./_partials/Footer";
import { UserProvider } from "./_utils/AuthProvider";
import Main from "./getRefreshToken";

export const metadata: Metadata = {
  title: "PLAYER RECORDS",
  description: "PRODUCT OF LINKITS DIGITAL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <html lang="en">
        <body>
          <Navbar />
          <main className="layout">{children}</main>
          <Footer />
          <Main />
        </body>
      </html>
    </UserProvider>
  );
}
