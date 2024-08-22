'use client'

import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { routerInfoDic } from "@/config/site";
import { MarkdownHeading } from "@/components/docs-markdown-heading-navigator";


export function DocsDrawer({ children, markdownHeadings }: Readonly<{ children: React.ReactNode, markdownHeadings?: MarkdownHeading[] }>) {

    const [isFixed, setIsFixed] = useState(false);
    const [isQuickStartOpen, setIsQuickStartOpen] = useState(true);
    const [isFrameworkDesignOpen, setIsFrameworkDesignOpen] = useState(false);
    const [isDevelopmentOpen, setIsDevelopmentOpen] = useState(false);
    const [isCoreComponentsOpen, setIsCoreComponentsOpen] = useState(false);
    const [isCliManagementOpen, setIsCliManagementOpen] = useState(false);
    const [isConfigurationOpen, setIsConfigurationOpen] = useState(false);
    const [isLogOpen, setIsLogOpen] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [isDataValidOpen, setIsDataValidOpen] = useState(false);
    const [isTypeConvertOpen, setIsTypeConvertOpen] = useState(false);

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
            } else if (pathname.startsWith('/docs/core-component/data-valid')) {
                setIsDataValidOpen(true);
            } else if (pathname.startsWith('/docs/core-component/type-convert')) {
                setIsTypeConvertOpen(true);
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
                    <div className="flex w-full justify-start items-center">
                        <div className="w-1/2 flex justify-start">
                            <label htmlFor="docs-drawer" className="btn btn-sm btn-ghost drawer-button flex justify-start items-center ml-4">
                                <Menu className="w-5 h-5" />
                                <span>Menu</span>
                            </label>
                        </div>
                        <div className="w-1/2 flex justify-end">
                            <div className="dropdown dropdown-bottom dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-sm btn-ghost m-1">On this page</div>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-72 p-2 shadow">
                                    {
                                        markdownHeadings?.map((heading) => (
                                            <li><a className={`text-sm ${heading.level === 1 ? 'font-bold' : ''}  ${heading.level === 2 ? 'ml-4' : 'ml-6'} `} href={heading.slug}>{heading.text}</a></li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
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
                                <li><Link className={pathname === routerInfoDic['installation'].fullPath ? 'active' : ''} href={routerInfoDic['installation'].fullPath}>Installation</Link></li>
                                <li><Link className={pathname === routerInfoDic['create-application'].fullPath ? 'active' : ''} href={routerInfoDic['create-application'].fullPath}>Create Application</Link></li>
                                <li><Link className={pathname === routerInfoDic['startup'].fullPath ? 'active' : ''} href={routerInfoDic['startup'].fullPath}>Startup</Link></li>
                                <li><Link className={pathname === routerInfoDic['configuration'].fullPath ? 'active' : ''} href={routerInfoDic['configuration'].fullPath}>Configuration</Link></li>
                                <li><Link className={pathname === routerInfoDic['example'].fullPath ? 'active' : ''} href={routerInfoDic['example'].fullPath}>Example</Link></li>
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
                            <summary ><Link className="active" href={routerInfoDic['core-component/object-management'].fullPath}>Core Components</Link></summary>
                            <ul>
                                <li><Link className={pathname === routerInfoDic['core-component/object-management'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/object-management'].fullPath}>Object Management</Link></li>
                            </ul>
                            <ul>
                                <li><Link className={pathname === routerInfoDic['core-component/debug-mode'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/debug-mode'].fullPath}>Debug Mode</Link></li>
                                <li>
                                    <details open={isCliManagementOpen}>
                                        <summary ><Link className="active" href={routerInfoDic['core-component/command'].fullPath}>Command</Link></summary>
                                        <ul>
                                            <li><Link className={pathname === routerInfoDic['core-component/command/basic-concept'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/command/basic-concept'].fullPath}>Basic Concept</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/command/function'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/command/function'].fullPath}>Function</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/command/parser'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/command/parser'].fullPath}>Parser</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/command/object'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/command/object'].fullPath}>Object</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/command/parameter'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/command/parameter'].fullPath}>Parameter</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/command/terminal-interaction'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/command/terminal-interaction'].fullPath}>Terminal Interaction</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/command/tracing'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/command/tracing'].fullPath}>Tracing</Link></li>
                                        </ul>
                                    </details>
                                </li>
                                <li>
                                    <details open={isConfigurationOpen}>
                                        <summary ><Link className="active" href={routerInfoDic['core-component/configuration'].fullPath}>Configuration</Link></summary>
                                        <ul>
                                            <li><Link className={pathname === routerInfoDic['core-component/configuration/object'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/configuration/object'].fullPath}>Object</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/configuration/config-file'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/configuration/config-file'].fullPath}>Config File</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/configuration/function'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/configuration/function'].fullPath}>Function</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/configuration/interface-base'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/configuration/interface-base'].fullPath}>Interface-Base</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/configuration/adapter'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/configuration/adapter'].fullPath}>Adapter</Link></li>
                                        </ul>
                                    </details>
                                </li>
                                <li>
                                    <details open={isLogOpen}>
                                        <summary ><Link className="active" href={routerInfoDic['core-component/log'].fullPath}>Log</Link></summary>
                                        <ul>
                                            <li><Link className={pathname === routerInfoDic['core-component/log/config'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/log/config'].fullPath}>Configuration</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/log/level'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/log/level'].fullPath}>Level</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/log/path'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/log/path'].fullPath}>Path</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/log/chain-opts'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/log/chain-opts'].fullPath}>Chain Opts</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/log/color-print'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/log/color-print'].fullPath}>Color Print</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/log/context'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/log/context'].fullPath}>Context</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/log/handler'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/log/handler'].fullPath}>Handler</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/log/json-format'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/log/json-format'].fullPath}>JSON Format</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/log/async'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/log/async'].fullPath}>Async</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/log/stack-print'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/log/stack-print'].fullPath}>Stack Print</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/log/debug-info'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/log/debug-info'].fullPath}>Debug Info</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/log/writer'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/log/writer'].fullPath}>Writer</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/log/flags'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/log/flags'].fullPath}>Flags</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/log/rotate'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/log/rotate'].fullPath}>Rotate</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/log/faq'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/log/faq'].fullPath}>FAQ</Link></li>
                                        </ul>
                                    </details>
                                </li>
                                <li>
                                    <details open={isErrorOpen}>
                                        <summary ><Link className="active" href={routerInfoDic['core-component/error'].fullPath}>Error</Link></summary>
                                        <ul>
                                            <li><Link className={pathname === routerInfoDic['core-component/error/function'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/error/function'].fullPath}>Function</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/error/stack'].fullPath ? 'active' : ''} href="/docs/core-component/error/stack">Stack</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/error/compare'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/error/compare'].fullPath}>Compare</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/error/code'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/error/code'].fullPath}>Code</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/error/others'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/error/others'].fullPath}>Others</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/error/best-practices'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/error/best-practices'].fullPath}>Best Practices</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/error/benchmark'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/error/benchmark'].fullPath}>Benchmark</Link></li>
                                        </ul>
                                    </details>
                                </li>
                                <li>
                                    <details open={isDataValidOpen}>
                                        <summary><Link className="active" href={routerInfoDic['core-component/data-valid'].fullPath}>Data Validation</Link></summary>
                                        <ul>
                                            <li><Link className={pathname === routerInfoDic['core-component/data-valid/rule'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/data-valid/rule'].fullPath}>Rule</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/data-valid/object'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/data-valid/object'].fullPath}>Object</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/data-valid/result'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/data-valid/result'].fullPath}>Result</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/data-valid/types'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/data-valid/types'].fullPath}>Types</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/data-valid/optional'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/data-valid/optional'].fullPath}>Optional</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/data-valid/recursive'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/data-valid/recursive'].fullPath}>Recursive</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/data-valid/custom-rule'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/data-valid/custom-rule'].fullPath}>Custom Rule</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/data-valid/custom-error'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/data-valid/custom-error'].fullPath}>Custom Error</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/data-valid/method'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/data-valid/method'].fullPath}>Method</Link></li>
                                            <li><Link className={pathname === routerInfoDic['core-component/data-valid/faq'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/data-valid/faq'].fullPath}>FAQ</Link></li>
                                        </ul>
                                    </details>
                                </li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details open={isTypeConvertOpen}>
                            <summary ><Link className="active" href={routerInfoDic['core-component/type-convert'].fullPath}>Type Convert</Link></summary>
                            <ul>
                                <li><Link className={pathname === routerInfoDic['core-component/type-convert/basic-type'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/type-convert/basic-type'].fullPath}>Basic Type</Link></li>
                                <li><Link className={pathname === routerInfoDic['core-component/type-convert/map'].fullPath ? 'active' : ''} href={routerInfoDic['core-component/type-convert/map'].fullPath}>Map</Link></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details open={isFrameworkDesignOpen}>
                            <summary ><Link className="active" href={routerInfoDic['framework-design'].fullPath}>Framework Design</Link></summary>
                            <ul>
                                <li><Link className={pathname === routerInfoDic['framework-design/module-design'].fullPath ? 'active' : ''} href={routerInfoDic['framework-design/module-design'].fullPath}>Module Design</Link></li>
                                <li><Link className={pathname === routerInfoDic['framework-design/unified-framework-design'].fullPath ? 'active' : ''} href={routerInfoDic['framework-design/unified-framework-design'].fullPath}>Unified Framework Design</Link></li>
                                <li><Link className={pathname === routerInfoDic['framework-design/project-package-design'].fullPath ? 'active' : ''} href={routerInfoDic['framework-design/project-package-design'].fullPath}>Project Package Design</Link></li>
                                <li><Link className={pathname === routerInfoDic['framework-design/dao-design'].fullPath ? 'active' : ''} href={routerInfoDic['framework-design/dao-design'].fullPath}>DAO Design</Link></li>
                                <li><Link className={pathname === routerInfoDic['framework-design/constructure-design'].fullPath ? 'active' : ''} href={routerInfoDic['framework-design/constructure-design'].fullPath}>Constructure Design</Link></li>
                                <li><Link className={pathname === routerInfoDic['framework-design/data-bz-model'].fullPath ? 'active' : ''} href={routerInfoDic['framework-design/data-bz-model'].fullPath}>Data&BZ Model</Link></li>
                                <li><Link className={pathname === routerInfoDic['framework-design/microservice'].fullPath ? 'active' : ''} href={routerInfoDic['framework-design/microservice'].fullPath}>Microservice</Link></li>
                                <li><Link className={pathname === routerInfoDic['framework-design/tracing-design'].fullPath ? 'active' : ''} href={routerInfoDic['framework-design/tracing-design'].fullPath}>Tracing Design</Link></li>
                                <li><Link className={pathname === routerInfoDic['framework-design/error-design'].fullPath ? 'active' : ''} href={routerInfoDic['framework-design/error-design'].fullPath}>Error Design</Link></li>
                                <li><Link className={pathname === routerInfoDic['framework-design/interface-generic-design'].fullPath ? 'active' : ''} href={routerInfoDic['framework-design/interface-generic-design'].fullPath}>Interface&Generic</Link></li>
                                <li><Link className={pathname === routerInfoDic['framework-design/implict-explicit-init'].fullPath ? 'active' : ''} href={routerInfoDic['framework-design/implict-explicit-init'].fullPath}>Implict&Explicit Init</Link></li>
                                <li><Link className={pathname === routerInfoDic['framework-design/context-design'].fullPath ? 'active' : ''} href={routerInfoDic['framework-design/context-design'].fullPath}>Context Design</Link></li>
                                <li><Link className={pathname === routerInfoDic['framework-design/enum-management'].fullPath ? 'active' : ''} href={routerInfoDic['framework-design/enum-management'].fullPath}>Enum Management</Link></li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>
        </div>
    )
}