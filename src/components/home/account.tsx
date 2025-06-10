//React
import Link from "next/link";

//supabase
import { supabase } from "../../utils/supabase/client";

//fontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faTrash, faUser, faArrowUp, faLink } from "@fortawesome/free-solid-svg-icons";

//Utility Libraries
import { useCookies } from "react-cookie";

interface User { id: string | undefined, email: string | undefined, login: boolean };

export default function Main(props: { currentUser: User }) {
    const [cookies, setCookie] = useCookies(['pip'])
    async function LogOut() {
        await supabase.auth.signOut()
        window.location.reload()
    }
    return (
        <div className='mt-2'>
            <h1 className='text-lg my-2'><FontAwesomeIcon icon={faUser} className='mr-2' />Account&Setting</h1>
            <div className="mx-4 flex flex-col gap-y-6 ">
                <div className="flex gap-x-4 items-center my-2">
                    <p className='text-sm'>{props.currentUser.email}でログイン中</p>
                    <button title="ログアウト" onClick={() => { LogOut() }} className='border-2 border-red-600 bg-red-100 p-2 rounded-lg'><FontAwesomeIcon icon={faArrowRightFromBracket} className='mr-2' />ログアウト</button>
                </div>
                <hr className="" />
                <div>
                    <p>履歴を削除</p>
                    <div className='flex gap-x-4 my-1'>
                        <button title="視聴履歴を削除" onClick={async () => {
                            await fetch('/api/database/history', {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ id: 'full' }),
                            })
                            window.location.reload()
                        }} className='border-2 border-current p-2 rounded-lg'><FontAwesomeIcon icon={faTrash} className='mr-2' />WatchHistoryを削除</button>
                    </div>
                </div>
                <div>
                    <p>PiPモード</p>
                    <div className='flex gap-x-4 my-1'>
                        <button title="PiPモードをオン/オフ" onClick={() => { console.log(cookies); setCookie('pip', cookies.pip == "on" ? "off" : "on", { maxAge: 30 * 24 * 60 * 60 }) }} className='border-2 border-current p-2 rounded-lg'><FontAwesomeIcon icon={faArrowUp} className='mr-2' />PiPモードを{cookies.pip == "on" ? "オフ" : "オン"}</button>
                    </div>
                </div>
                <div>
                    <p>ニコニコプレイヤーの設定</p>
                    <div className='flex gap-x-4 my-1'>
                        <Link title="ニコニコプレイヤーを開く" href={"/niconico/player"} className='border-2 border-current p-2 rounded-lg'><FontAwesomeIcon icon={faLink} className='mr-2' />ニコニコプレイヤーを開く</Link>
                    </div>
                </div>
            </div>
        </div>)
}