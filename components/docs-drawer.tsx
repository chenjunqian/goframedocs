'use client'

import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";


export function DocsDrawer({ children }: Readonly<{ children: React.ReactNode }>) {

    const [isFixed, setIsFixed] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsFixed(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="drawer lg:drawer-open">
            <input id="docs-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Page content here */}
                <div className={`w-full lg:hidden flex h-10 bg-base-200 mt-1 ${isFixed ? 'fixed top-0 z-40' : ''}`}>
                    <div className="flex justify-start items-center">
                        <label htmlFor="docs-drawer" className="btn btn-sm btn-ghost drawer-button flex justify-start items-center ml-4">
                            <Menu className="w-5 h-5" />
                            <span>Menu</span>
                        </label>
                    </div>
                </div>
                <div className={`w-full lg:hidden h-10 ${isFixed ? 'block' : 'hidden'}`}></div>
                <div className="w-full">{children}</div>
            </div>
            <div className="drawer-side z-40">
                <label htmlFor="docs-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-64 p-4">
                    {/* Sidebar content here */}
                    <div className="flex items-center mb-4">
                        <Image src="/gf-logo.png" alt="logo" width={32} height={32} />
                        <a className="btn btn-sm btn-ghost text-xl" href="/">Goframe V2</a>
                    </div>
                    <li>
                        <details open>
                            <summary ><Link className="active" href="/docs/">Quick Start</Link></summary>
                            <ul>
                                {pathname === '/docs' ? <li><Link className="active" href="/docs/">Introduction</Link></li> : <li><Link href="/docs/">Introduction</Link></li>}
                                {pathname === '/docs/installation' ? <li><Link className="active" href="/docs/installation">Installation</Link></li> : <li><Link href="/docs/installation">Installation</Link></li>}
                                {pathname === '/docs/create-application' ? <li><Link className="active" href="/docs/create-application">Create Application</Link></li> : <li><Link href="/docs/create-application">Create Application</Link></li>}
                                {pathname === '/docs/instance-startup' ? <li><Link className="active" href="/docs/instance-startup">Instance Startup</Link></li> : <li><Link href="/docs/instance-startup">Instance Startup</Link></li>}
                                {pathname === '/docs/example' ? <li><Link className="active" href="/docs/example">Example</Link></li> : <li><Link href="/docs/example">Example</Link></li>}
                            </ul>
                        </details>
                    </li>
                    <li><a>Sidebar Item 2</a></li>
                </ul>
            </div>
        </div>
    )
}