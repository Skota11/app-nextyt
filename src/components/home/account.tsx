//react

//supabase
import { supabase } from "../../utils/supabase/client";
//font
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Main(props: { currentUser: { id: string | undefined, email: string | undefined, login: boolean } }) {
    const [hidden, setHidden] = useState(true)
    async function LogOut() {
        await supabase.auth.signOut()
        window.location.reload()
    }
    const Delete = async () => {
        await fetch('/api/database/history', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: 'full' }),
        })
        window.location.reload()
    }
    return (
        <div className='mt-2'>
            <h1 className='text-lg my-4'><FontAwesomeIcon icon={faUser} className='mr-2' />Account <button className="text-sm" onClick={() => { setHidden(!hidden) }}>{hidden ? <>開く</> : <>閉じる</>}</button></h1>
            {hidden ? <></> : <div className="mx-4">
                <p className='text-sm'>{props.currentUser.email}でログイン中</p>
                <div className='my-4 flex-wrap flex gap-x-4 gap-y-4 mb-8 '>
                    <button onClick={() => { LogOut() }} className='border-2 border-red-600 bg-red-100 p-4 rounded-full'><FontAwesomeIcon icon={faArrowRightFromBracket} className='mr-2' />ログアウト</button>
                    <button onClick={() => { Delete() }} className='border-2 border-current p-4 rounded-full'><FontAwesomeIcon icon={faTrash} className='mr-2' />WatchHistoryを削除</button>
                </div>
            </div>}
        </div>)
}