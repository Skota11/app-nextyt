//types
import { SearchResult } from "@/types/search";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";

export default function YouTubeVideoCard({item}: {item:SearchResult}) {
    return (
        <div
            key={item.id?.videoId}
            className="relative my-6 break-all sm:flex items-start gap-4 cursor-pointer rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        >
            <Link href={`/play?v=${item.id?.videoId}`} className="flex-none">
            <div className="flex place-content-center w-full relative">
                <Image
                src={`https://i.ytimg.com/vi/${item.id?.videoId}/hqdefault.jpg`}
                alt=""
                width={120 * 2.5}
                height={67.5 * 2.5}
                className="inline sm:rounded-md rounded-t-lg aspect-video object-cover w-full sm:w-[300px]"
                unoptimized
                />
            </div>
            </Link>
            <div className="sm:inline">
            <Link href={`/play?v=${item.id?.videoId}`}>
                <div className="py-4 px-2 sm:px-0 flex flex-col gap-y-1">
                    <p className="">{item.snippet.title}</p>
                    <p className='text-slate-600 text-sm'>{item.snippet.channelTitle} ・ {dayjs(item.snippet.publishedAt).format('YYYY年MM月DD日')} </p>
                </div>
            </Link>
            </div>
        </div>
    )
}