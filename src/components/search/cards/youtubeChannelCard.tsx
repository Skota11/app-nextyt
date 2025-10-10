import Link from "next/link";
import Image from "next/image";

//types
import { SearchResult } from "@/types/search";

export default function YoutubeChannelCard({item} : {item:SearchResult}) {
    const omit = (str: string) => {
        if (str.length > 36) {
            return str.substring(0, 36) + '...';
        } else {
            return str
        }
    }
    return (
        <Link
            key={item.id?.channelId}
            className="my-6 break-all"
            href={`/channel/${item.id?.channelId}`}
        >
            <div className="flex gap-x-4 items-center mt-6">
                <Image
                    alt="channelImage"
                    src={item.snippet.thumbnails.medium.url}
                    width={80}
                    height={80}
                    unoptimized
                    className="rounded-full"
                />
                <div>
                    <h1 className="text-xl">{item?.snippet.title}</h1>
                    <p className="text-sm text-gray-400">{omit(item.snippet.description)}</p>
                </div>
            </div>
        </Link>
    )
}