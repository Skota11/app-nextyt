// React
import { useEffect, useState } from "react"
// Toast Notifications
import toast from 'react-hot-toast';

import {Button} from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface playlist { playlistId: string, playlistName: string }

export default function Main(props: { videoId: string }) {
    const [isOpen , setIsOpen] = useState(false)
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
        <div className="p-4 rounded-lg bg-gray-100 dark:bg-popover shadow-sm">
            <div className="flex items-center cursor-pointer" onClick={() => setIsOpen((prev) => { return !prev})}>
                <p className="text-sm">プレイリストに追加</p>
                {isOpen ? (
                    <FontAwesomeIcon icon={faChevronDown} className="ml-2 rotate-180 duration-200" />
                ) : (
                    <FontAwesomeIcon icon={faChevronDown} className="ml-2 duration-200" />
                )}
            </div>
            {isOpen && (
                <div className="flex items-center gap-x-4 mt-2">
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
            </div>
            )}
        </div>
    )
}