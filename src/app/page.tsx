// React
import Link from "next/link";

// supabase
import {createClient} from "../utils/supabase/server";

// Home components
import History from "@/components/home/history";
import OAuth from "@/components/home/oauth";
import Playlist from "@/components/home/playlist";
import Channels from "@/components/home/channels";

// Play components
import Search from "@/components/play/search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";


interface User { id: string | undefined, email: string | undefined, login: boolean };

export default async function Home() {
  const supabase = await createClient();
    const { data } = await supabase.auth.getUser()
    const currentUser: User | null = data.user ? {
        id: data.user.id,
        email: data.user.email,
        login: true
    } : null;
  return (
    <>
      {currentUser?.login ? <>
        <div className="p-4 max-w-screen-xl m-auto">
          <div className="text-right">
            <Link href={"/settings"} className="text-blue-700 hover:text-blue-900">
              <h1 className='text-lg my-2 inline'><FontAwesomeIcon icon={faUser} className="mr-2" />アカウントと設定</h1>
            </Link>
          </div>
          <div className="place-content-center my-2">
            <Search />
          </div>
          <Channels />
          <Playlist />
          <History />
        </div>
      </> : <>
          <OAuth />
          <div className="place-content-center">
            <Search />
          </div>
        </>
    }
      </>
  )
}