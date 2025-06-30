"use client"

import { faStickyNote, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@mui/material/Button";

export default function AddUserChannels({id} : { id: string }) {
    const addUserChannels = async () => {
        fetch('/api/database/channels', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id }),
        })
    }
    const deleteUserChannels = async () => {
        await fetch('/api/database/channels', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id }),
        })
    }
    return (
        <div className="my-4 flex gap-x-4">
                        <Button color="success" startIcon={<FontAwesomeIcon icon={faStickyNote} />} onClick={addUserChannels}>ピン留め</Button>
                        <Button color="warning" startIcon={<FontAwesomeIcon icon={faTrash} />} onClick={deleteUserChannels}>解除</Button>
        </div>
    );
}