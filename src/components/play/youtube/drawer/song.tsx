import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import Image from "next/image"
import { SongInfo } from "@/types/videoAbout"

export default function SongSection({songInfo} : {songInfo:SongInfo}) {
    return (
        <>
                                        <div className="p-4 rounded-lg bg-gray-100 shadow-sm">
                                            <p className="text-sm mb-2">音楽</p>
                                            <div className="flex items-center gap-x-4">
                                                <Image alt="songThumbnail" src={songInfo.thumbnail} width={80} height={80} unoptimized className="rounded-md" />
                                                <div>
                                                    <p className="font-bold">{songInfo.title}</p>
                                                    <p className="text-sm">{songInfo.artist}</p>
                                                </div>
                                            </div>
                                            {songInfo.genius_url ?
                                            <div className="mt-2">
                                                    <a target="_blank" href={songInfo.genius_url} className="text-sm text-gray-800">Geniusで歌詞を見る <FontAwesomeIcon icon={faUpRightFromSquare} /></a>
                                            </div>: <></>}
                                        </div>
        </>
    )
}