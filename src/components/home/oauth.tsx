"use client"

//supabase
import { supabase } from "@/utils/supabase/client";

//fontAwesome icons
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Main() {
    const onTwitterRegister = async () => {
        supabase.auth.signInWithOAuth({
            provider: "twitter"
        });
        window.location.href = "/";
    }
    const onDiscordRegister = async () => {
        supabase.auth.signInWithOAuth({
            provider: "discord"
        });
        window.location.href = "/";
    }

    return <>
        <div className="my-12 flex flex-col gap-y-4 items-center justify-center p-4 rounded-lg shadow-lg max-w-md m-auto">
            <p>ログインまたは登録</p>
            <div className='flex flex-col gap-y-4'>
                <button className="bg-black text-gray-100 hover:text-white shadow font-bold text-sm py-3 px-4 rounded flex justify-start items-center cursor-pointer" onClick={() => { onTwitterRegister(); }}>
                    <FontAwesomeIcon icon={faTwitter} className='mr-2 text-white' />
                    <span>Twitterでログイン</span>
                </button>

                <button className='bg-black text-gray-100 hover:text-white shadow font-bold text-sm py-3 px-4 rounded flex justify-start items-center cursor-pointer' onClick={() => { onDiscordRegister(); }}>
                    <FontAwesomeIcon icon={faDiscord} className='mr-2 text-white' />
                    <span>Discordでログイン</span>
                </button>
            </div>
        </div>
    </>
}