// supabase
import {createClient} from "@/utils/supabase/server";

// Home components
import Account from "@/components/home/account";

// Material UI
import CircularProgress from '@mui/material/CircularProgress';

interface User { id: string | undefined, email: string | undefined, provider : string | undefined ,login: boolean };

export default async function Home() {
    const supabase = await createClient();
        const { data } = await supabase.auth.getUser()
        console.log(data)
        const currentUser: User | null = data.user ? {
            id: data.user.id,
            email: data.user.email,
            provider: data.user.app_metadata.provider,
            login: true
        } : null;

    return (
        <>
            {currentUser?.login ? <>
                <div className="p-4 max-w-screen-xl m-auto">
                    <Account currentUser={currentUser} />
                </div>
            </> : <>
                {currentUser ? <>
                    <p className="text-center">ログインが必要です。</p>
                </> : <>
                    <div className="flex place-content-center my-12">
                        <div><CircularProgress color="primary" size={80} /> <p className="text-center">アプリを起動中</p></div>
                    </div>
                </>}
            </>}
        </>
    )
}
