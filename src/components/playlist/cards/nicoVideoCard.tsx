import Link from "next/link";
import Image from "next/image";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@mui/material/CircularProgress';

// Types
import { Playlist } from '@/types/playlist';
import nicoImg from "@/utils/niconico/nicoimg";
import { SiNiconico } from "react-icons/si";

export default function niconicoVideoCard({ props , item , deleteLoading , deletePlaylist } : {props : {ytid:string , playlistId:string  } , item: Playlist , deleteLoading: Array<string> , deletePlaylist: (id: string) => void }) {
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
            <div className="absolute sm:top-auto top-2 sm:bottom-2 right-2 bg-red-500 rounded-full w-8 h-8 place-content-center">
            {deleteLoading.includes(item.videoId) ? (
                <CircularProgress color="primary" size={20} />
            ) : (
                <p className="flex place-content-center">
                <button
                    title="動画を削除"
                    onClick={e => {
                    e.preventDefault();
                    deletePlaylist(item.videoId);
                    }}
                >
                    <FontAwesomeIcon icon={faTrash} className="" />
                </button>
                </p>
            )}
            </div>
        </div>
    )
}