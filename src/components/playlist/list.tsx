// React
import { useEffect, useRef, useState } from 'react';

// Next.js
import { useRouter } from "next/navigation";

// Font Awesome Icons
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// React Icons
import { LuArrowDownUp } from "react-icons/lu";

// Material UI

// Third Party Libraries
import nicoCheck from '@/utils/niconico/nicoid';
import NicoVideoCard from './cards/nicoVideoCard';

// Types
import { VideoAbout } from '@/types/db';
import VideoCard from './cards/youtubeVideoCard';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function Main(props: { playlistId: string, ytid: string, setNextYtid: (ytid: string) => void, setAutoPlay: (autoPlay: boolean) => void }) {
    const router = useRouter();
    const [deleteLoading, setDeleteLoading] = useState<Array<string>>([])
    const [result, setResult] = useState<Array<VideoAbout> | undefined>(undefined)
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
        await fetch(`/api/database/playlist/${props.playlistId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: 'full' }),
        })
        router.push(`/`);
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

    const handleAutoPlayChange = (e:boolean) => {
        setAutoPlay(e);
        props.setAutoPlay(e);
    };
    return (
        <>
            <div className="p-4 max-w-screen-xl m-auto">
                <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1.5' value={name} onChange={onInputChange} ref={inputRef} />
                <div className=' my-4 flex gap-x-4 items-center'>
                    <div className='flex gap-x-2 items-center'>
                        <Switch
                                id='autoPlay'
                                checked={autoPlay}
                                onCheckedChange={handleAutoPlayChange}
                        />
                        <Label htmlFor='autoPlay'>連続再生</Label>
                    </div>
                    <button onClick={listReverse}><LuArrowDownUp /></button>
                    <button onClick={() => { inputRef.current?.focus() }}><FontAwesomeIcon icon={faPencil} /></button>
                    <AlertDialog >
                        <AlertDialogTrigger asChild>
                            <button><FontAwesomeIcon className='text-red-700' icon={faTrash} /></button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                                <AlertDialogDescription>
                                    このプレイリストを削除します。
                                    削除したプレイリストは復元できません。
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                <AlertDialogAction onClick={listDelete}>続行</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className='mx-4'>
                    {
                        result == undefined ?
                            <>
                                <div className='flex place-content-center'>
                                    <Spinner variant='ring' />
                                </div>
                            </>
                            :
                            result.length == 0 ? <><p>取得できません</p></> : result.map((item: VideoAbout) => {
                                return (
                                    <div key={item.videoId}>
                                        {nicoCheck(item.videoId) ? (
                                            <NicoVideoCard props={props} item={item} deleteLoading={deleteLoading} deletePlaylist={deletePlaylist} />
                                        ) : (
                                            <VideoCard props={props} item={item} deleteLoading={deleteLoading} deletePlaylist={deletePlaylist} />
                                        )}
                                    </div>
                                )
                            })
                    }
                </div>
            </div>
        </>
    )
}