import { DocsDrawer } from "@/components/docs-drawer";
import { getMarkdownHeadings, MarkdownHeadingNavigator } from "@/components/docs-markdown-heading-navigator";
import { DocsMarkdownViewer } from "@/components/docs-markdown-viewer";
import { DocsPreNextBtns } from "@/components/docs-pre-next-btns";
import { routerInfoDic } from "@/config/site";
import { promises as fs } from "fs";


export default async function Page({ params }: { params: { slug: string[] } }) {

    const slugs = params.slug;
    const path = slugs.join("/");

    const routerInfo = routerInfoDic[path];

    const introductionMD = await fs.readFile(process.cwd() + routerInfo.markdownPath, "utf-8");

    const markdownHeadings = getMarkdownHeadings(introductionMD);
    console.log(markdownHeadings);

    return (
        <DocsDrawer markdownHeadings={markdownHeadings}>
            <div className="w-full pl-16 pr-16 mt-9">
                <div className="w-full flex justify-start">
                    <DocsMarkdownViewer>{introductionMD}</DocsMarkdownViewer>
                    <MarkdownHeadingNavigator headings={markdownHeadings} className="hidden xl:block" />
                </div>
                <DocsPreNextBtns preName={routerInfo.PreBtnName} prePath={routerInfo.PreBtnPath} nextName={routerInfo.NextBtnName} nextPath={routerInfo.NextBtnPath} />
            </div>
        </DocsDrawer>
    )
}