// React
import { useEffect, useState } from "react"

// Material UI
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"

// Toast Notifications
import toast, { Toaster } from 'react-hot-toast';

import {Button} from '@/components/ui/button'

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
            <div className="flex items-center">
                <FormControl sx={{ m: 1, minWidth: 240 }}>
                    <InputLabel id="demo-simple-select-label">プレイリストを選択</InputLabel>
                    <Select
                        variant="standard"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectId}
                        label="Playlist"
                        onChange={(e) => { setSelectId(e.target.value) }}
                    >
                        {result?.map((item) => {
                            return (<MenuItem value={item.playlistId} key={item.playlistId}>
                                {item.playlistName}
                            </MenuItem>)
                        })}
                    </Select>
                </FormControl>
                <Button variant="outline" onClick={addClickHandler}>追加</Button>
                <Toaster position="bottom-center" />
            </div>
        </>
    )
}