import { DocsDrawer } from "@/components/docs-drawer";
import { DocsMarkdownViewer } from "@/components/docs-markdown-viewer";
import { DocsPreNextBtns } from "@/components/docs-pre-next-btns";
import { promises as fs } from "fs";

export default async function Page() {

    const installationMD = await fs.readFile(process.cwd() + "/docs/framework-design/context-design.md", "utf-8");

    return (
        <DocsDrawer>
            <div className="w-full pl-16 pr-16 mt-9">
                <DocsMarkdownViewer children={installationMD} />
                <DocsPreNextBtns preName="Interface&Generic" prePath="/docs/framework-design/implict-generic-init" nextName="Enum Management" nextPath="/docs/framework-design/enum-management" />
            </div>
        </DocsDrawer>
    )
}