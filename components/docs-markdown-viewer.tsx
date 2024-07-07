'use client'

import Markdown from "react-markdown";
import CodeBlock from "./code-block";


export function DocsMarkdownViewer({ children }: { children: string }) {


    return (
        <Markdown
            className="lg:prose prose-base lg:max-w-3xl"
            children={children}
            components={{
                code(props) {
                    const { children, className } = props
                    const match = /language-(\w+)/.exec(className || '')
                    const codeSnippetString = String(children).replace(/\n$/, '')
                    return match ? (
                        <CodeBlock language={match[1]} code={codeSnippetString} />
                    ) : (
                        <code className={className}>
                            {children}
                        </code>
                    )
                }
            }}
        />
    )
}