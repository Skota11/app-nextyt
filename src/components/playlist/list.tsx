// React
import { useEffect, useRef, useState } from 'react';

// Next.js
import Image from 'next/image'
import Link from "next/link";
import { useRouter } from "next/navigation";

// Font Awesome Icons
import { faCirclePlay, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// React Icons
import { LuArrowDownUp } from "react-icons/lu";

// Material UI
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

// Third Party Libraries
import Swal from 'sweetalert2'

interface playlist { videoId: string, videoContent: { title: string, channelTitle: string } }

export default function Main(props: { playlistId: string, ytid: string, setNextYtid: (ytid: string) => void, setAutoPlay: (autoPlay: boolean) => void }) {
    const router = useRouter();
    const [deleteLoading, setDeleteLoading] = useState<Array<string>>([])
    const [result, setResult] = useState<Array<playlist> | undefined>(undefined)
    const [name, setName] = useState("")
    const [autoPlay, setAutoPlay] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
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
    const listReverse = () => {
        if (result) {
            const prev = [...result]
            prev.reverse()
            setResult(prev)
        }
    }
    const listDelete = async () => {
        Swal.fire({
            title: `プレイリストを削除しますか？`,
            showDenyButton: true,
            confirmButtonText: "削除",
            denyButtonText: `やめる`
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                await fetch(`/api/database/playlist/${props.playlistId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: 'full' }),
                })
                router.push(`/`);
            } else if (result.isDenied) {

            }
        });
    }
    useEffect(() => {
        getPlaylistName()
        getPlaylist()
    }, [])
    useEffect(() => {
        if (result && props.ytid) {
            const index = result?.findIndex(item => item.videoId === props.ytid)
            if (index !== undefined && index !== -1 && index < result.length - 1) {
                props.setNextYtid(result[index + 1].videoId)
            } else {
                props.setNextYtid("")
            }
        }
    }, [props.ytid])

    const handleAutoPlayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setAutoPlay(checked);
        props.setAutoPlay(checked);
    };

    return (
        <>
            <div className="p-4 max-w-screen-xl m-auto">
                <FontAwesomeIcon icon={faCirclePlay} />  <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={name} onChange={onInputChange} ref={inputRef} />
                <div className='my-4 flex gap-x-4 items-center'>
                    <button onClick={listReverse}><LuArrowDownUp /></button>
                    <button onClick={() => { inputRef.current?.focus() }}><FontAwesomeIcon icon={faPencil} /></button>
                    <button onClick={listDelete}><FontAwesomeIcon className='text-red-700' icon={faTrash} /></button>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={autoPlay}
                                onChange={handleAutoPlayChange}
                                color="primary"
                            />
                        }
                        label="AutoPlay"
                    />
                </div>
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
                                    <Link href={`/playlist/${props.playlistId}?v=${item.videoId}`} className='flex-none'>
                                        <div className="flex place-content-center">
                                            <Image src={`https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`} alt="" width={120 * 2.5} height={67.5 * 2.5} className='inline rounded-md' unoptimized />
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