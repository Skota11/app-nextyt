import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { fa1, fa2, faEye, faForward, faGripLinesVertical, faThumbsUp, faVolumeHigh, faVolumeXmark, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Drawer from "@mui/material/Drawer";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import dayjs from 'dayjs'
import toJaNum from "@/utils/num2ja";
import AddPlaylist from "./addPlaylist";

interface player { unMute: () => void, mute: () => void, setPlaybackRate: (arg0: number) => void, playVideo: () => void }

export default function Home(props: { ytid: string }) {
    //state
    const [YTPlayer, setPlayer] = useState<player>();
    const [muted, setMuted] = useState(false);
    const [about, setAbout] = useState({ title: "", channelId: "", channelTitle: "", description: "", publishedAt: "" });
    const [statistics, setStatistic] = useState({ viewCount: "", likeCount: "" });
    //option
    const opts = {
        width: "560",
        height: "315",
        playerVars: {
            autoplay: 1,
        },
        host: "https://www.youtube-nocookie.com"
    };
    //player
    const _onReady = (event: { target: player }) => {
        setPlayer(event.target)
        event.target.playVideo()
    }
    useEffect(() => {
        if (YTPlayer) {
            if (muted) {
                YTPlayer.mute()
            } else {
                YTPlayer.unMute()
            }
        }
    }, [muted])
    useEffect(() => {
        getVideo(props.ytid)
    }, [props.ytid])
    const getVideo = async (id: string) => {
        if (id !== "") {
            fetch('/api/database/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id }),
            })
            const res = await (await fetch(`https://www.googleapis.com/youtube/v3/videos?part=id,snippet,statistics&id=${id}&key=AIzaSyC1KMsyjrnEfHJ3xnQtPX0DSxWHfyjUBeo`)).json();
            console.log(res.items[0].statistics)
            setAbout(res.items[0].snippet)
            setStatistic(res.items[0].statistics);
            console.log(statistics)
        }
    }
    //drawer
    const [openedDrawer, setOpenedDrawer] = useState(false);
    const toggleOnCloseDrawer = () => {
        setOpenedDrawer(false);
    }
    return (
        <>
            {/* Player */}
            <div className='flex place-content-center bg-black'>
                <div className='wrap'>
                    <div className='video-container'>
                        <div className='video flex place-content-center rounded-lg'>
                            {props.ytid ? <><YouTube videoId={props.ytid}
                                opts={opts}
                                onReady={_onReady}
                            /></> : <div className=''><p className='text-white text-2xl'>動画が選択されていません</p></div>}
                        </div>
                    </div>
                </div>
            </div>
            {/* Title&Drawer */}
            <div className='px-2 py-2'>
                <div>
                    <h1 className='m-2'><button onClick={() => { setOpenedDrawer(true) }} className='break-all text-lg '>{about.title}</button></h1>
                    <Drawer
                        anchor={'left'}
                        open={openedDrawer}
                        onClose={toggleOnCloseDrawer}
                        PaperProps={{
                            sx: { width: "100%", maxWidth: "512px" },
                        }}
                    >
                        <button className='mt-4' onClick={() => { setOpenedDrawer(false) }}>閉じる</button>
                        <div className='p-8'>
                            <h1 className='text-xl'>{about.title}</h1>
                            <button className='text-lg text-slate-600' onClick={() => { }}>{about.channelTitle}</button>
                            <div className='sm:flex gap-x-4 my-4 gap-y-4'>
                                <p className='text-lg'>{dayjs(about.publishedAt).format('YYYY年MM月DD日')}</p>
                                <p className='text-lg'><FontAwesomeIcon className='mr-2' icon={faEye} />{toJaNum(statistics.viewCount)}</p>
                                <p className='text-lg'><FontAwesomeIcon className='mr-2' icon={faThumbsUp} /> {toJaNum(statistics.likeCount)}</p>
                            </div>
                            <div className="my-4">
                                <a className='' href={`https://youtu.be/${props.ytid}`} ><FontAwesomeIcon className='ml-2' icon={faYoutube} />  Youtubeで開く</a>
                            </div>
                            <div>
                                <AddPlaylist videoId={props.ytid} />
                            </div>
                            <div className='p-4 rounded-lg bg-gray-100 '>
                                <div className='text-sm break-all w-full'>{about.description.split(/(\n)/).map((v: string, i: number) => (i & 1 ? <br key={i} /> : v))}</div>
                            </div>
                        </div>
                    </Drawer>
                </div>
            </div>
            {/* Controller */}
            <div className="">
                {props.ytid !== "" ?
                    <div className=' flex place-content-center gap-x-2'>
                        <FontAwesomeIcon className='py-2' icon={faForward} />
                        <button className='border-2 p-2 rounded-lg text-xs border-current' onClick={async () => { YTPlayer?.setPlaybackRate(1) }}><FontAwesomeIcon icon={faXmark} /><FontAwesomeIcon icon={fa1} /></button>
                        <button className='border-2 p-2 rounded-lg text-xs border-current' onClick={async () => { YTPlayer?.setPlaybackRate(2) }}><FontAwesomeIcon icon={faXmark} /><FontAwesomeIcon icon={fa2} /></button>
                        <p className='py-2'><FontAwesomeIcon icon={faGripLinesVertical} /></p>
                        {muted ?
                            <button className='border-2 p-2 rounded-lg text-xs border-current' onClick={async () => { setMuted(false) }}><FontAwesomeIcon icon={faVolumeXmark} /></button>
                            :
                            <button className='border-2 p-2 rounded-lg text-xs border-current' onClick={async () => { setMuted(true) }}><FontAwesomeIcon icon={faVolumeHigh} /></button>
                        }
                    </div>
                    : <></>}
            </div>
        </>
    )
}