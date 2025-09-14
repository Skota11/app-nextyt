import Image from "next/image";

//Types
import { VideoAbout } from "@/types/db";
import nicoImg from "@/utils/niconico/nicoimg";
import Link from "next/link";
import { SiNiconico } from "react-icons/si";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import CircularProgress from "@mui/material/CircularProgress";

export default function NicoVideoCard({item , deleteLoading , deleteHistory} : {item: VideoAbout, deleteLoading: string[], deleteHistory: (id: string) => void}) {
    return (
        <div
            key={item.videoId}
            className="relative my-6 break-all sm:flex items-start gap-4 cursor-pointer rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        >
            <Link href={`/play?v=${item.videoId}`} className="flex-none">
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
            <Link href={`/play?v=${item.videoId}`}>
                <p className="py-4 px-2 sm:px-0">{item.videoContent.title}</p>
            </Link>
            </div>
            <div className="absolute sm:top-auto top-2 sm:bottom-2 right-2 bg-red-500 rounded-full w-8 h-8 place-content-center">
            {deleteLoading.includes(item.videoId) ? (
                <CircularProgress color="primary" size={20} />
            ) : (
                <p className="flex place-content-center">
                <button
                    title="動画を削除"
                    onClick={(e) => {
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