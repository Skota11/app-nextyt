'use client'

// React
import { useEffect, useState } from "react";
import Link from "next/link";

// supabase
import { supabase } from "../utils/supabase/client";

// Home components
import History from "@/components/home/history";
import OAuth from "@/components/home/oauth";
import Playlist from "@/components/home/playlist";
import Channels from "@/components/home/channels";

// Play components
import Search from "@/components/play/search";

// Material UI
import CircularProgress from '@mui/material/CircularProgress';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons"

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
          <div className="place-content-center my-4">
            <Search />
          </div>
          <Link href={"/settings"} className="text-blue-700 hover:text-blue-900">
            <h1 className='text-lg my-2'><FontAwesomeIcon icon={faUser} className='mr-2' />アカウントと設定→</h1>
          </Link>
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
            <div>
              <div className="flex place-content-center mb-4">
                <CircularProgress color="error" size={80} />
              </div>
              <p className="text-center">アプリを起動中</p></div>
          </div>
        </>}
      </>}
    </>
  )
}