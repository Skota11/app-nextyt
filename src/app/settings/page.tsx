// supabase
import { createClient } from "@/lib/supabase/server";

// Home components
import Settings from "@/components/home/settings";

// Material UI
import { Spinner } from "@/components/ui/shadcn-io/spinner";

interface User { id: string | undefined, userName: string, email: string | undefined, provider: string | undefined, login: boolean , is_anonymous: boolean | undefined };

export default async function Home() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser()
    console.log(data.user)
    const currentUser: User | null = data.user ? {
        is_anonymous: data.user.is_anonymous,
        id: data.user.id,
        email: data.user.email,
        provider: data.user.app_metadata.provider,
        userName: data.user.user_metadata.name,
        login: true
    } : null;

    return (
        <>
            {currentUser?.login ? <>
                <div className="p-4 max-w-screen-xl m-auto">
                    <Settings currentUser={currentUser} />
                </div>
            </> : <>
                {currentUser ? <>
                    <p className="text-center">ログインしてください。</p>
                </> : <>
                    <div className="flex place-content-center my-12">
                        <div><Spinner /> <p className="text-center">アプリを起動中</p></div>
                    </div>
                </>}
            </>}
        </>
    )
}
