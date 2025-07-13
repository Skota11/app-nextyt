"use client";

import { faList, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter()
    const newPlaylist = async () => {
        const res = await (await fetch('/api/database/playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}),
        })).json()
        router.push(`/playlist/${res.id}`)
    }
    return (
        <div>
            <h1 className='text-lg my-4'><FontAwesomeIcon icon={faList} className='mr-2' /><span>Playlist</span><button title="新しいプレイリストを作成" onClick={newPlaylist}> <FontAwesomeIcon icon={faPlus} className="mr-1 text-sm" /><span className="text-sm">新しく作成</span></button></h1>
        </div>
    );
}