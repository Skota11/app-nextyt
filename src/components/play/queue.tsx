"use client";
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import nicoCheck from '@/utils/niconico/nicoid';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { SiNiconico } from 'react-icons/si';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function QueueList() {
    const [queryQueue, setQueryQueue] = useQueryState('queue', parseAsArrayOf(parseAsString, ',').withOptions({ clearOnDefault: true }));
    const [videoId, setVideoId] = useQueryState('v', parseAsString.withDefault(''));

    const queueArr = useMemo(() => queryQueue || [], [queryQueue]);
    const current = videoId;
    const [metaMap, setMetaMap] = useState<Record<string, { title: string }>>({});
    const [newId, setNewId] = useState<string | null>(null);
    const prevQueueRef = useRef<string[]>([]);

    useEffect(() => {
        const prev = prevQueueRef.current;
        if (queueArr.length > prev.length) {
            const added = queueArr.find(id => !prev.includes(id));
            if (added) {
                setNewId(added);
                // 一定時間後にハイライト解除
                const t = setTimeout(() => setNewId(current => current === added ? null : current), 1600);
                return () => clearTimeout(t);
            }
        }
        prevQueueRef.current = queueArr;
    }, [queueArr.join(',')]);

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            const entries = await Promise.all(queueArr.map(async (id) => {
                if (!id) return null;
                try {
                    const endpoint = nicoCheck(id) ? `/api/external/niconico?id=${id}` : `/api/external/video?id=${id}`;
                    const res = await fetch(endpoint);
                    if (!res.ok) return null;
                    const data = await res.json();
                    if (nicoCheck(id) && data.video) {
                        return [id, { title: data.video.title }] as const;
                    } else if (data.snippet) {
                        return [id, { title: data.snippet.title }] as const;
                    }
                } catch {}
                return null;
            }));
            if (cancelled) return;
            const map: Record<string, { title: string }> = {};
            for (const e of entries) {
                if (e) map[e[0]] = e[1];
            }
            setMetaMap(map);
        };
        run();
        return () => { cancelled = true; };
    }, [queueArr.join(',')]);

    const playNow = useCallback((id: string, removeAlso?: boolean) => {
        let rest = queueArr;
        if (removeAlso) {
            rest = queueArr.filter(q => q !== id);
        }
        setVideoId(id);
        setQueryQueue(rest.length > 0 ? rest : null);
    }, [queueArr, setVideoId, setQueryQueue]);

    const removeFromQueue = (id: string) => {
        const rest = queueArr.filter(q => q !== id);
        if (current) {
            setQueryQueue(rest.length > 0 ? rest : null);
        } else {
            const nextVideo = rest[0] ?? null;
            setVideoId(nextVideo || '');
            setQueryQueue(rest.length > 1 ? rest.slice(1) : null);
        }
    };

    const clearQueue = () => {
        setQueryQueue(null);
    };

    if (queueArr.length === 0) {
        return (
            <div className="mx-4 my-6 space-y-4">
                <p>キューは空です</p>
            </div>
        );
    }

    return (
        <div className="mx-4 my-6 space-y-4">
            <div className="flex items-center justify-between">
                <p className="font-semibold">再生キュー ({queueArr.length})</p>
                <Button size="sm" variant="secondary" onClick={clearQueue}>クリア</Button>
            </div>
            <ScrollArea className="max-h-[60vh] pr-2">
                <ul className="space-y-3">
                    {queueArr.map((id, index) => {
                        const active = id === current;
                        const isNico = nicoCheck(id);
                        const meta = metaMap[id];
                        const title = meta?.title || id;
                        return (
                            <li
                                key={id}
                                className={`flex gap-4 items-center p-3 rounded-md border ${active ? 'bg-primary/10 border-primary' : 'bg-background'} ${id === newId ? 'queue-new' : ''}`}
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium break-all line-clamp-2">{title}</p>
                                    <p className="text-xs text-muted-foreground flex gap-x-1 items-center">{isNico ? <SiNiconico className='inline' /> : <FontAwesomeIcon icon={faYoutube} />} <span>{index + 1}番目</span></p>
                                </div>
                                <div className="flex flex-col gap-1 items-end">
                                    <Button size="sm" variant="outline" onClick={() => playNow(id, true)}>今すぐ再生</Button>
                                    <Button size="icon" variant="ghost" onClick={() => removeFromQueue(id)} aria-label="remove">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </ScrollArea>
        </div>
    );
}

