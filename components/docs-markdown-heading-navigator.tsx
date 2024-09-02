`use client`


export type MarkdownHeading = {
    text: string;
    level: number;
    slug: string;
}

export function getMarkdownHeadings(md: string): MarkdownHeading[] {
    let result: MarkdownHeading[] = [];
    const headingRegex = /^(#{2,3})\s+(.*)$/gm;
    let match;
    while ((match = headingRegex.exec(md)) !== null) {
        const headingLevel = match[1].length;
        const headingText = match[2];
        if (headingText.includes("`")) {
            continue;
        }
        const slug = "#" + headingText.replace(/ /g, "-").toLocaleLowerCase();
        let markdownHeading: MarkdownHeading = {
            text: headingText,
            level: headingLevel,
            slug: slug
        }
        result.push(markdownHeading);
    }
    return result
}

export function MarkdownHeadingNavigator({ headings, className }: { headings: MarkdownHeading[], className?: string }) {
    return (
        <div className={`${className}`}>
            <div className={`flex flex-col gap-2 fixed top-16 ml-9 border-l border-gray-500 pb-2  max-h-[80vh] overflow-scroll`}>
                <div className="text-sm font-bold ml-4 mb-4">On this page</div>
                {headings.map((heading, index) => {
                    return (
                        <a
                            key={index}
                            href={heading.slug}
                            className={`text-sm font-medium ${heading.level === 2 ? 'ml-4' : 'ml-6'} hover:underline`}
                        >
                            {heading.text}
                        </a>
                    )
                })}
            </div>
        </div>
    )
}