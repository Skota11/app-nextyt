"use client";

import useSWR from "swr";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/fetcher";

interface Playlist { playlistId: string; playlistName: string; }

export default function Main() {
  const { data, isLoading } = useSWR<Playlist[]>("/api/database/playlist" , fetcher);

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
      <div className="mx-4 flex flex-col gap-y-2 max-w-md">
        {data.map(item => (
          <Link key={item.playlistId} href={`/playlist/${item.playlistId}`}>
            <div className="rounded-lg px-4 py-2 shadow hover:bg-gray-100 dark:hover:bg-popover transition-colors cursor-pointer border border-gray-200 dark:bg-popover">
              <p>{item.playlistName}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}