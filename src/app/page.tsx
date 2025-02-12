'use client'
//react
import { useEffect, useState } from "react";
//supabase
import { supabase } from "../utils/supabase/client";
//components
import Account from "@/components/home/account";
import History from "@/components/home/history";
import OAuth from "@/components/home/oauth";
//mui
import CircularProgress from '@mui/material/CircularProgress';
import Search from "@/components/play/search";
import Playlist from "@/components/home/playlist";
import Channels from "@/components/home/channels";

export default function Home() {
  //State
  const [currentUser, setCurrentUser] = useState<{ id: string | undefined, email: string | undefined, login: boolean }>();

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
          <div className="place-content-center my-4">
            <Search />
          </div>
          <Account currentUser={currentUser} />
          <Channels />
          <Playlist />
          <History />
        </div>
      </> : <>
        {currentUser ? <>
          <OAuth />
          <div className="place-content-center">
            <Search />
          </div>
        </> : <>
          <div className="flex place-content-center my-12">
            <div><CircularProgress color="error" size={80} /> <p className="text-center">アプリを起動中</p></div>
          </div>
        </>}
      </>}
    </>
  )
}