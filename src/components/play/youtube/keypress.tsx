import { useCallback, useEffect } from "react";
import ReactPlayer from "react-player";

export default function KeyPress({ playerRef , setPlayerState}: { playerRef: React.RefObject<ReactPlayer | null> , setPlayerState: React.Dispatch<React.SetStateAction<{ playing: boolean; muted: boolean; playbackRate: number }>> }) {
const handleKeyPress = useCallback((event: KeyboardEvent) => {
        // 入力要素でのキー入力を無視
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            return;
        }

        switch (event.key.toLowerCase()) {
            case ' ':
            case 'space':
                setPlayerState(prev => ({ ...prev, playing: !prev.playing }));
                break;
            case 'm':
                setPlayerState(prev => ({ ...prev, muted: !prev.muted }));
                break;
            case '1':
                setPlayerState(prev => ({ ...prev, playbackRate: 1 }));
                break;
            case '2':
                setPlayerState(prev => ({ ...prev, playbackRate: 2 }));
                break;
            case '3':
                setPlayerState(prev => ({ ...prev, playbackRate: 1.5 }));
                break;
            case 'arrowleft':
                playerRef.current?.seekTo(playerRef.current?.getCurrentTime() - 5, 'seconds');
                break;
            case 'arrowright':
                playerRef.current?.seekTo(playerRef.current?.getCurrentTime() + 5, 'seconds');
                break;
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);
    return (<></>);
}