import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import { AppContextProvider } from "@/context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Astera — Resource Library",
  description:
    "A free, organized library of notes, study guides, and resources for students everywhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,500;1,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AppContextProvider>
          <ScrollReveal />
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
