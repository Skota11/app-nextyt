'use client';
import { SearchResult } from "@/types/search";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import AddPlaylist from "@/components/play/common/addPlaylist";
import { useAddQueue } from "@/hooks/queue/useAddQueue";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const decodeHtmlEntities = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
};

export default function YouTubeVideoCard({item , isPlayerPage}: {item:SearchResult , isPlayerPage?: boolean}) {
    const addQueue = useAddQueue();
    const [addedState, setAddedState] = useState<"idle" | "added" | "exists">("idle");
    const searchParams = useSearchParams();
    const queueParam = searchParams.get('queue');
    const playHref = `/play?v=${item.id?.videoId}${queueParam ? `&queue=${encodeURIComponent(queueParam)}` : ''}`;
    const triggerFeedback = (state: "added" | "exists") => {
        setAddedState(state);
        setTimeout(() => setAddedState("idle"), 1200);
    };
    return (
        <div
            key={item.id?.videoId}
            className="relative my-6 break-all sm:flex items-start gap-4 cursor-pointer rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-popover transition-colors"
        >
            <Link href={playHref} className="flex-none">
            <div className="flex place-content-center w-full relative">
                <Image
                src={`https://i.ytimg.com/vi/${item.id?.videoId}/hqdefault.jpg`}
                alt=""
                width={120 * 3}
                height={67.5 * 3}
                className="inline sm:rounded-md rounded-t-lg aspect-video object-cover w-full sm:w-[360px]"
                unoptimized
                />
            </div>
            </Link>
            <div className="sm:inline">
            <Link href={playHref}>
                <div className="py-4 px-2 sm:px-0 flex flex-col gap-y-1">
                    <p className="">{decodeHtmlEntities(item.snippet.title)}</p>
                    <p className='text-slate-600 dark:text-slate-200 text-sm'>{item.snippet.channelTitle} ・ {dayjs(item.snippet.publishedAt).format('YYYY年MM月DD日')} </p>
                </div>
            </Link>
            <Popover>
                <PopoverTrigger asChild>
                    <button className="absolute sm:top-auto top-2 sm:bottom-2 right-2 w-8 h-8 bg-gray-300 dark:bg-slate-700 rounded-full flex place-content-center items-center hover:bg-gray-400">
                        <FontAwesomeIcon icon={faEllipsis} />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="border bg-white rounded-lg p-4 z-[120] shadow-lg" asChild>
                    <div className="flex flex-col gap-4">
                        {isPlayerPage && (
                            <Button onClick={() => {
                                if(!item.id?.videoId) return;
                                const ok = addQueue(item.id.videoId);
                                triggerFeedback(ok ? "added" : "exists");
                            }}
                                variant={addedState === 'exists' ? 'secondary' : undefined}
                            >
                                {addedState === 'added' && '追加しました ✓'}
                                {addedState === 'exists' && '既に追加済み'}
                                {addedState === 'idle' && '再生キューに追加'}
                            </Button>
                        )}
                        <div className="flex flex-col gap-1">
                            
                            {item.id?.videoId && <AddPlaylist videoId={item.id.videoId} />}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            </div>
        </div>
    )
}