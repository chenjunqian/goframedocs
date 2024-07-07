'use client';

import { Clipboard, ClipboardCopy } from 'lucide-react';
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

function CodeBlock({ language, code }: { language: string, code: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div className="relative">
            <SyntaxHighlighter language={language} style={oneDark} children={code} />
            <button className="absolute top-0 right-0 px-2 py-1 btn btn-ghost btn-sm" onClick={handleCopy}>
                {
                    copied ? <ClipboardCopy className="w-5 h-5" /> : <Clipboard className="w-5 h-5" />
                }
            </button>
        </div>
    );
}

export default CodeBlock;