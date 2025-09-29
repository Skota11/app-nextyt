"use client";

import useSWRInfinite from "swr/infinite";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";

import nicoCheck from "@/utils/niconico/nicoid";
import { VideoAbout } from "@/types/db";
import NicoVideoCard from "./cards/nicoVideoCard";
import VideoCard from "./cards/youtubeVideoCard";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { fetcher } from "@/lib/fetcher";

const PAGE_SIZE = 50;

// getKey をここで定義（useEffect 不要）
const getKey = (pageIndex: number, previousPageData: VideoAbout[] | null) => {
  // 前のページが空ならもう無いので null
  if (previousPageData && previousPageData.length === 0) return null;
  if (pageIndex === 0) return "/api/database/history";
  return `/api/database/history?page=${pageIndex + 1}`;
};

export default function History() {
  const {
    data,
    size,
    setSize,
    mutate,
    error,
    isValidating,
    isLoading, // SWR v2 以降
  } = useSWRInfinite<VideoAbout[]>(getKey, fetcher, {
    parallel: true,
  });

  // 取得済みページを平坦化
  const pages = data ?? [];
  const items: VideoAbout[] = pages.flat();

  const lastPage = pages[pages.length - 1];
  const hasMore =
    !!lastPage && lastPage.length === PAGE_SIZE; // 50 件未満なら終了

  const loadMore = () => {
    if (hasMore) setSize(size + 1);
  };

  const deleteHistory = async (id: string) => {
    // 楽観的更新（全ページから該当 ID を除外)
    mutate(
      prev => {
        if (!prev) return prev;
        return prev.map(page => page.filter(v => v.videoId !== id));
      },
      { revalidate: false }
    );

    const res = await fetch("/api/database/history", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      // 失敗時ロールバック (再検証)
      await mutate();
    } else {
      // 成功時: サーバー側真値を再取得（最初のページなど更新される可能性）
      mutate();
    }
  };
  // 初回ロード
  if (isLoading && items.length === 0) {
    return (
      <div className="mx-4 my-6">
        <Spinner variant="ring" />
      </div>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className="mx-4 my-6">
        <p>視聴履歴はありません</p>
      </div>
    );
  }

  return (
    <div className="mt-2 mx-4">
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="py-6 flex justify-center">
            <Spinner variant="ring" />
          </div>
        }
        scrollThreshold={0.85}
      >
        {items.map(item => {
          const Card = nicoCheck(item.videoId) ? NicoVideoCard : VideoCard;
          return (
            <div key={item.videoId}>
              <Card
                item={item}
                deleteHistory={deleteHistory}
              />
            </div>
          );
        })}
      </InfiniteScroll>

      {/* 追加フェッチ中の下部インジケータ（無限スクロールライブラリの loader とは別に明示したい時用） */}
      {isValidating && !hasMore && (
        <div className="py-4 flex justify-center">
          <Spinner variant="ring" />
        </div>
      )}
    </div>
  );
}