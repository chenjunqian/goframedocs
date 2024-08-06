import { DocsDrawer } from "@/components/docs-drawer";
import { DocsMarkdownViewer } from "@/components/docs-markdown-viewer";
import { DocsPreNextBtns } from "@/components/docs-pre-next-btns";
import { promises as fs } from "fs";

export default async function Page() {

    const installationMD = await fs.readFile(process.cwd() + "/docs/core-component/error/compare.md", "utf-8");

    return (
        <DocsDrawer>
            <div className="w-full pl-16 pr-16 mt-9">
                <DocsMarkdownViewer children={installationMD} />
                <DocsPreNextBtns preName="Error | Stack" prePath="/docs/core-component/error/stack" nextName="Error | Code" nextPath="/docs/core-component/error/code" />
            </div>
        </DocsDrawer>
    )
}