//types
import { SearchResult } from "@/types/search";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import AddPlaylist from "@/components/play/common/addPlaylist";
import { useAddQueue } from "@/hooks/queue/useAddQueue";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

export default function YouTubeVideoCard({item , isPlayerPage}: {item:SearchResult , isPlayerPage?: boolean}) {
    const addQueue = useAddQueue()
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
            <Popover>
                <PopoverTrigger asChild>
                    <button className="absolute sm:top-auto top-2 sm:bottom-2 right-2 w-8 h-8 bg-gray-300 rounded-full flex place-content-center items-center hover:bg-gray-400">
                        <FontAwesomeIcon icon={faEllipsis} />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="border bg-white rounded-lg p-4 z-[120] shadow-lg" asChild>
                    <div className="flex flex-col gap-4">
                        {isPlayerPage && (
                            <Button onClick={() => {
                                if(item.id?.videoId){addQueue(item.id.videoId)}
                            }}>次に再生</Button>
                        )}
                        <div className="flex flex-col gap-1">
                            <p className="text-sm">プレイリストに追加</p>
                            {item.id?.videoId && <AddPlaylist videoId={item.id.videoId} />}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            </div>
        </div>
    )
}