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
import { useSWRConfig } from 'swr';
import { jsonFetcher } from '@/lib/swr';

export default function QueueList() {
    const [queryQueue, setQueryQueue] = useQueryState('queue', parseAsArrayOf(parseAsString, ',').withOptions({ clearOnDefault: true }));
    const [videoId, setVideoId] = useQueryState('v', parseAsString.withDefault(''));

    const queueArr = useMemo(() => queryQueue || [], [queryQueue]);
    const current = videoId;
    const [metaMap, setMetaMap] = useState<Record<string, { title: string }>>({});
    const [newId, setNewId] = useState<string | null>(null);
    const prevQueueRef = useRef<string[]>([]);
    const { cache, mutate } = useSWRConfig();

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
    }, [queueArr]);

    useEffect(() => {
        let cancelled = false;

        type YTData = { snippet?: { title?: string } };
        type NicoData = { video?: { title?: string } };

        const extractTitle = (id: string, data: unknown): string | null => {
            try {
                if (!data) return null;
                if (nicoCheck(id)) {
                    const t = (data as NicoData).video?.title;
                    return typeof t === 'string' ? t : null;
                }
                const t = (data as YTData).snippet?.title;
                return typeof t === 'string' ? t : null;
            } catch {}
            return null;
        };

        const run = async () => {
            // 1) まずSWRキャッシュから可能な限り取得（無駄なリクエストを削減）
            const initialMap: Record<string, { title: string }> = {};
            const missing: Array<{ id: string; key: string }> = [];

            for (const id of queueArr) {
                if (!id) continue;
                const key = nicoCheck(id) ? `/api/external/niconico?id=${id}` : `/api/external/video?id=${id}`;
                const cached = cache.get(key) as unknown;
                const title = extractTitle(id, cached);
                if (title) {
                    initialMap[id] = { title };
                } else {
                    missing.push({ id, key });
                }
            }

            if (!cancelled) setMetaMap(initialMap);

            // 2) キャッシュに無いものだけフェッチし、SWRキャッシュにも格納
            if (missing.length === 0) return;
            const fetched = await Promise.all(
                missing.map(async ({ id, key }) => {
                    try {
                        const data: unknown = await jsonFetcher(key);
                        // 他コンポーネントとも共有できるようSWRキャッシュへ保存（再検証なし）
                        if (!cancelled) await mutate(key, data, false);
                        const t = extractTitle(id, data);
                        return t ? ([id, { title: t }] as const) : null;
                    } catch {
                        return null;
                    }
                })
            );

            if (cancelled) return;
            setMetaMap(prev => {
                const next = { ...prev };
                for (const e of fetched) {
                    if (e) next[e[0]] = e[1];
                }
                return next;
            });
        };

        run();
        return () => { cancelled = true; };
    }, [queueArr, cache, mutate]);

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

