'use client'

import Markdown from "react-markdown";
import CodeBlock from "./code-block";
import Link from "next/link";


export function DocsMarkdownViewer({ children }: { children: string }) {


    return (
        <Markdown
            className="lg:prose prose-base lg:max-w-3xl overflow-x-hidden"
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
                },
                h1(props) {
                    const children = props.children
                    return <Heading level={1}>{children}</Heading>
                },
                h2(props) {
                    const children = props.children
                    return <Heading level={2}>{children}</Heading>
                },
                h3(props) {
                    const children = props.children
                    return <Heading level={3}>{children}</Heading>
                },
            }}
        >{children}</Markdown>
    )
}

type HeadingResolverProps = {
    level: number;
};

const Heading = ({ level, children }: { level: number, children: React.ReactNode }) => {
    // Access actual (string) value of heading
    const heading = children?.valueOf();

    // If we have a heading, make it lower case
    let anchor = typeof heading === 'string' ? heading.toLowerCase() : '';

    // Clean anchor (replace special characters whitespaces).
    // Alternatively, use encodeURIComponent() if you don't care about
    // pretty anchor links
    anchor = anchor.replace(/[^a-zA-Z0-9 ]/g, '');
    anchor = anchor.replace(/ /g, '-');

    // Utility
    const container = (children: React.ReactNode) => {
        return (
            <Link id={anchor} href={`#${anchor}`} style={{textDecoration: 'none'}} scroll={false}>
                <span>{children}</span>
            </Link>
        )
    }

    switch (level) {
        case 1:
            return <h1>{container(children)}</h1>;
        case 2:
            return <h2>{container(children)}</h2>;
        case 3:
            return <h3>{container(children)}</h3>;

        default:
            return <h6>{container(children)}</h6>;
    }
}