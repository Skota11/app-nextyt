'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export function useAddQueue() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    /**
     * キューへ追加。既に存在する場合は URL 変更を行わず false を返す。
     * @param id 動画ID
     * @returns boolean 追加されたら true / 既存で追加されなかったら false
     */
    return (id: string): boolean => {
        if (!id) return false;
        const params = new URLSearchParams(searchParams);

        const current = params.get('queue');
        const list = current ? current.split(',').filter(Boolean) : [];

        if (list.includes(id)) {
            return false;
        }
        list.push(id);
        params.set('queue', list.join(','));
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        return true;
    };
}