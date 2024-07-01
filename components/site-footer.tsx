import { siteConfig } from "../config/site";


export default function SiteFooter() {
    return (
        <footer className="bg-background sticky top-0 z-40 w-full border-t mt-9">
            <div className="container flex flex-col items-center justify-between py-10 gap-4 md:h-24 md:flex-row">
                <p className="text-sm text-muted-foreground">
                    Copyright © 2020 - {new Date().getFullYear()} <a href={siteConfig.links.github} target="_blank">Goframe</a>. All rights reserved.
                </p>
                <p className="text-sm text-muted-foreground">
                    Powered by <a href={siteConfig.links.github} target="_blank">Goframe</a>.
                </p>
            </div>
        </footer>
    )
}