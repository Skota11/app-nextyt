import { supabase } from "../../utils/supabase/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";

export default function Main() {
    const onTwitterRegister = async () => {
        supabase.auth.signInWithOAuth({ provider: "twitter" });
    }
    const onDiscordRegister = async () => {
        supabase.auth.signInWithOAuth({ provider: "discord" });
    }

    return <>
        <div className='flex place-content-center py-6 gap-x-12'>
            <button className='bg-black text-white rounded-full border-2 p-4 text-lg border-current hover:bg-neutral-700 duration-100' onClick={() => { onTwitterRegister(); }}><FontAwesomeIcon icon={faTwitter} className='mr-2 text-white' /> Twitterでログイン</button>
            <button className='bg-black text-white rounded-full border-2 p-4 text-lg border-current hover:bg-neutral-700 duration-100' onClick={() => { onDiscordRegister(); }}><FontAwesomeIcon icon={faDiscord} className='mr-2 text-white' /> Discordでログイン</button>
        </div>
    </>
}