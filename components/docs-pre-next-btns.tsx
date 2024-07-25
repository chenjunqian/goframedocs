import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";



export type DocsPreNextBtnsProps = {
    preName?: string;
    prePath?: string;
    nextName?: string;
    nextPath?: string;
}

export function DocsPreNextBtns({ preName, prePath, nextName, nextPath }: DocsPreNextBtnsProps) {


    return (
        <div className="w-full lg:max-w-3xl mb-6">
            <div className="divider mb-6" />
            <div className="w-full md:flex md:justify-center">
                <div className={`md:w-1/2 w-full flex md:justify-start justify-center ${!prePath ? 'invisible' : ''}`}>
                    <Link href={prePath ? prePath : "/"} className="btn flex">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <div className="text-left">
                            <div className="text-base-content/50 hidden text-xs font-normal md:block">prev</div>
                            <div className="text-base">{preName}</div>
                        </div>
                    </Link>
                </div>
                <div className={`md:w-1/2 w-full flex md:justify-end justify-center md:pt-0 pt-4 ${!nextPath ? 'invisible' : ''}`}>
                    <Link href={nextPath ? nextPath : "/"} className="btn btn-neutral flex">
                        <div className="text-right">
                            <div className="text-base-content/50 hidden text-xs font-normal md:block">next</div>
                            <div className="text-base">{nextName}</div>
                        </div>
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    )
}