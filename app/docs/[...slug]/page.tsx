import { DocsDrawer } from "@/components/docs-drawer";
import { getMarkdownHeadings, MarkdownHeadingNavigator } from "@/components/docs-markdown-heading-navigator";
import { DocsMarkdownViewer } from "@/components/docs-markdown-viewer";
import { DocsPreNextBtns } from "@/components/docs-pre-next-btns";
import { routerNodeTree } from "@/config/site";
import { DocsRouterNode } from "@/config/types";
import { promises as fs } from "fs";


export default async function Page({ params }: { params: { slug: string[] } }) {

    const slugs = params.slug;
    const path = "/docs/" + slugs.join("/");

    function findRouterNodeByPath(path: string, routerNode: DocsRouterNode[]): DocsRouterNode | undefined {
        for (const node of routerNode) {
            if (node.fullPath === path) {
                return node;
            }

            if (node.childrenNode) {
                const foundNode = findRouterNodeByPath(path, node.childrenNode);
                if (foundNode) {
                    return foundNode;
                }
            }
        }
    }

    const routerInfo = findRouterNodeByPath(path, routerNodeTree);

    const introductionMD = await fs.readFile(process.cwd() + routerInfo?.markdownPath, "utf-8");

    const markdownHeadings = getMarkdownHeadings(introductionMD);
    console.log(markdownHeadings);

    return (
        <DocsDrawer markdownHeadings={markdownHeadings}>
            <div className="w-full pl-16 pr-16 mt-9">
                <div className="w-full flex justify-start">
                    <DocsMarkdownViewer>{introductionMD}</DocsMarkdownViewer>
                    <MarkdownHeadingNavigator headings={markdownHeadings} className="hidden xl:block" />
                </div>
                <DocsPreNextBtns preName={routerInfo?.PreBtnName} prePath={routerInfo?.PreBtnPath} nextName={routerInfo?.NextBtnName} nextPath={routerInfo?.NextBtnPath} />
            </div>
        </DocsDrawer>
    )
}