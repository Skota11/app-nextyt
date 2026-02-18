import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { ChannelVideosList } from "@/types/channnel";

const decodeHtmlEntities = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

export default function YouTubeVideoCard({item}: {item: ChannelVideosList}) {
    const playHref = `/play?v=${item.snippet.resourceId.videoId}`;
    return (
        <div
            key={item.snippet.resourceId.videoId}
            className="relative my-6 break-all sm:flex items-start gap-4 cursor-pointer rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-popover transition-colors"
        >
            <Link href={playHref} className="flex-none">
            <div className="flex place-content-center w-full relative">
                <Image
                src={`https://i.ytimg.com/vi/${item.snippet.resourceId.videoId}/hqdefault.jpg`}
                alt=""
                width={120 * 3}
                height={67.5 * 3}
                className="inline sm:rounded-md rounded-t-lg aspect-video object-cover w-full sm:w-[360px]"
                unoptimized
                />
            </div>
            </Link>
            <div className="sm:inline">
            <Link href={playHref}>
                <div className="py-4 px-2 sm:px-0 flex flex-col gap-y-1">
                    <p className="">{decodeHtmlEntities(item.snippet.title)}</p>
                    <p className='text-slate-600 dark:text-slate-200 text-sm'>{item.snippet.channelTitle} ・ {dayjs(item.snippet.publishedAt).format('YYYY年MM月DD日')} </p>
                </div>
            </Link>
            </div>
        </div>
    )
}