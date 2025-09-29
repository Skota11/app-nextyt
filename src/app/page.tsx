// React
import Link from "next/link";

// supabase
import { isLoggedIn } from "@/utils/supabase/isLogin";

// Home components
import History from "@/components/history/history";
import OAuth from "@/components/home/oauth";
import Playlist from "@/components/home/playlist";
import Channels from "@/components/home/channels";

// Play components
import Search from "@/components/search/search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import PlaylistHead from "@/components/home/playlistHead";

export default async function Home() {
  const { loggedIn } = await isLoggedIn();
  console.log("Home loggedIn:", loggedIn);
  return (
    <>
      {loggedIn ? <>
        <div className="p-4 max-w-screen-xl m-auto">
          <div className="text-right">
            <Link href={"/settings"} className="text-blue-700 hover:text-blue-900">
              <h1 className='text-lg my-2 inline'><FontAwesomeIcon icon={faUser} className="mr-2" />アカウントと設定</h1>
            </Link>
          </div>
          <div className="relative grid place-content-center my-2">
            <Search />
          </div>
          <Channels />
          <PlaylistHead />
          <Playlist />
          <h1 className='text-lg my-4'><FontAwesomeIcon icon={faClockRotateLeft} className='mr-2' />視聴履歴</h1>
          <History />
        </div>
      </> : <>
        <OAuth />
        <p className="text-sm text-gray-600 text-center">
          本サービスを利用開始された場合、
          <a href="/terms" className="text-blue-600 underline">利用規約</a>および
          <a href="/privacy" className="text-blue-600 underline">プライバシーポリシー</a>
          に同意したものとみなします。
        </p>
      </>
      }
    </>
  )
}