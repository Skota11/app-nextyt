'use client'

// React
import { useEffect, useState } from "react";

// supabase
import { supabase } from "../../utils/supabase/client";

// Home components
import Account from "@/components/home/account";

// Material UI
import CircularProgress from '@mui/material/CircularProgress';

interface User { id: string | undefined, email: string | undefined, login: boolean };

export default function Home() {
    //State
    const [currentUser, setCurrentUser] = useState<User>();

    useEffect(() => {
        const f = async () => {
            const { data } = await supabase.auth.getSession()
            await supabase.auth.getUser()
            if (data.session !== null) {
                const user = await supabase.auth.getUser()
                setCurrentUser({ id: user.data.user?.id, email: user.data.user?.email, login: true })
            } else {
                setCurrentUser({ id: undefined, email: undefined, login: false })
            }
        }
        f()
    }, [])

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
                        <div><CircularProgress color="primary" size={80} /> <p className="text-center">ログインを待っています...</p></div>
                    </div>
                </>}
            </>}
        </>
    )
}