'use client'
//react
import Image from "next/image";
import { useEffect, useState } from "react"
//supabase
import { supabase } from "../utils/supabase/client";
//components
import OAuth from "../components/home/oauth";
import Account from "../components/home/account";
import History from "../components/home/history";
//mui
import CircularProgress from '@mui/material/CircularProgress';
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

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
          <div className='flex place-content-center'>
            <Link href="/play" className='my-8 rounded-full border-2 p-4 text-lg border-current' ><FontAwesomeIcon icon={faPlay} className='mr-2' /> Play</Link>
          </div>
          <Account currentUser={currentUser} />
          <History />
        </div>
      </> : <>
        {currentUser ? <>
          <OAuth></OAuth>
          <h1 className='text-center'>もしくはログインせずに使う</h1>
          <div className='flex place-content-center'>
            <Link href="/play" className='my-8 rounded-full border-2 p-4 text-lg border-current' ><FontAwesomeIcon icon={faPlay} className='mr-2' /> Play</Link>
          </div>
        </> : <>
          <div className="flex place-content-center my-12">
            <div><CircularProgress color="error" size={80} /> <p className="text-center">Loading</p></div>
          </div>
        </>}
      </>}
    </>
  )
}