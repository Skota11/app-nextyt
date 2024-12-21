import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import { useEffect, useState } from "react"

interface playlist { playlistId: string, playlistName: string }

export default function Main(props: { videoId: string }) {
    const [result, setResult] = useState<Array<playlist> | undefined>(undefined)
    const [selectId, setSelectId] = useState("")
    const getPlaylists = async () => {
        const { data } = await (await fetch('/api/database/playlist')).json()
        setResult(data)
    }
    const addClickHandler = async () => {
        fetch(`/api/database/playlist/${selectId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: props.videoId }),
        })
    }
    useEffect(() => {
        getPlaylists()
    }, [])
    return (
        <>
            <div className="flex gap-x-4">
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">Playlist</InputLabel>
                    <Select
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
                <Button variant="contained" onClick={addClickHandler}>追加</Button>
            </div>
        </>
    )
}