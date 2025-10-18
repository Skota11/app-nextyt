"use client";

import useSWR from "swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStickyNote } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Channel } from "@/types/db";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/fetcher";

export default function Main() {
  const { data, isLoading } = useSWR<Channel[]>("/api/database/channels" , fetcher);

  return (
    <div className="mt-2">
      <h1 className="text-lg my-4">
        <FontAwesomeIcon icon={faStickyNote} className="mr-2" />
        ピン留めチャンネル
      </h1>
      <div className="mx-4">
        {isLoading && (
          <div className="flex gap-x-4">
            <Skeleton className="w-[70px] h-[70px]" />
            <Skeleton className="w-[70px] h-[70px] rounded-full" />
          </div>
        )}
        {!isLoading && data && data.length === 0 && <p>ピン留めされたチャンネルはありません</p>}
        {!isLoading && data && data.length > 0 && (
          <div className="flex flex-nowrap overflow-x-auto gap-x-4 pb-4 snap-x">
            {data.map(item => (
              <Link
                key={item.channelId}
                className="snap-start min-w-[70px]"
                href={`/channel/${item.channelId}`}
                prefetch={false}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Image
                        alt="channelImage"
                        src={item.channelContent.thumbnails.medium.url}
                        width={70}
                        height={60}
                        unoptimized
                        className="rounded-full hover:brightness-90 transition-all aspect-square object-cover"
                      />
                    </TooltipTrigger>
                    <TooltipContent>{item.channelContent.title}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}