import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "../config/site";
import { SiteHeader } from "../components/site-header";
import SiteFooter from "../components/site-footer";

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
                    <SiteHeader />
                    <div className="flex-1">{children}</div>
                    <SiteFooter />
                </div>
            </body>
        </html>
    );
}
