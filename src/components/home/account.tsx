//React
import { useState } from "react";

//supabase
import { supabase } from "../../utils/supabase/client";

//fontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faTrash, faUser, faArrowUp } from "@fortawesome/free-solid-svg-icons";

//Utility Libraries
import { useCookies } from "react-cookie";

interface User { id: string | undefined, email: string | undefined, login: boolean };

export default function Main(props: { currentUser: User }) {
    const [cookies, setCookie] = useCookies(['pip'])
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
            <h1 className='text-lg my-4'><FontAwesomeIcon icon={faUser} className='mr-2' />Account <button title="アカウントの詳細" className="text-sm" onClick={() => { setHidden(!hidden) }}>{hidden ? <>開く</> : <>閉じる</>}</button></h1>
            {hidden ? <></> : <div className="mx-4">
                <p className='text-sm'>{props.currentUser.email}でログイン中</p>
                <div className='my-4 flex-wrap flex gap-x-4 gap-y-4 mb-8 '>
                    <button title="ログアウト" onClick={() => { LogOut() }} className='border-2 border-red-600 bg-red-100 p-4 rounded-full'><FontAwesomeIcon icon={faArrowRightFromBracket} className='mr-2' />ログアウト</button>
                    <button title="視聴履歴を削除" onClick={() => { Delete() }} className='border-2 border-current p-4 rounded-full'><FontAwesomeIcon icon={faTrash} className='mr-2' />WatchHistoryを削除</button>
                    <button title="PiPモードをオン/オフ" onClick={() => { console.log(cookies); setCookie('pip', cookies.pip == "on" ? "off" : "on") }} className='border-2 border-current p-4 rounded-full'><FontAwesomeIcon icon={faArrowUp} className='mr-2' />PiPモードを{cookies.pip == "on" ? "オフ" : "オン"}</button>
                </div>
            </div>}
        </div>)
}