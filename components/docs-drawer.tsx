import { Menu } from "lucide-react";
import Link from "next/link";


export function DocsDrawer() {
    return (
        <div className="drawer lg:drawer-open z-50 sticky lg:fixed lg:top-16">
            <input id="docs-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Page content here */}
                <div className="w-full lg:hidden flex h-10 bg-base-200 mt-1">
                    <div className="flex justify-start items-center">
                        <label htmlFor="docs-drawer" className="btn btn-sm btn-ghost drawer-button flex justify-start items-center ml-4">
                            <Menu className="w-5 h-5" />
                            <span>Menu</span>
                        </label>
                    </div>
                </div>
                <div className="w-full">
                </div>
            </div>
            <div className="drawer-side z-50">
                <label htmlFor="docs-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li>
                        <details open>
                            <summary><Link href="/docs/quick-start">Quick Start</Link></summary>
                            <ul>
                                <li><Link href="/docs/quick-start/startup">Startup</Link></li>
                                <li><Link href="/docs/quick-start/configuration">Configuration</Link></li>
                                <li><Link href="/docs/quick-start/example">Example</Link></li>
                            </ul>
                        </details>
                    </li>
                    <li><a>Sidebar Item 2</a></li>
                </ul>
            </div>
        </div>
    )
}