'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useAddQueue() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    return (id: string) => {
        if (!id) return;
        const params = new URLSearchParams(searchParams);

        const current = params.get('queue');
        const list = current ? current.split(',').filter(Boolean) : [];

        if (!list.includes(id)) {
            list.push(id);
        }
        params.set('queue', list.join(','));
        toast.success('再生キューに追加しました', { duration: 800 });
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };
}