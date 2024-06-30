import { Button } from "@/components/ui/button"
import { Github, SquareArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen w-full">
            <div className="w-full flex justify-center mt-20">
                <div className="text-4xl w-1/2 flex justify-center">
                    Goframe Web Framework
                </div>
            </div>
            <div className="w-full flex justify-center mt-6">
                <div className="text-base text-center w-1/3 flex justify-center">
                    GoFrame is a modular, high-performance web framework and toolkit for Go that extends the standard library with a rich set of components
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
        </div>
    );
}
