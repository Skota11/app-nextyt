export type VideoAbout = {
    snippet: {
        title: string, 
        channelId: string, 
        channelTitle: string, 
        description: string, 
        publishedAt: string
    },
    statistics: {
        viewCount: string,
        likeCount: string
    }
}

export type NicoVideoAbout = { 
    title: string, 
    channelId: string, 
    channelTitle: string, 
    description: string, 
    registeredAt: string, 
    count: { 
        view: string, 
        like: string, 
        mylist: string 
    }, 
    tags: Array<{ name: string }> | undefined, 
    thumbnailUrl: string, 
    videoId: string, 
    videoType: string, 
    videoQuality: string, 
    duration: number, 
    descriptionHtml?: TrustedHTML 
};