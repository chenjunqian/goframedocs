import { DocsDrawer } from "@/components/docs-drawer";
import { DocsMarkdownViewer } from "@/components/docs-markdown-viewer";
import { DocsPreNextBtns } from "@/components/docs-pre-next-btns";
import { routerInfoDic } from "@/config/site";
import { promises as fs } from "fs";


export default async function Page({params}: {params: {slug: string[]}}) {

    const slugs = params.slug;
    const path = slugs.join("/");

    const routerInfo = routerInfoDic[path];

    const introductionMD = await fs.readFile(process.cwd() + routerInfo.markdownPath, "utf-8");

    return (
        <DocsDrawer>
            <div className="w-full pl-16 pr-16 mt-9">
                <DocsMarkdownViewer>{introductionMD}</DocsMarkdownViewer>
                <DocsPreNextBtns preName={routerInfo.PreBtnName} prePath={routerInfo.PreBtnPath} nextName={routerInfo.NextBtnName} nextPath={routerInfo.NextBtnPath} />
            </div>
        </DocsDrawer>
    )
}