import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

//types
import { VideoAbout } from "@/types/db";
import CircularProgress from "@mui/material/CircularProgress";

export default function VideoCard ({item , deleteLoading , deleteHistory} : {item: VideoAbout , deleteLoading: Array<string> , deleteHistory: (id: string) => Promise<void>}) {
    return (
        <div
            key={item.videoId}
            className="relative my-6 break-all sm:flex items-start gap-4 cursor-pointer rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        >
            <Link href={`/play?v=${item.videoId}`} className="flex-none">
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
            <Link href={`/play?v=${item.videoId}`}>
                <p className="py-4 px-2 sm:px-0">{item.videoContent.title}</p>
            </Link>
            </div>
            <div className="absolute sm:top-auto top-2 sm:bottom-2 right-2 bg-red-500 rounded-full w-8 h-8 place-content-center">
            {deleteLoading.includes(item.videoId) ? (
                <p className="flex place-content-center">
                <CircularProgress color="primary" size={20} />
                </p>
            ) : (
                <p className="flex place-content-center">
                <button
                    title="動画を削除"
                    onClick={e => {
                    e.preventDefault();
                    deleteHistory(item.videoId);
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