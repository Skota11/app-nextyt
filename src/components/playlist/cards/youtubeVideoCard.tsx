import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

//types
import { VideoAbout } from "@/types/db";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function VideoCard({item, props, deleteLoading, deletePlaylist} : {props : {ytid:string , playlistId:string  } , item: VideoAbout , deleteLoading: Array<string> , deletePlaylist: (id: string) => void }) {
    return (
        <div
            className={`relative my-6 break-all sm:flex items-start gap-4 cursor-pointer rounded-lg shadow-md hover:bg-gray-100 transition-colors ${
            props.ytid === item.videoId ? 'border-2 border-sky-500' : ''
            }`}
        >
            <Link
            href={`/playlist/${props.playlistId}?v=${item.videoId}`}
            className="flex-none"
            >
            <div className="flex place-content-center w-full relative">
                <Image
                src={`https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`}
                alt=""
                width={120 * 2.5}
                height={67.5 * 2.5}
                className="inline sm:rounded-md rounded-t-lg aspect-video object-cover w-full sm:w-[300px]"
                unoptimized
                />
            </div>
            </Link>
            <div className="sm:inline">
            <Link href={`/playlist/${props.playlistId}?v=${item.videoId}`}>
                <div className="py-4 px-2 sm:px-0 flex flex-col gap-y-1">
                <p>{item.videoContent.title}</p>
                <p className="text-slate-600 text-sm">
                    {item.videoContent.channelTitle}
                </p>
                </div>
            </Link>
            </div>
            <div className="absolute sm:top-auto top-2 sm:bottom-2 right-2 bg-red-500 rounded-full w-8 h-8 place-content-center">
            {deleteLoading.includes(item.videoId) ? (
                <p className="flex place-content-center">
                <Spinner variant="ring" />
                </p>
            ) : (
                <p className="flex place-content-center">
                <button
                    title="動画を削除"
                    onClick={e => {
                    e.preventDefault();
                    deletePlaylist(item.videoId);
                    }}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
                </p>
            )}
            </div>
        </div>
    )
}