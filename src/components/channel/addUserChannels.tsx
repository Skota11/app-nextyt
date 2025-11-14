"use client";

import { faStickyNote, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Button} from "@/components/ui/button";

import toast from "react-hot-toast";

export default function AddUserChannels({id} : { id: string }) {
    const addUserChannels = async () => {
        await fetch('/api/database/channels', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id }),
        })
        toast.success('チャンネルをピン留めしました。', { duration: 4000 });
    }
    const deleteUserChannels = async () => {
        await fetch('/api/database/channels', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id }),
        })
        toast.success('チャンネルのピン留めを解除しました。', { duration: 4000 });
    }
    return (
        <div>
            <div className="my-4 flex gap-x-4">
                <Button size={"sm"} variant={"secondary"} onClick={addUserChannels}><FontAwesomeIcon icon={faStickyNote} /> ピン留め</Button>
                <Button size={"sm"} variant={"secondary"} onClick={deleteUserChannels}><FontAwesomeIcon icon={faTrash} /> 解除</Button>
            </div>
        </div>
    );
}