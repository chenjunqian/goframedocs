import { DocsDrawer } from "@/components/docs-drawer";
import { DocsMarkdownViewer } from "@/components/docs-markdown-viewer";
import { DocsPreNextBtns } from "@/components/docs-pre-next-btns";
import { promises as fs } from "fs";

export default async function Page() {

    const installationMD = await fs.readFile(process.cwd() + "/docs/framework-design/interface-generic-design.md", "utf-8");

    return (
        <DocsDrawer>
            <div className="w-full pl-16 pr-16 mt-9">
                <DocsMarkdownViewer children={installationMD} />
                <DocsPreNextBtns preName="Error Design" prePath="/docs/framework-design/error-design" nextName="Implict&Explicit Init" nextPath="/docs/framework-design/Implict-explicit-design" />
            </div>
        </DocsDrawer>
    )
}