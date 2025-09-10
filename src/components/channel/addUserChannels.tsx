"use client";

import { faStickyNote, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@mui/material/Button";

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
        <div className="my-4 flex gap-x-4">
                        <Button color="success" startIcon={<FontAwesomeIcon icon={faStickyNote} />} onClick={addUserChannels}>ピン留め</Button>
                        <Button color="warning" startIcon={<FontAwesomeIcon icon={faTrash} />} onClick={deleteUserChannels}>解除</Button>
        </div>
    );
}