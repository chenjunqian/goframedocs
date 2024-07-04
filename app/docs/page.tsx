import CodeBlock from "../../components/code-block";
import { DocsDrawer } from "../../components/docs-drawer";



export default function Page() {
    return (
        <DocsDrawer>

            <div className="w-full pl-16 pr-16 mt-9">
                <div className="w-full flex justify-start">
                    <h1 className="text-3xl font-bold">Introduction</h1>
                </div>
                <div className="w-full flex justify-start mt-4">
                    <div role="alert" className="alert lg:w-3/5 w-4/5">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="stroke-info h-6 w-6 shrink-0">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>The document you are reading is for Goframe V2!</span>
                    </div>
                </div>
                <div className="flex w-full flex-col mt-6 mb-6">
                    <div className="divider"></div>
                </div>

                <div className="w-full flex justify-start">
                    <h1 className="text-3xl font-bold">What is Goframe?</h1>
                </div>
                <div className="flex justify-start mt-4 lg:w-3/5 w-4/5">
                    <div>
                        <p className="indent-8">
                            Goframe is a modular, high-performance, enterprise-level Go development framework.
                            It is a versatile foundational framework that serves as an enhanced extension of the Golang standard library, including a set of universal core development components.
                            Goframe can be used for developing complete engineering projects, and due to its decoupled modular design, it can also be utilized as a toolkit.
                        </p>
                        <p className="indent-8 mt-4">
                            If you are looking to develop a enterprise-level project or small project with Golang, Goframe is your best choice. If you aim to create a Golang component library, Goframe's ready-to-use, robust foundational component library can also greatly enhance your workflow and make your work more efficient.
                        </p>
                    </div>
                </div>
                <div className="flex justify-start mt-4 lg:w-3/5 w-4/5">
                    <div className="w-full">
                        <p>Here is a minimal example:</p>
                        <CodeBlock language="go" code={`
package main

import (
    _ "github.com/gogf/gf/contrib/drivers/mysql/v2"
    _ "github.com/gogf/gf-demo-user/v2/internal/logic"
    "github.com/gogf/gf/v2/os/gctx"
    "github.com/gogf/gf-demo-user/v2/internal/cmd"
)

func main() {
    cmd.Main.Run(gctx.New())
}
                        `} />
                    </div>
                </div>
            </div>
        </DocsDrawer>
    )
}