//supabase
import { supabase } from "@/utils/supabase/client";

//fontAwesome icons
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Main() {
    const onTwitterRegister = async () => {
        supabase.auth.signInWithOAuth({ provider: "twitter" });
    }
    const onDiscordRegister = async () => {
        supabase.auth.signInWithOAuth({ provider: "discord" });
    }

    return <>
        <div className="my-4">
            <div className='flex place-content-center gap-x-4 items-center'>
                <button className='bg-black text-white rounded-full border-2 p-4 text-lg border-current hover:bg-neutral-700 duration-100' onClick={() => { onTwitterRegister(); }}><FontAwesomeIcon icon={faTwitter} className='mr-2 text-white' />Twitter</button>
                <span>または</span>
                <button className='bg-black text-white rounded-full border-2 p-4 text-lg border-current hover:bg-neutral-700 duration-100' onClick={() => { onDiscordRegister(); }}><FontAwesomeIcon icon={faDiscord} className='mr-2 text-white' />Discord</button>
            </div>
            <p className="text-center">でログイン</p>
        </div>
    </>
}