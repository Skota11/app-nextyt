export type Playlist = { 
    videoId: string,
    videoContent: { 
        title: string, 
        channelTitle: string, 
        thumbnail: { 
            url: string, 
            middleUrl: string | null, 
            largeUrl: string | null 
        } 
    } 
}