export default function nicoImg(thumbnails: { url: string, middleUrl: string | null, largeUrl: string | null }) {
    if (thumbnails.largeUrl !== null) {
        return thumbnails.largeUrl
    } else if (thumbnails.middleUrl !== null) {
        return thumbnails.middleUrl
    } else {
        return thumbnails.url
    }
}