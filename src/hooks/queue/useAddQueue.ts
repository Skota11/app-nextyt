'use client';

import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';

export function useAddQueue() {
    const [queryQueue, setQueryQueue] = useQueryState('queue', parseAsArrayOf(parseAsString, ',').withOptions({ clearOnDefault: true }));
    
    return (id: string): boolean => {
        if (!id) return false;
        
        const currentList = queryQueue || [];
        
        if (currentList.includes(id)) {
            return false;
        }
        
        const newList = [...currentList, id];
        setQueryQueue(newList);
        return true;
    };
}