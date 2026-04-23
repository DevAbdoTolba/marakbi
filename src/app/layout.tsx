import "./globals.css";
import '@smastrom/react-rating/style.css';
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "DAFFA | Explore Egypt’s Hidden Gems",
    template: "%s | DAFFA",
  },
  description: "Discover the best locations, trips, and adventures in Egypt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
