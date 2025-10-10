"use client"

//React
import Link from "next/link";

//supabase
import { createClient } from "../../lib/supabase/client";

//fontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faLink } from "@fortawesome/free-solid-svg-icons";
import { useLocalStorage } from "react-use";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

//Utility Libraries

interface User { id: string | undefined, userName: string | undefined, email: string | undefined, provider: string | undefined, login: boolean };

export default function Main(props: { currentUser: User }) {
    const supabase = createClient();
    const [pip, setPip] = useLocalStorage<boolean>('pip', false);
    const [autoPlay, setAutoPlay] = useLocalStorage<boolean>('autoPlay', true);
    const [repeat, setRepeat] = useLocalStorage<boolean>('repeat', false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    async function LogOut() {
        await supabase.auth.signOut()
        window.location.href = "/";
    }
    return (
        <div className='mt-2'>
            <div className="mx-4 flex flex-col gap-y-6 ">
                <div >
                    <h1 className="text-xl my-6">プレイヤー設定</h1>
                    <div className="flex flex-col gap-y-4 mx-2">
                        <div>
                            <div className="flex items-center gap-x-2 my-2">
                                {mounted && (
                                    <Switch
                                        id="pip"
                                        checked={pip}
                                        onCheckedChange={(e) => setPip(e)}
                                    />
                                )}
                                <Label htmlFor="pip">PiP</Label>
                            </div>
                            <p className="text-sm text-gray-800 dark:text-gray-200">プレイヤーが画面外になってもミニプレイヤーで表示します。</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2 my-2">
                                {mounted && (
                                    <Switch
                                        id="autoPlay"
                                        checked={autoPlay}
                                        onCheckedChange={(e) => setAutoPlay(e)}
                                    />
                                )}
                                <Label htmlFor="autoPlay">自動再生</Label>
                            </div>
                            <p className="text-sm text-gray-800 dark:text-gray-200">動画選択後やページ読み込み後に自動で動画を再生します。</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200">連続再生を有効にするときはこの設定をオンにしないと再生されません。</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2 my-2">
                                {mounted && (
                                    <Switch
                                        id="repeat"
                                        checked={repeat}
                                        onCheckedChange={(e) => setRepeat(e)}
                                    />
                                )}
                                <Label htmlFor="repeat">リピート再生</Label>
                            </div>
                            <p className="text-sm text-gray-800 dark:text-gray-200">動画を再生し終わったあともう一度はじめから再生します。</p>
                            <p className="text-sm text-gray-800 dark:text-gray-200">プレイヤー下のコントローラーでも変更できます。</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2 mb-2">
                                <Link href={"/settings/player"} className="text-blue-600 hover:text-blue-800">
                                    <FontAwesomeIcon icon={faLink} className="mr-2" />
                                    プレイヤー設定
                                </Link>
                            </div>
                            <p className="text-sm text-gray-800 dark:text-gray-200">スマホでのニコニコ再生時にプレイヤーの音量設定を変更できます。</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h1 className="text-xl my-6">アカウント設定</h1>
                    <div className="flex flex-col gap-y-4 mx-2">
                        <div>
                            <p>ユーザーID</p>
                            <p className="text-gray-800 dark:text-gray-200">{props.currentUser.id}</p>
                        </div>
                        <div>
                            <p>ユーザー名</p>
                            <p className="text-gray-800 dark:text-gray-200">{props.currentUser.userName}</p>
                        </div>
                        <div>
                            <p>登録メールアドレス</p>
                            <p className="text-gray-800 dark:text-gray-200">{props.currentUser.email}</p>
                        </div>
                        <div>
                            <p>ログイン方法</p>
                            <p className="text-gray-800 dark:text-gray-200">{props.currentUser.provider}</p>
                        </div>
                        <div>
                            <Button variant={"destructive"} onClick={LogOut}>
                                <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" />
                                ログアウト
                            </Button>
                        </div>
                        <div className="my-4">
                            <p>退会を希望される場合は、ユーザーIDとユーザー名をわかるように登録メールアドレスからメールを送信してください。</p>
                            <p>contact@skota11.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}
