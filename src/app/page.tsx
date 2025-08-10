// React
import Link from "next/link";

// supabase
import { createClient } from "../utils/supabase/server";

// Home components
import History from "@/components/home/history";
import OAuth from "@/components/home/oauth";
import Playlist from "@/components/home/playlist";
import Channels from "@/components/home/channels";

// Play components
import Search from "@/components/play/search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faClockRotateLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import PlaylistHead from "@/components/home/playlistHead";


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
          <div className="relative grid place-content-center my-2">
            <Search />
            <p className="absolute right-0 bottom-0"><Link className="p-2 rounded-full bg-gray-100 items-center flex gap-x-2" href={"/play"}><FontAwesomeIcon icon={faArrowRight} /><span>play</span></Link></p>
          </div>
          <Channels />
          <PlaylistHead />
          <Playlist />
          <h1 className='text-lg my-4'><FontAwesomeIcon icon={faClockRotateLeft} className='mr-2' />視聴履歴</h1>
          <History />
        </div>
      </> : <>
        <OAuth />
        <p className="text-sm text-gray-600">
  本サービスを利用開始された場合、
  <a href="/terms" className="text-blue-600 underline">利用規約</a>および
  <a href="/privacy" className="text-blue-600 underline">プライバシーポリシー</a>
  に同意したものとみなします。
</p>
        <div className="place-content-center">
          <Search />
        </div>
      </>
      }
    </>
  )
}