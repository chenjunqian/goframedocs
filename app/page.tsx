import { Button } from "@/components/ui/button"
import { Boxes, Component, Github, SquareArrowRight, Unplug } from "lucide-react";
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
                <div className="text-4xl md:w-1/2 w-full flex justify-center text-center">
                    Goframe Web Framework
                </div>
            </div>
            <div className="w-full flex justify-center mt-6">
                <div className="text-base text-center md:w-1/3 w-full flex justify-center">
                    Goframe is a modular, high-performance web framework and toolkit for Go that extends the standard library with a rich set of components
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

            <div className="w-full flex justify-center mt-36">
                <div className="columns-3 gap-8">
                    <div className="w-full">
                        <div className="flex justify-center text-2xl items-center">
                            <Boxes className="mr-4" /> Modular
                        </div>
                        <div className="text-base text-center">
                            Modular, loosely coupled design.
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex justify-center text-2xl items-center">
                            <Component className="mr-4" /> Rich Component
                        </div>
                        <div className="text-base text-center">
                            Rich components, ready-to-use out of the box.
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex justify-center text-2xl items-center">
                            <Unplug className="mr-4" /> Interface-based
                        </div>
                        <div className="text-base text-center">
                            Interface-oriented, highly extensible design.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
