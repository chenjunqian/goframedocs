import { DocsDrawer } from "@/components/docs-drawer";
import { DocsMarkdownViewer } from "@/components/docs-markdown-viewer";
import { DocsPreNextBtns } from "@/components/docs-pre-next-btns";
import { promises as fs } from "fs";

export default async function Page() {

    const installationMD = await fs.readFile(process.cwd() + "/docs/core-component/cli-management/function.md", "utf-8");

    return (
        <DocsDrawer>
            <div className="w-full pl-16 pr-16 mt-9">
                <DocsMarkdownViewer children={installationMD} />
                <DocsPreNextBtns preName="Basic Concept" prePath="/docs/core-component/cli-management/basic-concept" nextName="CLI | Parser" nextPath="/docs/core-component/cli-management/parser" />
            </div>
        </DocsDrawer>
    )
}