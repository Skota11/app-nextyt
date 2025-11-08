"use client";

import useSWR from "swr";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { dataFetcher } from "@/lib/swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

interface Playlist { playlistId: string; playlistName: string; }

export default function Main() {
  const { data, isLoading } = useSWR<Playlist[]>("/api/database/playlist" , dataFetcher);

  if (isLoading) {
    return (
      <div className="mt-2 mx-4">
        <div className="grid gap-y-2">
          <Skeleton className="w-[210px] h-[20px]" />
          <Skeleton className="w-[210px] h-[20px]" />
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
              <p className="col-start-1 col-end-2">{item.playlistName}</p>
              <div className="col-start-4 col-end-5 justify-self-end rounded-full flex items-center justify-between bg-blue-500/10 w-12 h-12">
                <FontAwesomeIcon icon={faPlay} className="w-12 h-12 "/>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}