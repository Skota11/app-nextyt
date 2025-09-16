// React
import { useEffect, useState } from "react"

// Material UI

// Toast Notifications
import toast, { Toaster } from 'react-hot-toast';

import {Button} from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface playlist { playlistId: string, playlistName: string }

export default function Main(props: { videoId: string }) {
    const [result, setResult] = useState<Array<playlist> | undefined>(undefined)
    const [selectId, setSelectId] = useState("")
    const getPlaylists = async () => {
        const { data } = await (await fetch('/api/database/playlist')).json()
        setResult(data)
    }
    const addClickHandler = async () => {
        const res = await fetch(`/api/database/playlist/${selectId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: props.videoId }),
        })
        if (res.ok) {
            toast.success("追加しました")
        } else {
            toast.error("すでに追加されています")
        }
    }
    useEffect(() => {
        getPlaylists()
    }, [])
    return (
        <>
            <div className="flex items-center gap-x-4">
                    <Select
                        value={selectId}
                        onValueChange={(e) => { setSelectId(e) }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="プレイリストを選択" />
                        </SelectTrigger>
                        <SelectContent>
                            {result?.map((item) => {
                                return (<SelectItem value={item.playlistId} key={item.playlistId}>
                                    {item.playlistName}
                                </SelectItem>)
                            })}
                        </SelectContent>
                    </Select>
                <Button variant="outline" onClick={addClickHandler}>追加</Button>
                <Toaster position="bottom-center" />
            </div>
        </>
    )
}