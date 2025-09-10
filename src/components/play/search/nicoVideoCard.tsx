import Link from "next/link";
import Image from "next/image";
import { SiNiconico } from "react-icons/si";
import { SearchResult } from "@/types/search";

export default function niconicoVideoCard({ item } : {item:SearchResult}) {
    const omit = (str: string) => {
            if (str.length > 36) {
                return str.substring(0, 36) + '...';
            } else {
                return str
            }
        }
    return (
        <div
            key={item.id?.videoId}
            className="relative my-6 break-all sm:flex items-start gap-4 cursor-pointer rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        >
            <Link href={`/play?v=${item.contentId}`} className="flex-none">
            <div className="relative place-content-center w-full">
                <Image
                src={item.thumbnailUrl}
                alt=""
                width={120 * 2.5}
                height={67.5 * 2.5}
                className="inline sm:rounded-md rounded-t-lg aspect-video object-cover w-full sm:w-[300px]"
                unoptimized
                />
                <div className="absolute bottom-2 right-2 bg-white place-content-center p-1 rounded-sm">
                <p className="flex items-center text-sm">
                    <SiNiconico className="m-1" />
                    ニコニコ動画
                </p>
                </div>
            </div>
            </Link>
            <div className="sm:inline">
            <Link href={`/play?v=${item.id?.videoId}`}>
                <div className="py-4 px-2 sm:px-0 flex flex-col gap-y-1">
                    <p className="">{item.title}</p>
                    <p className="text-sm text-gray-400">{item.description && omit(item.description)}</p>
                </div>
            </Link>
            </div>
        </div>
    )
}