import Link from "next/link";
import { siteConfig } from "../config/site";
import { HeaderNav } from "./site-header-nav";
import { Button } from "./ui/button";
import { Github } from "lucide-react";

export function SiteHeader() {

    return (
        <header className="bg-background sticky top-0 z-40 w-full border-b">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <HeaderNav items={siteConfig.mainNav} />
                <Link className="flex items-center space-x-2" href="https://github.com/gogf/gf" target="_blank">
                    <Button size={"icon"}>
                        <Github />
                    </Button>
                </Link>
            </div>
        </header>
    )
}