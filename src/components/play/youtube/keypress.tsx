import { useCallback, useEffect } from "react";
import ReactPlayer from "react-player";

export default function KeyPress({ playerRef , setPlayerState}: { playerRef: React.RefObject<ReactPlayer | null> , setPlayerState: React.Dispatch<React.SetStateAction<{ playing: boolean; muted: boolean; playbackRate: number }>> }) {
const handleKeyPress = useCallback((event: KeyboardEvent) => {
        // 入力要素でのキー入力を無視
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            return;
        }

        // Ctrl/Cmd が押されている場合は無視（OS/ブラウザのショートカットを優先）
        if (event.ctrlKey || event.metaKey) {
            return;
        }

        const key = event.key.toLowerCase();

        // 0〜9 の数字キーで n割の位置へシーク（0=0%, 9=90%）
        if (/^[0-9]$/.test(key)) {
            const n = parseInt(key, 10);
            const duration = playerRef.current?.getDuration?.() ?? 0;
            if (duration > 0) {
                const targetSeconds = (duration * n) / 10;
                playerRef.current?.seekTo(targetSeconds, 'seconds');
            }
            return;
        }

        switch (key) {
            case ' ':
            case 'space':
                event.preventDefault(); // スクロール防止
                setPlayerState(prev => ({ ...prev, playing: !prev.playing }));
                break;
            // 再生・シーク（YouTube風）
            case 'k':
                setPlayerState(prev => ({ ...prev, playing: !prev.playing }));
                break;
            case 'j':
                playerRef.current?.seekTo((playerRef.current?.getCurrentTime?.() ?? 0) - 10, 'seconds');
                break;
            case 'l':
                playerRef.current?.seekTo((playerRef.current?.getCurrentTime?.() ?? 0) + 10, 'seconds');
                break;
            case 'm':
                setPlayerState(prev => ({ ...prev, muted: !prev.muted }));
                break;
            case 'q':
                setPlayerState(prev => ({ ...prev, playbackRate: 1 }));
                break;
            case 'e':
                setPlayerState(prev => ({ ...prev, playbackRate: 2 }));
                break;
            case 'w':
                setPlayerState(prev => ({ ...prev, playbackRate: 1.5 }));
                break;
            // 微小シーク , / .
            case ',':
                playerRef.current?.seekTo((playerRef.current?.getCurrentTime?.() ?? 0) - 1, 'seconds');
                break;
            case '.':
                playerRef.current?.seekTo((playerRef.current?.getCurrentTime?.() ?? 0) + 1, 'seconds');
                break;
            case 'arrowleft':
                // Shift 併用で 10 秒、それ以外は 5 秒
                playerRef.current?.seekTo((playerRef.current?.getCurrentTime?.() ?? 0) - (event.shiftKey ? 10 : 5), 'seconds');
                break;
            case 'arrowright':
                // Shift 併用で 10 秒、それ以外は 5 秒
                playerRef.current?.seekTo((playerRef.current?.getCurrentTime?.() ?? 0) + (event.shiftKey ? 10 : 5), 'seconds');
                break;
            case 'home':
                playerRef.current?.seekTo(0, 'seconds');
                break;
            case 'end':
                {
                    const duration = playerRef.current?.getDuration?.() ?? 0;
                    if (duration > 0) playerRef.current?.seekTo(duration, 'seconds');
                }
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