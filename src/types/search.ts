export type SearchResult = { 
    id?: { 
        kind: string, 
        videoId: string, 
        channelId: string 
    }, 
    snippet: { 
        title: string, 
        channelTitle: string, 
        publishedAt: string, 
        description: string, 
        thumbnails: {
            medium: { 
                url: string 
            } 
        },
    },
    contentId: string, 
    thumbnailUrl: string, 
    title: string, 
    description?: string 
};
