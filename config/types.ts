
export type DocsRouterInfo = {
    name?: string
    fullPath: string
    markdownPath?: string
    preBtnName?: string
    preBtnPath?: string
    nextBtnName?: string
    nextBtnPath?: string
}

export type DocsRouterInfoDict = {
    [key: string]: DocsRouterInfo
}

export type DocsRouterNode = {
    name: string
    fullPath: string
    markdownPath?: string
    preBtnName?: string
    preBtnPath?: string
    nextBtnName?: string
    nextBtnPath?: string
    childrenNode?: DocsRouterNode[]
}
