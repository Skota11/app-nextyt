// supabase
import { createClient } from "@/lib/supabase/server";

// Home components
import Settings from "@/components/home/settings";

export default async function Home() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser()
    if(!data.user){
        return (
            <p>ログインしてください</p>
        )
    }
    return (
        <>
            <div className="p-4 max-w-screen-xl m-auto">
                <Settings currentUser={data.user} />
            </div>
        </>
    )
}
