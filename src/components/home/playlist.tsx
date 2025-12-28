"use client";

import useSWR from "swr";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { dataFetcher } from "@/lib/swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

interface Playlist { playlistId: string; playlistName: string; videos: number; }

export default function Main() {
  const { data, isLoading } = useSWR<Playlist[]>("/api/database/playlist" , dataFetcher);

  if (isLoading) {
    return (
      <div className="mt-2 mx-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="w-full h-[98px]" />
          <Skeleton className="w-full h-[98px]" />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="mt-2 mx-4"><p>Playlistはありません</p></div>;
  }

  return (
    <div className="mt-2">
      <div className="grid md:grid-cols-2 gap-4">
        {data.map(item => (
          <Link key={item.playlistId} href={`/playlist/${item.playlistId}`}>
            <div className="flex items-center justify-between p-6 rounded-lg border border-blue-500/10 dark:bg-popover hover:bg-gray-200/50 dark:hover:bg-gray-800/50 transition-all duration-300 cursor-pointer gap-4">
              <div className="col-start-1 col-end-4">
                <p className="text-lg font-bold">{item.playlistName}</p>
                <p className="text-sm text-gray-800 dark:text-gray-200">{item.videos}件の動画</p>
              </div>
              <div className="col-start-4 col-end-5 justify-self-end ">
                <div className="w-8 h-8 bg-blue-500/10 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faPlay} className="w-4 h-4"/>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}