//react
//supabase
//font
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";

interface playlist { playlistId: string, playlistName: string }

export default function Main() {
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
    }
    useEffect(() => {
        getPlaylists()
    }, [])
    return (
        <div className='mt-2'>
            <h1 className='text-lg my-4'><FontAwesomeIcon icon={faList} className='mr-2' />Playlist <button onClick={newPlaylist}> <FontAwesomeIcon icon={faPlus} className="mr-1 text-sm" /><span className="text-sm">新しく作成</span></button></h1>
            <div className="mx-4">
                {
                    result == undefined ?
                        <><CircularProgress color="error" size={40} /></>
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