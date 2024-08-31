'use client'

import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MarkdownHeading } from "@/components/docs-markdown-heading-navigator";
import { routerNodeTree } from "@/config/site";
import { DocsRouterNode } from "@/config/types";


export function DocsDrawer({ children, markdownHeadings }: Readonly<{ children: React.ReactNode, markdownHeadings?: MarkdownHeading[] }>) {

    const [isFixed, setIsFixed] = useState(false);
    const currentPath = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsFixed(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        const activeItem = document.querySelector(`a[href="${currentPath}"]`);
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currentPath]);

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
                                            <li key={heading.slug}><a className={`text-sm ${heading.level === 1 ? 'font-bold' : ''}  ${heading.level === 2 ? 'ml-4' : 'ml-6'} `} href={heading.slug}>{heading.text}</a></li>
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
                <ul className="menu bg-base-200 text-base-content min-h-full w-auto min-w-72 p-4">
                    {/* Sidebar content here */}
                    <div className="flex items-center mb-4">
                        <a className="btn btn-ghost text-xl" href="/">
                            <Image src="/gf-logo.png" alt="logo" width={32} height={32} />
                            Goframe
                        </a>
                    </div>
                    <DrawerItemList routerNodes={routerNodeTree} />
                </ul>
            </div>
        </div>
    )
}

function DrawerItemList({ routerNodes }: { routerNodes: DocsRouterNode[] }) {

    const pathname = usePathname();


    function iterateNodes(nodes: DocsRouterNode[]) {
        return nodes.map((node: DocsRouterNode) => {
            if (node.childrenNode && node.childrenNode.length > 0) {
                return (
                    <li key={node.fullPath}>
                        <details open={node.fullPath === pathname || pathname.startsWith(node.fullPath)}>
                            <summary><Link className={pathname.startsWith(node.fullPath) ? 'active' : ''} href={node.fullPath}>{node.name}</Link></summary>
                            <ul>
                                {iterateNodes(node.childrenNode)}
                            </ul>
                        </details>
                    </li>
                )
            } else {
                return (
                    <li key={node.fullPath}><Link className={pathname === node.fullPath ? 'active' : ''} href={node.fullPath}>{node.name}</Link></li>
                )
            }
        })
    }

    return (
        <>
            {iterateNodes(routerNodes)}
        </>
    )
}