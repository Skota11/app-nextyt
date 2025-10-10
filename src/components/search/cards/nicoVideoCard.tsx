'use client';
import Link from "next/link";
import Image from "next/image";
import { SiNiconico } from "react-icons/si";
import { SearchResult } from "@/types/search";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import AddPlaylist from "@/components/play/common/addPlaylist";
import { useAddQueue } from "@/hooks/queue/useAddQueue";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function NiconicoVideoCard({ item , isPlayerPage} : {item:SearchResult , isPlayerPage?: boolean}) {
    const addQueue = useAddQueue();
    const [addedState, setAddedState] = useState<"idle" | "added" | "exists">("idle");
    const searchParams = useSearchParams();
    const queueParam = searchParams.get('queue');
    // Nico は contentId と id.videoId の扱いに注意。遷移先は contentId を v として利用している既存仕様に合わせる
    const baseId = item.contentId || item.id?.videoId;
    const playHref = `/play?v=${baseId}${queueParam ? `&queue=${encodeURIComponent(queueParam)}` : ''}`;
    const triggerFeedback = (state: "added" | "exists") => {
        setAddedState(state);
        setTimeout(() => setAddedState("idle"), 1200);
    };
    const omit = (str: string) => {
            if (str.length > 36) {
                return str.substring(0, 36) + '...';
            } else {
                return str
            }
        }
    return (
        <div
            key={item.contentId || item.id?.videoId}
            className="relative my-6 break-all sm:flex items-start gap-4 cursor-pointer rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-popover transition-colors"
        >
            <Link href={playHref} className="flex-none">
            <div className="relative place-content-center w-full">
                <Image
                src={item.thumbnailUrl}
                alt=""
                width={120 * 2.5}
                height={67.5 * 2.5}
                className="inline sm:rounded-md rounded-t-lg aspect-video object-cover w-full sm:w-[300px]"
                unoptimized
                />
                <div className="absolute bottom-2 right-2 bg-white place-content-center p-1 rounded-sm">
                <p className="flex items-center text-sm text-black">
                    <SiNiconico className="m-1" />
                    ニコニコ動画
                </p>
                </div>
            </div>
            </Link>
            <div className="sm:inline">
            <Link href={playHref}>
                <div className="py-4 px-2 sm:px-0 flex flex-col gap-y-1">
                    <p className="">{item.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-200">{item.description && omit(item.description)}</p>
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
                                if(!item.contentId) return;
                                const ok = addQueue(item.contentId);
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
                            <p className="text-sm dark:text-black">プレイリストに追加</p>
                            {item.contentId && <AddPlaylist videoId={item.contentId} />}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            </div>
        </div>
    )
}