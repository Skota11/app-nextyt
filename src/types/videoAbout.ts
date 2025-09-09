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
    description: string,
    channelId: string,
    channelTitle: string,
    publishedAt: string,
    videoId: string
}
