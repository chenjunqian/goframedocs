import {promises as fs} from "fs";
import { DocsDrawer } from "../../components/docs-drawer";
import { DocsMarkdownViewer } from "../../components/docs-markdown-viewer";


export default async function Page() {

    const introductionMD = await fs.readFile(process.cwd() + "/docs/quick-start/introduction.md", "utf-8");

    return (
        <DocsDrawer>
            <div className="w-full pl-16 pr-16 mt-9">
                <div className="w-full flex justify-start">
                    <h1 className="lg:text-4xl text-lg font-bold">Introduction</h1>
                </div>
                <div className="w-full flex justify-start mt-4">
                    <div role="alert" className="alert lg:w-3/5 w-4/5 text-sm">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="stroke-info h-6 w-6 shrink-0">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>The document you are reading is for Goframe V2!</span>
                    </div>
                </div>
                <div className="flex w-full flex-col mt-6 mb-6">
                    <div className="divider"></div>
                </div>
                <DocsMarkdownViewer children={introductionMD} />
            </div>
        </DocsDrawer>
    )
}