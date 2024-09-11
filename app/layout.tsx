import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "../config/site";
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head></head>
            <body className="">
                <div className="relative flex min-h-screen flex-col">
                    <div className="flex-1">{children}</div>
                </div>
                <Analytics />
            </body>
        </html>
    );
}
