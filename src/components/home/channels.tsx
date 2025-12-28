"use client";

import useSWR from "swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrip } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Channel } from "@/types/db";
import { Skeleton } from "@/components/ui/skeleton";
import { dataFetcher } from "@/lib/swr";

export default function Main() {
  const { data, isLoading } = useSWR<Channel[]>("/api/database/channels" , dataFetcher);

  return (
    <div className="mt-2">
      <h1 className="text-xl font-bold my-4">
        <FontAwesomeIcon icon={faGrip} className="mr-2" />
        チャンネル
      </h1>
      <div className="p-4">
        {isLoading && (
          <div className="flex gap-x-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="w-[75px] h-[75px] rounded-full" />
            ))}
          </div>
        )}
        {!isLoading && data && data.length === 0 && <p>ピン留めされたチャンネルはありません</p>}
        {!isLoading && data && data.length > 0 && (
          <div className="flex flex-nowrap overflow-x-auto gap-x-4 snap-x">
            {data.map(item => (
              <Link
                key={item.channelId}
                className="snap-start min-w-[75px]"
                href={`/channel/${item.channelId}`}
                prefetch={false}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Image
                        alt="channelImage"
                        src={item.channelContent.thumbnails.medium.url}
                        width={75}
                        height={75}
                        unoptimized
                        className="
                          border-3 border-white group-hover:border-blue-200 duration-300 rounded-full hover:brightness-90 transition-all aspect-square object-cover"
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