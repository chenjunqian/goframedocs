import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "../config/site";
import { Github } from "lucide-react";

export function SiteHeader() {

    return (
        <header className="z-40 sticky w-full lg:fixed">
            <div className="navbar bg-base-200">
                <div className="navbar-start">
                    <Image src="/gf-logo.png" alt="logo" width={32} height={32} className="ml-6" />
                    <a className="btn btn-ghost text-xl" href="/">Goframe</a>
                </div>
                <div className="navbar-center flex">
                </div>
                <div className="navbar-end">
                    <ul className="px-1 flex items-center">
                        <li className="mr-4">
                            <Link href="/docs">
                                <button className="btn btn-sm btn-ghost text-lg">Document</button>
                            </Link>
                        </li>
                        <li className="mr-4">
                            <Link href={siteConfig.links.github} target="_blank">
                                <button className="btn btn-sm btn-circle">
                                    <Github className="w-5 h-5" />
                                </button>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}