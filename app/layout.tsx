import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "../config/site";
import { cn } from "../lib/utils";
import { fontSans } from "../lib/fonts";
import { ThemeProvider } from "../components/theme-provide";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
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
            <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans)}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <div className="relative flex min-h-screen flex-col">
                        <SiteHeader />
                        <div className="flex-1">{children}</div>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
