'use client'
import { useState } from "react";
import "./play.css"
//components
import Player from "../../components/play/player";
import Search from "../../components/play/search";

export default function Home() {
    const [ytid, setYtid] = useState("")
    const p_setYtid = (id: string) => { setYtid(id) }
    return (
        <>
            <Player ytid={ytid} />
            <Search setYtid={p_setYtid} />
        </>
    )
}