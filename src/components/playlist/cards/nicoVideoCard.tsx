import Link from "next/link";
import Image from "next/image";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Types
import { VideoAbout } from '@/types/db';
import nicoImg from "@/utils/niconico/nicoimg";
import { SiNiconico } from "react-icons/si";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

export default function niconicoVideoCard({ props , item , deleteLoading , deletePlaylist } : {props : {ytid:string , playlistId:string  } , item: VideoAbout , deleteLoading: Array<string> , deletePlaylist: (id: string) => void }) {
    return (
        <div
            className={`relative my-6 break-all sm:flex items-start gap-4 cursor-pointer rounded-lg shadow-md hover:bg-gray-100 transition-colors ${
            props.ytid === item.videoId ? 'border-2 border-sky-500' : ''
            }`}
        >
            <Link href={`/playlist/${props.playlistId}?v=${item.videoId}`} className="flex-none">
            <div className="relative place-content-center w-full">
                <Image
                src={nicoImg(item.videoContent.thumbnail)}
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
            <Link href={`/playlist/${props.playlistId}?v=${item.videoId}`}>
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
                        {
                            deleteLoading.includes(item.videoId) ? (
                                <Spinner variant="ring" />
                            ) : (
                                <Button onClick={() => deletePlaylist(item.videoId)}>履歴から削除</Button>
                            )
                        }
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}