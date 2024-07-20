'use client'

import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";


export function DocsDrawer({ children }: Readonly<{ children: React.ReactNode }>) {

    const [isFixed, setIsFixed] = useState(false);
    const [isQuickStartOpen, setIsQuickStartOpen] = useState(true);
    const [isFrameworkDesignOpen, setIsFrameworkDesignOpen] = useState(false);

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

    useEffect(() => {
        if (pathname.startsWith('/docs/framework-design')) {
            setIsQuickStartOpen(false);
            setIsFrameworkDesignOpen(true);
        }
    }, [pathname]);

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
                <ul className="menu bg-base-200 text-base-content min-h-full w-72 p-4">
                    {/* Sidebar content here */}
                    <div className="flex items-center mb-4">
                        <a className="btn btn-ghost text-xl" href="/">
                            <Image src="/gf-logo.png" alt="logo" width={32} height={32} />
                            Goframe V2
                        </a>
                    </div>
                    <li>
                        <details open={isQuickStartOpen}>
                            <summary ><Link className="" href="/docs/">Quick Start</Link></summary>
                            <ul>
                                {pathname === '/docs' ? <li><Link className="active" href="/docs/">Introduction</Link></li> : <li><Link href="/docs/">Introduction</Link></li>}
                                {pathname === '/docs/installation' ? <li><Link className="active" href="/docs/installation">Installation</Link></li> : <li><Link href="/docs/installation">Installation</Link></li>}
                                {pathname === '/docs/create-application' ? <li><Link className="active" href="/docs/create-application">Create Application</Link></li> : <li><Link href="/docs/create-application">Create Application</Link></li>}
                                {pathname === '/docs/startup' ? <li><Link className="active" href="/docs/startup">Startup</Link></li> : <li><Link href="/docs/startup">Startup</Link></li>}
                                {pathname === '/docs/configuration' ? <li><Link className="active" href="/docs/configuration">Configuration</Link></li> : <li><Link href="/docs/configuration">Configuration</Link></li>}
                                {pathname === '/docs/example' ? <li><Link className="active" href="/docs/example">Example</Link></li> : <li><Link href="/docs/example">Example</Link></li>}
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details open={isFrameworkDesignOpen}>
                            <summary ><Link className="active" href="/docs/framework-design/module-design">Framework Design</Link></summary>
                            <ul>
                                {pathname === '/docs/framework-design/module-design' ? <li><Link className="active" href="/docs/framework-design/module-design">Module Design</Link></li> : <li><Link href="/docs/framework-design/module-design">Module Design</Link></li>}
                                {pathname === '/docs/framework-design/unified-framework-design' ? <li><Link className="active" href="/docs/framework-design/module-design">Unified Framework Design</Link></li> : <li><Link href="/docs/framework-design/unified-framework-design">Unified Framework Design</Link></li>}
                                {pathname === '/docs/framework-design/project-package-design' ? <li><Link className="active" href="/docs/framework-design/project-package-design">Project Package Design</Link></li> : <li><Link href="/docs/framework-design/project-package-design">Project Package Design</Link></li>}
                                {pathname === '/docs/framework-design/dao-design' ? <li><Link className="active" href="/docs/framework-design/dao-design">DAO Design</Link></li> : <li><Link href="/docs/framework-design/dao-design">DAO Design</Link></li>}
                                {pathname === '/docs/framework-design/constructure-design' ? <li><Link className="active" href="/docs/framework-design/constructure-design">Constructure Design</Link></li> : <li><Link href="/docs/framework-design/constructure-design">Constructure Design</Link></li>}
                                {pathname === '/docs/framework-design/data-bz-model' ? <li><Link className="active" href="/docs/framework-design/data-bz-model">Data&BZ Model</Link></li> : <li><Link href="/docs/framework-design/data-bz-model">Data&BZ Model</Link></li>}
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>
        </div>
    )
}