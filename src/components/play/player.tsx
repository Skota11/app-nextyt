import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faEye, faShareFromSquare, faThumbsUp, faVolumeHigh, faVolumeXmark, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Drawer from "@mui/material/Drawer";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import dayjs from 'dayjs'
import toJaNum from "@/utils/num2ja";
import AddPlaylist from "./addPlaylist";
import { supabase } from "@/utils/supabase/client";

export default function Home(props: { ytid: string }) {
    //state
    const [playing, setPlaying] = useState(true)
    const [muted, setMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1)
    const [about, setAbout] = useState({ title: "", channelId: "", channelTitle: "", description: "", publishedAt: "" });
    const [statistics, setStatistic] = useState({ viewCount: "", likeCount: "" });
    const [login, setLogin] = useState(false)
    useEffect(() => {
        const f = async () => {
            const { data } = await supabase.auth.getSession()
            if (data.session !== null) {
                setLogin(true)
            }
        }
        f()
    }, [])
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
    const handleShare = async () => {
        const data: ShareData = {
            title: `${about.title}`,
            url: `https://youtu.be/${props.ytid}`
        };
        await navigator.share(data)
    }
    return (
        <>
            {/* Player */}
            <div className='aspect-video w-full max-h-4/5 rounded-lg maxHeightVideo'>
                {props.ytid ? <>
                    <ReactPlayer
                        className={"react-player "}
                        url={`https://youtube.com/watch?v=${props.ytid}`}
                        playing={playing}
                        playbackRate={playbackRate}
                        muted={muted}
                        width={"100%"}
                        height={"100%"}
                        controls={true}
                        onPause={() => { setPlaying(false) }}
                        onPlay={() => { setPlaying(true) }}
                    />
                </> : <div className='w-full h-full text-white flex place-content-center bg-black'><p className='text-2xl text-center'>動画が選択されていません</p></div>}
            </div>
            {/* Title&Drawer */}
            <div className='px-2 py-2'>
                <div>
                    <h1 className='m-2 break-all text-lg cursor-pointer' onClick={() => { setOpenedDrawer(true) }}>{about.title}</h1>
                    <Drawer
                        anchor={'left'}
                        open={openedDrawer}
                        onClose={toggleOnCloseDrawer}
                        PaperProps={{
                            sx: { width: "100%", maxWidth: "512px" },
                        }}
                    >
                        <p className='mt-4 text-center cursor-pointer' onClick={() => { setOpenedDrawer(false) }}>閉じる</p>
                        <div className='p-8'>
                            <h1 className='text-xl'>{about.title}</h1>
                            <p className='text-lg text-slate-600' onClick={() => { }}>{about.channelTitle}</p>
                            <div className='sm:flex gap-x-4 my-4 gap-y-4'>
                                <p className='text-lg'>{dayjs(about.publishedAt).format('YYYY年MM月DD日')}</p>
                                <p className='text-lg'><FontAwesomeIcon className='mr-2' icon={faEye} />{toJaNum(statistics.viewCount)}</p>
                                <p className='text-lg'><FontAwesomeIcon className='mr-2' icon={faThumbsUp} /> {toJaNum(statistics.likeCount)}</p>
                            </div>
                            <div className="my-4">
                                <a className='' href={`https://youtu.be/${props.ytid}`} ><FontAwesomeIcon className='ml-2' icon={faYoutube} />  Youtubeで開く</a>
                            </div>
                            {login ? <>
                                <div>
                                    <AddPlaylist videoId={props.ytid} />
                                </div>
                            </> : <></>}
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
                        <button className='border-2 p-2 rounded-full text-xs border-current' onClick={async () => { setPlaybackRate(1) }}><FontAwesomeIcon icon={faXmark} />1</button>
                        <button className='border-2 p-2 rounded-full text-xs border-current' onClick={async () => { setPlaybackRate(1.5) }}><FontAwesomeIcon icon={faXmark} />1.5</button>
                        <button className='border-2 p-2 rounded-full text-xs border-current' onClick={async () => { setPlaybackRate(2) }}><FontAwesomeIcon icon={faXmark} />2</button>
                        {muted ?
                            <button className='border-2 p-2 rounded-full text-xs border-current' onClick={async () => { setMuted(false) }}><FontAwesomeIcon icon={faVolumeXmark} /></button>
                            :
                            <button className='border-2 p-2 rounded-full text-xs border-current' onClick={async () => { setMuted(true) }}><FontAwesomeIcon icon={faVolumeHigh} /></button>
                        }
                        <button className='border-2 p-2 rounded-full text-xs border-current' onClick={async () => { handleShare() }}><FontAwesomeIcon icon={faShareFromSquare} /></button>
                        {/* <button className='border-2 p-2 rounded-full text-xs border-current' onClick={async () => { handleFullScreen() }}><FontAwesomeIcon icon={faExpand} /></button> */}
                    </div>
                    : <></>}
            </div>
        </>
    )
}