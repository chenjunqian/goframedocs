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
    const [isDevelopmentOpen, setIsDevelopmentOpen] = useState(false);
    const [isCoreComponentsOpen, setIsCoreComponentsOpen] = useState(false);
    const [isCliManagementOpen, setIsCliManagementOpen] = useState(false);
    const [isConfigurationOpen, setIsConfigurationOpen] = useState(false);
    const [isLogOpen, setIsLogOpen] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);

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
        setIsQuickStartOpen(false);
        setIsDevelopmentOpen(false);
        setIsFrameworkDesignOpen(false);
        setIsCoreComponentsOpen(false);
        setIsCliManagementOpen(false);
        setIsConfigurationOpen(false);
        setIsLogOpen(false);
        setIsErrorOpen(false);
        if (pathname.startsWith('/docs/framework-design')) {
            setIsFrameworkDesignOpen(true);
        } else if (pathname.startsWith('/docs/development')) {
            setIsDevelopmentOpen(true);
        } else if (pathname.startsWith('/docs/core-component')) {
            setIsCoreComponentsOpen(true);
            if (pathname.startsWith('/docs/core-component/command')) {
                setIsCliManagementOpen(true);
            } else if (pathname.startsWith('/docs/core-component/configuration')) {
                setIsConfigurationOpen(true);
            } else if (pathname.startsWith('/docs/core-component/log')) {
                setIsLogOpen(true);
            } else if (pathname.startsWith('/docs/core-component/error')) {
                setIsErrorOpen(true);
            }
        } else {
            setIsQuickStartOpen(true);
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
                            Goframe
                        </a>
                    </div>
                    <li>
                        <details open={isQuickStartOpen}>
                            <summary ><Link className="" href="/docs/">Quick Start</Link></summary>
                            <ul>
                                <li><Link className={pathname === '/docs/' ? 'active' : ''} href="/docs/">Introduction</Link></li>
                                <li><Link className={pathname === '/docs/installation' ? 'active' : ''} href="/docs/installation">Installation</Link></li>
                                <li><Link className={pathname === '/docs/create-application' ? 'active' : ''} href="/docs/create-application">Create Application</Link></li>
                                <li><Link className={pathname === '/docs/startup' ? 'active' : ''} href="/docs/startup">Startup</Link></li>
                                <li><Link className={pathname === '/docs/configuration' ? 'active' : ''} href="/docs/configuration">Configuration</Link></li>
                                <li><Link className={pathname === '/docs/example' ? 'active' : ''} href="/docs/example">Example</Link></li>
                            </ul>
                        </details>
                    </li>
                    {/* <li>
                        <details open={isDevelopmentOpen}>
                            <summary ><Link className="active" href="/docs/development/prepare">Development</Link></summary>
                            <ul>
                                <li><Link className={pathname === '/docs/development/prepare' ? 'active' : ''} href="/docs/development/prepare">Preparation</Link></li> 
                            </ul>
                        </details>
                    </li> */}
                    <li>
                        <details open={isCoreComponentsOpen}>
                            <summary ><Link className="active" href="/docs/core-component/object-management">Core Components</Link></summary>
                            <ul>
                                <li><Link className={pathname === '/docs/core-component/object-management' ? 'active' : ''} href="/docs/core-component/object-management">Object Management</Link></li>
                            </ul>
                            <ul>
                                <li><Link className={pathname === '/docs/core-component/debug-mode' ? 'active' : ''} href="/docs/core-component/debug-mode">Debug Mode</Link></li>
                                <li>
                                    <details open={isCliManagementOpen}>
                                        <summary ><Link className="active" href="/docs/core-component/coommand">Command</Link></summary>
                                        <ul>
                                            <li><Link className={pathname === '/docs/core-component/command/basic-concept' ? 'active' : ''} href="/docs/core-component/command/basic-concept">Basic Concept</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/command/function' ? 'active' : ''} href="/docs/core-component/command/function">Function</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/command/parser' ? 'active' : ''} href="/docs/core-component/command/parser">Parser</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/command/object' ? 'active' : ''} href="/docs/core-component/command/object">Object</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/command/parameter' ? 'active' : ''} href="/docs/core-component/command/parameter">Parameter</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/command/terminal-interaction' ? 'active' : ''} href="/docs/core-component/command/terminal-interaction">Terminal Interaction</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/command/tracing' ? 'active' : ''} href="/docs/core-component/command/tracing">Tracing</Link></li>
                                        </ul>
                                    </details>
                                </li>
                                <li>
                                    <details open={isConfigurationOpen}>
                                        <summary ><Link className="active" href="/docs/core-component/configuration">Configuration</Link></summary>
                                        <ul>
                                            <li><Link className={pathname === '/docs/core-component/configuration/object' ? 'active' : ''} href="/docs/core-component/configuration/object">Object</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/configuration/config-file' ? 'active' : ''} href="/docs/core-component/configuration/config-file">Config File</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/configuration/function' ? 'active' : ''} href="/docs/core-component/configuration/function">Function</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/configuration/interface-base' ? 'active' : ''} href="/docs/core-component/configuration/interface-base">Interface-Base</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/configuration/adapter' ? 'active' : ''} href="/docs/core-component/configuration/adapter">Adapter</Link></li>
                                        </ul>
                                    </details>
                                </li>
                                <li>
                                    <details open={isLogOpen}>
                                        <summary ><Link className="active" href="/docs/core-component/log">Log</Link></summary>
                                        <ul>
                                            <li><Link className={pathname === '/docs/core-component/log/config' ? 'active' : ''} href="/docs/core-component/log/config">Configuration</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/log/level' ? 'active' : ''} href="/docs/core-component/log/level">Level</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/log/path' ? 'active' : ''} href="/docs/core-component/log/path">Path</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/log/chain-opts' ? 'active' : ''} href="/docs/core-component/log/chain-opts">Chain Opts</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/log/color-print' ? 'active' : ''} href="/docs/core-component/log/color-print">Color Print</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/log/context' ? 'active' : ''} href="/docs/core-component/log/context">Context</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/log/handler' ? 'active' : ''} href="/docs/core-component/log/handler">Handler</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/log/json-format' ? 'active' : ''} href="/docs/core-component/log/json-format">JSON Format</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/log/async' ? 'active' : ''} href="/docs/core-component/log/async">Async</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/log/stack-print' ? 'active' : ''} href="/docs/core-component/log/stack-print">Stack Print</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/log/debug-info' ? 'active' : ''} href="/docs/core-component/log/debug-info">Debug Info</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/log/writer' ? 'active' : ''} href="/docs/core-component/log/writer">Writer</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/log/flags' ? 'active' : ''} href="/docs/core-component/log/flags">Flags</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/log/rotate' ? 'active' : ''} href="/docs/core-component/log/rotate">Rotate</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/log/faq' ? 'active' : ''} href="/docs/core-component/log/faq">FAQ</Link></li>
                                        </ul>
                                    </details>
                                </li>
                                <li>
                                    <details open={isErrorOpen}>
                                        <summary ><Link className="active" href="/docs/core-component/error">Error</Link></summary>
                                        <ul>
                                            <li><Link className={pathname === '/docs/core-component/error/function' ? 'active' : ''} href="/docs/core-component/error/function">Function</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/error/stack' ? 'active' : ''} href="/docs/core-component/error/stack">Stack</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/error/compare' ? 'active' : ''} href="/docs/core-component/error/compare">Compare</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/error/code' ? 'active' : ''} href="/docs/core-component/error/code">Code</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/error/others' ? 'active' : ''} href="/docs/core-component/error/others">Others</Link></li>
                                            <li><Link className={pathname === '/docs/core-component/error/best-practices' ? 'active' : ''} href="/docs/core-component/error/best-practices">Best Practices</Link></li>
                                        </ul>
                                    </details>
                                </li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details open={isFrameworkDesignOpen}>
                            <summary ><Link className="active" href="/docs/framework-design/module-design">Framework Design</Link></summary>
                            <ul>
                                <li><Link className={pathname === '/docs/framework-design/module-design' ? 'active' : ''} href="/docs/framework-design/module-design">Module Design</Link></li>
                                <li><Link className={pathname === '/docs/framework-design/unified-framework-design' ? 'active' : ''} href="/docs/framework-design/unified-framework-design">Unified Framework Design</Link></li>
                                <li><Link className={pathname === '/docs/framework-design/project-package-design' ? 'active' : ''} href="/docs/framework-design/project-package-design">Project Package Design</Link></li>
                                <li><Link className={pathname === '/docs/framework-design/dao-design' ? 'active' : ''} href="/docs/framework-design/dao-design">DAO Design</Link></li>
                                <li><Link className={pathname === '/docs/framework-design/constructure-design' ? 'active' : ''} href="/docs/framework-design/constructure-design">Constructure Design</Link></li>
                                <li><Link className={pathname === '/docs/framework-design/data-bz-model' ? 'active' : ''} href="/docs/framework-design/data-bz-model">Data&BZ Model</Link></li>
                                <li><Link className={pathname === '/docs/framework-design/microservice' ? 'active' : ''} href="/docs/framework-design/microservice">Microservice</Link></li>
                                <li><Link className={pathname === '/docs/framework-design/tracing-design' ? 'active' : ''} href="/docs/framework-design/tracing-design">Tracing Design</Link></li>
                                <li><Link className={pathname === '/docs/framework-design/error-design' ? 'active' : ''} href="/docs/framework-design/error-design">Error Design</Link></li>
                                <li><Link className={pathname === '/docs/framework-design/interface-generic-design' ? 'active' : ''} href="/docs/framework-design/interface-generic-design">Interface&Generic</Link></li>
                                <li><Link className={pathname === '/docs/framework-design/implict-explicit-init' ? 'active' : ''} href="/docs/framework-design/implict-explicit-init">Implict&Explicit Init</Link></li>
                                <li><Link className={pathname === '/docs/framework-design/context-design' ? 'active' : ''} href="/docs/framework-design/context-design">Context Design</Link></li>
                                <li><Link className={pathname === '/docs/framework-design/enum-management' ? 'active' : ''} href="/docs/framework-design/enum-management">Enum Management</Link></li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>
        </div>
    )
}