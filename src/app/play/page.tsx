'use client'
import { useEffect, useState } from "react";
import "./play.css"
//components
import Player from "../../components/play/player";
import Search from "../../components/play/search";
import { useSearchParams } from "next/navigation";

export default function Home() {
    const searchParams = useSearchParams();
    let defaultId: string | undefined = searchParams.get("v")?.toString();
    if (defaultId == undefined) {
        defaultId = ""
    }
    const [ytid, setYtid] = useState(defaultId)
    const p_setYtid = (id: string) => { setYtid(id) }
    useEffect(() => {
        setYtid(defaultId)
    }, [defaultId])
    //setYtid={p_setYtid}
    return (
        <>
            <Player ytid={ytid} />
            <Search />
        </>
    )
}