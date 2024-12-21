import { faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image'
import Link from "next/link";
import { useEffect, useState } from 'react';

interface playlist { videoId: string, videoContent: { title: string, channelTitle: string } }

export default function Main(props: { playlistId: string }) {
    const [deleteLoading, setDeleteLoading] = useState<Array<string>>([])
    const [result, setResult] = useState<Array<playlist> | undefined>(undefined)
    const [name, setName] = useState("")
    const deletePlaylist = async (id: string) => {
        let array = [...deleteLoading]
        array.push(id)
        setDeleteLoading(array)
        await fetch(`/api/database/playlist/${props.playlistId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id }),
        })
        await getPlaylist()
        array = [...deleteLoading]
        array.splice(array.indexOf(id), array.indexOf(id))
        setDeleteLoading(array)
    }
    const getPlaylist = async () => {
        const { data } = await (await fetch(`/api/database/playlist/${props.playlistId}`)).json()
        setResult(data)
    }
    const getPlaylistName = async () => {
        const { data } = await (await fetch(`/api/database/playlist?id=${props.playlistId}`)).json()
        setName(data[0].playlistName)
    }
    const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        await fetch(`/api/database/playlist/${props.playlistId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: e.target.value }),
        })
    }
    useEffect(() => {
        getPlaylistName()
        getPlaylist()

    }, [])
    return (
        <>
            <div className="px-4 max-w-screen-xl m-auto">
                <FontAwesomeIcon icon={faPlay} /> <input className='text-lg' value={name} onChange={onInputChange} />
                <p className='text-sm my-2'>名前の更新はプレイリスト名をクリック</p>
                {
                    result == undefined ?
                        <>
                            <div className='flex place-content-center'>
                                <CircularProgress color="error" size={40} />
                            </div>
                        </>
                        :
                        result.length == 0 ? <><p>取得できません</p></> : result.map((item: playlist) => {
                            return (
                                <div key={item.videoId} className='block my-2 break-all sm:flex items-start gap-4 cursor-pointer'>
                                    <Link href={`/playlist/${props.playlistId}?v=${item.videoId}`}>
                                        <div className="flex place-content-center">
                                            <Image src={`https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`} alt="" width={120 * 2.5} height={67.5 * 2.5} className='inline rounded-md' />
                                        </div>
                                    </Link>
                                    <div className='inline'>
                                        <Link href={`/playlist/${props.playlistId}?v=${item.videoId}`}>
                                            <p>{item.videoContent.title} </p>
                                            <p className='text-slate-600 text-sm'>{item.videoContent.channelTitle} </p>
                                        </Link>
                                        <div>
                                            {deleteLoading.includes(item.videoId) ? <>
                                                <CircularProgress color="error" size={20} />
                                            </> : <>
                                                <button onClick={() => { deletePlaylist(item.videoId) }}><FontAwesomeIcon icon={faTrash} /></button>
                                            </>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                }
            </div>
        </>
    )
}