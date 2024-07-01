import { Button } from "@/components/ui/button"
import { BicepsFlexed, Bird, BookOpenText, Boxes, BugOff, Code, Component, DatabaseZap, FileTerminal, Github, ListCollapse, MessageSquareCode, Rocket, SquareArrowRight, Telescope, Unplug } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen w-full">
            <div className="w-full flex justify-center mt-20">
                <div className="text-4xl md:w-1/2 w-full flex justify-center">
                    <Image src={"/gf-logo.png"} alt={"logo"} width={256} height={256} />
                </div>
            </div>
            <div className="w-full flex justify-center mt-20">
                <div className="md:text-4xl text-2xl font-bold md:w-1/2 w-full flex justify-center text-center">
                    Goframe Web Framework
                </div>
            </div>
            <div className="w-full flex justify-center mt-6">
                <div className="text-base text-center md:w-1/3 w-full flex justify-center p-4">
                    Goframe s a modular, powerful, high-performance and enterprise-class application development framework of Golang.
                </div>
            </div>
            <div className="w-full flex justify-center mt-4">
                <Link href="/docs">
                    <Button className="text-xl">
                        Get Started <SquareArrowRight className="ml-2" />
                    </Button>
                </Link>
                <Link href="https://github.com/gogf/gf" target="_blank">
                    <Button className="text-xl ml-4">
                        Github <Github className="ml-2" />
                    </Button>
                </Link>
            </div>

            <div className="w-full flex justify-center mt-20">
                <div className="md:text-4xl text-2xl font-bold md:w-1/2 w-full flex justify-center text-center">
                    What is it?
                </div>
            </div>
            <div className="w-full flex justify-center md:text-2xl text-sm md:p-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full min-h-8 mt-4">
                        <div className="flex justify-start items-center">
                            <Boxes className="mr-4" /> Modular, loosely coupled design
                        </div>
                    </div>
                    <div className="w-full min-h-8 mt-4">
                        <div className="flex justify-start items-center">
                            <Component className="mr-4" /> Rich components, out-of-the-box
                        </div>
                    </div>
                    <div className="w-full min-h-8 mt-4">
                        <div className="flex justify-start items-center">
                            <Code className="mr-4" /> Codegen for efficiency
                        </div>
                    </div>
                    <div className="w-full min-h-8 mt-4">
                        <div className="flex justify-start items-center">
                            <Bird className="mr-4" /> Simple and easy to use
                        </div>
                    </div>
                    <div className="w-full min-h-8 mt-4">
                        <div className="flex justify-start items-center">
                            <Unplug className="mr-4" /> Interface designed components, high scalability
                        </div>
                    </div>
                    <div className="w-full min-h-8 mt-4">
                        <div className="flex justify-start items-center">
                            <BugOff className="mr-4" /> Fully supported tracing and error stack feature
                        </div>
                    </div>
                    <div className="w-full min-h-8 mt-4">
                        <div className="flex justify-start items-center">
                            <DatabaseZap className="mr-4" /> Specially developed and powerful ORM component
                        </div>
                    </div>
                    <div className="w-full min-h-8 mt-4">
                        <div className="flex justify-start items-center">
                            <BicepsFlexed className="mr-4" /> Robust engineering design specifications
                        </div>
                    </div>
                    <div className="w-full min-h-8 mt-4">
                        <div className="flex justify-start items-center">
                            <FileTerminal className="mr-4" /> Convenient development CLI tool provide
                        </div>
                    </div>
                    <div className="w-full min-h-8 mt-4">
                        <div className="flex justify-start items-center">
                            <Telescope className="mr-4" /> OpenTelemetry observability features support
                        </div>
                    </div>
                    <div className="w-full min-h-8 mt-4">
                        <div className="flex justify-start items-center">
                            <BookOpenText className="mr-4" /> OpenAPIV3 documentation generating, automatically
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center mt-4">
                <Link href="/docs">
                    <Button className="text-xl">
                        <ListCollapse className="mr-4" /> Explore more now !
                    </Button>
                </Link>
            </div>
        </div>
    );
}
