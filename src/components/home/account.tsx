"use client"

//React
import Link from "next/link";

//supabase
import { supabase } from "../../utils/supabase/client";

//fontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faLink } from "@fortawesome/free-solid-svg-icons";
import { useLocalStorage } from "react-use";
import { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";

//Utility Libraries

interface User { id: string | undefined, email: string | undefined, provider: string | undefined, login: boolean };

export default function Main(props: { currentUser: User }) {
    const [pip, setPip] = useLocalStorage<boolean>('pip', false);
    const [autoPlay, setAutoPlay] = useLocalStorage<boolean>('autoPlay', true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    async function LogOut() {
        await supabase.auth.signOut()
        window.location.reload()
    }
    return (
        <div className='mt-2'>
            <div className="mx-4 flex flex-col gap-y-6 ">
                <div >
                    <h1 className="text-xl my-6">プレイヤー設定</h1>
                    <div className="flex flex-col gap-y-4 mx-2">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <span>PiP</span>
                                {mounted && (
                                    <Switch
                                        checked={pip}
                                        onChange={(e) => setPip(e.target.checked)}
                                    />
                                )}
                            </div>
                            <p className="text-sm text-gray-800">プレイヤーが画面外になってもミニプレイヤーで表示します。</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <span>自動再生</span>
                                {mounted && (
                                    <Switch
                                        checked={autoPlay}
                                        onChange={(e) => setAutoPlay(e.target.checked)}
                                    />
                                )}
                            </div>
                            <p className="text-sm text-gray-800">動画選択後やページ読み込み後に自動で動画を再生します。ブラウザの音声ありの自動再生を許可してください。</p>
                            <p className="text-sm text-gray-800">連続再生を有効にするときはこの設定をオンにしないと再生されません。</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2 mb-2">
                                <span>ニコニコプレイヤー設定</span>
                                <Link href={"/niconico/player"} className="text-blue-600 hover:text-blue-800">
                                    <FontAwesomeIcon icon={faLink} className="mr-2" />
                                    設定
                                </Link>
                            </div>
                            <p className="text-sm text-gray-800">スマホでのニコニコ再生時にプレイヤーの音量設定を変更できます。</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h1 className="text-xl my-6">アカウント設定</h1>
                    <div className="flex flex-col gap-y-4 mx-2">
                        <div>
                            <p>ID</p>
                            <p className="text-gray-800">{props.currentUser.id}</p>
                        </div>
                        <div>
                            <p>登録メールアドレス</p>
                            <p className="text-gray-800">{props.currentUser.email}</p>
                        </div>
                        <div>
                            <p>ログイン方法</p>
                            <p className="text-gray-800">{props.currentUser.provider}</p>
                        </div>
                        <div>
                            <button className="text-red-600 hover:text-red-800 text-lg" onClick={LogOut}>
                                <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" />
                                ログアウト
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}
