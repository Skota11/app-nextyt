//react
//supabase
//font
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Skeleton from "@mui/material/Skeleton";

interface playlist { playlistId: string, playlistName: string }

export default function Main() {
    const router = useRouter()
    const [result, setResult] = useState<Array<playlist> | undefined>(undefined)
    const getPlaylists = async () => {
        const { data } = await (await fetch('/api/database/playlist')).json()
        setResult(data)
    }
    const newPlaylist = async () => {
        const res = await (await fetch('/api/database/playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}),
        })).json()
        console.log(res.id)
        router.push(`/playlist/${res.id}`)
    }
    useEffect(() => {
        getPlaylists()
    }, [])
    return (
        <div className='mt-2'>
            <h1 className='text-lg my-4'><FontAwesomeIcon icon={faList} className='mr-2' />Playlist <button title="新しいプレイリストを作成" onClick={newPlaylist}> <FontAwesomeIcon icon={faPlus} className="mr-1 text-sm" /><span className="text-sm">新しく作成</span></button></h1>
            <div className="mx-4">
                {
                    result == undefined ?
                        <>
                            <div className="grid grid-rows-1 gap-y-4">
                                <Skeleton variant="rounded" width={210} height={20} animation="wave" />
                                <Skeleton variant="rounded" width={210} height={20} animation="wave" />
                            </div>
                        </>
                        :
                        result.length == 0 ? <><p>Playlistはありません</p></> : result.map((item: playlist) => {
                            return (
                                <Link key={item.playlistId} className='block my-2 break-all sm:flex items-start gap-4 cursor-pointer' href={`/playlist/${item.playlistId}`}>
                                    <p>{item.playlistName}</p>
                                </Link>
                            )
                        })
                }
            </div>
        </div>)
}