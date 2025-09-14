export type VideoAbout = { 
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

export type Channel = { 
    channelId: string, 
    channelContent: { 
        title: string, 
        thumbnails: { 
            medium: { 
                url: string 
            } 
        }
    } 
}