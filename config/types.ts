
export type DocsRouterInfo = {
    name?: string
    fullPath: string
    markdownPath?: string
    PreBtnName?: string
    PreBtnPath?: string
    NextBtnName?: string
    NextBtnPath?: string
}

export type DocsRouterInfoDict = {
    [key: string]: DocsRouterInfo
}

export type DocsRouterNode = {
    name: string
    fullPath: string
    markdownPath?: string
    PreBtnName?: string
    PreBtnPath?: string
    NextBtnName?: string
    NextBtnPath?: string
    childrenNode?: DocsRouterNode[]
}
