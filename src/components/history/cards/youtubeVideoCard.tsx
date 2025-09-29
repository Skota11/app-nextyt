import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

//types
import { VideoAbout } from "@/types/db";

import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import AddPlaylist from "@/components/play/common/addPlaylist";

export default function VideoCard ({item , deleteHistory} : {item: VideoAbout , deleteHistory: (id: string) => Promise<void>}) {
    return (
        <div
            key={item.videoId}
            className="relative my-6 break-all sm:flex items-start gap-4 cursor-pointer rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        >
            <Link href={`/play?v=${item.videoId}`} className="flex-none">
            <div className="flex place-content-center w-full relative">
                <Image
                src={`https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`}
                alt=""
                width={120 * 2.5}
                height={67.5 * 2.5}
                className="inline sm:rounded-md rounded-t-lg aspect-video object-cover w-full sm:w-[300px]"
                unoptimized
                />
            </div>
            </Link>
            <div className="sm:inline">
            <Link href={`/play?v=${item.videoId}`}>
                <p className="py-4 px-2 sm:px-0">{item.videoContent.title}</p>
            </Link>
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <button className="absolute sm:top-auto top-2 sm:bottom-2 right-2 w-8 h-8 bg-gray-300 rounded-full flex place-content-center items-center hover:bg-gray-400">
                        <FontAwesomeIcon icon={faEllipsis} />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="border bg-white rounded-lg p-4 z-[120] shadow-lg" asChild>
                    <div className="flex flex-col gap-4">
                        <Button onClick={() => deleteHistory(item.videoId)}>履歴から削除</Button>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm">プレイリストに追加</p>
                            <AddPlaylist videoId={item.videoId} />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}