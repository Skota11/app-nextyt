// React
import Link from "next/link";

// supabase
import { isLoggedIn } from "@/utils/supabase/isLogin";

// Home components
import History from "@/components/history/history";
import Playlist from "@/components/home/playlist";
import Channels from "@/components/home/channels";

// Play components
import Search from "@/components/search/search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import PlaylistHead from "@/components/home/playlistHead";
import { HomeNavigation } from "@/components/home/Navigation";

export default async function Home() {
  const { loggedIn } = await isLoggedIn();
  return (
    <>
      {loggedIn ? <>
        <div className="p-4 max-w-screen-xl m-auto">
          <div className="grid grid-cols-2 mb-4">
            <div className="col-start-1 col-end-2">
              <HomeNavigation />
            </div>
            <div className="col-end-3 flex place-content-end">
              <Link href={"/settings"} className="text-blue-700 hover:text-blue-900 items-end">
                <h1 className='text-lg my-2 inline'><FontAwesomeIcon icon={faUser} className="mr-2" />アカウントと設定</h1>
              </Link>
            </div>
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
      </> : 
      <div className="p-4 max-w-screen-xl m-auto">
        <div>
          <HomeNavigation />
        </div>
      </div>
      }
    </>
  )
}