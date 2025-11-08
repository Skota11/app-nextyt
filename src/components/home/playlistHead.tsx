"use client";

import { faList, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import toast , {Toaster} from "react-hot-toast";
import { Button } from "../ui/button";

export default function Home() {
    const router = useRouter()
    const newPlaylist = async () => {
        toast.loading('新しいプレイリストを作成中...', {id: 'newPlaylist'})
        const res = await (await fetch('/api/database/playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}),
        })).json()
        toast.dismiss('newPlaylist')
        router.push(`/playlist/${res.id}`)
    }
    return (
        <>
        <div>
            <h1 className='text-xl text-bold my-4 flex gap-x-6 items-center'><span><FontAwesomeIcon icon={faList} className='mr-2' />プレイリスト</span><Button size={"sm"} title="新しいプレイリストを作成" onClick={newPlaylist}> <FontAwesomeIcon icon={faPlus} className="mr-1 text-sm" /><span className="text-sm">新しく作成</span></Button></h1>
        </div>
        <Toaster position="bottom-center" />
        </>
    );
}