import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';

export default function NiconicoDialog({playlistId , getPlaylist, open, onOpenChange}: {playlistId: string, getPlaylist: () => Promise<void>, open?: boolean, onOpenChange?: (open: boolean) => void}) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Youtubeの再生リストと同期しますか？</AlertDialogTitle>
                                <AlertDialogDescription>
                                    この操作を行うと、現在のプレイリストの中身はすべて削除され、指定した再生リストの内容で上書きされます。<br/><br/>また以下の条件を満たす再生リストのみ同期できます。<br/>・公開プレイリストであること<br/>・動画数が30本以下であること
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                <AlertDialogAction onClick={async () => {
                                    const mylistId = prompt("同期するYoutube再生リストのIDを入力してください。")
                                    if (mylistId) {
                                        const toastId = toast.loading("同期中...")
                                        await fetch(`/api/database/playlist/playlist_sync/${playlistId}`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({ mylistId }),
                                        }).catch(() => {
                                            toast.error("同期に失敗しました", { id: toastId })
                                        }).then((res) => {
                                            if (res && res.ok) {
                                                toast.success("同期しました", { id: toastId })
                                                getPlaylist()
                                            } else {
                                                toast.error("同期に失敗しました", { id: toastId })
                                            }
                                        })
                                    }
                                }}>続行</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
    )
}