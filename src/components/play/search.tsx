import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SiNiconico } from "react-icons/si";
import { useCallback, useEffect, useState, useRef } from "react";
import Image from 'next/image'
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import Chip from "@mui/material/Chip";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
    const searchParams = useSearchParams()
    const [inputQuery, setInputQuery] = useState("")
    const [result, setResult] = useState([])
    const [suggest, setSuggest] = useState([])
    const [get, setGet] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const getSearch = async () => {
        if (inputQuery) {
            const res = await (await fetch(`/api/search?q=${inputQuery}&get=${get}`)).json();
            setResult(res.data)
            setInputQuery("")
        }
    }
    const getSuggest = async (q: string) => {
        const res = await (await fetch(`/api/suggest?q=${q}`)).json()
        setSuggest(res.data)
    }
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )
    const omit = (str: string) => {
        if (str.length > 36) {
            return str.substring(0, 36) + '...';
        } else {
            return str
        }
    }
    useEffect(() => {
        getSuggest(inputQuery)
    }, [inputQuery])
    return (
        <>

            <div className="flex place-content-center my-4">
                <form onSubmit={(e) => {
                    e.preventDefault()
                    getSearch()
                }}>
                    <div className="flex gap-x-2">
                        <input ref={inputRef} type="search" className='p-2 rounded-md border-2 outline-0' placeholder='検索するワードを入力' onChange={(e) => { setInputQuery(e.target.value) }} value={inputQuery} />
                        <button type="submit" className='py-2 px-4 rounded-lg bg-gray-100'><FontAwesomeIcon icon={faSearch} /></button>
                    </div>
                </form>
            </div>
            <div className="flex place-content-center">
                {suggest.length !== 0 ?
                    <div className="absolute p-4 border-2 rounded-lg bg-white  z-10">
                        {
                            suggest.map((item) => {
                                return (<p className="cursor-pointer" onClick={() => { setInputQuery(item) }} key={item}>{item}</p>)
                            })
                        }
                    </div>
                    : <></>}
            </div>
            <div className="flex place-content-center gap-x-4">
                <Chip icon={<FontAwesomeIcon icon={faYoutube} className="m-1" />} label={"Youtube"} onClick={() => { setGet("") }}
                    variant={get == "" ? "filled" : "outlined"}
                    color="info"
                />
                <Chip icon={<SiNiconico className="m-1" />} label={"ニコニコ動画"} onClick={(() => { setGet("niconico") })}
                    variant={get == "niconico" ? "filled" : "outlined"}
                    color="info"
                ></Chip>
            </div>

            <div className="px-4 max-w-screen-xl m-auto">
                {
                    result ?
                        result.map((item: { id?: { kind: string, videoId: string, channelId: string }, snippet: { title: string, channelTitle: string, publishedAt: string, description: string, thumbnails: { medium: { url: string } } }, contentId: string, thumbnailUrl: string, title: string, description: string }) => {
                            if (item.id?.kind == "youtube#video") {
                                return (
                                    <Link key={item.id.videoId} className='block my-8 break-all sm:flex items-start gap-4 cursor-pointer' href={`/play?${createQueryString('v', item.id.videoId)}`}>
                                        <div className="flex place-content-center flex-none">
                                            <Image src={`https://i.ytimg.com/vi/${item.id.videoId}/mqdefault.jpg`} alt="" width={120 * 2.5} height={67.5 * 2.5} className='inline rounded-md' unoptimized />
                                        </div>
                                        <div className='inline'>
                                            <p>{item.snippet.title} </p>
                                            <p className='text-slate-600 text-sm'>{item.snippet.channelTitle} ・ {dayjs(item.snippet.publishedAt).format('YYYY年MM月DD日')} </p>
                                        </div>
                                    </Link>
                                )
                            } else if (item.id?.kind == "youtube#channel") {
                                return (
                                    <Link key={item.id.channelId} className="my-8 break-all" href={`/channel/${item.id.channelId}`}>
                                        <div className="flex gap-x-4 items-center">
                                            <Image alt="channelImage" src={`${item.snippet.thumbnails.medium.url}`} width={120} height={120} unoptimized className="rounded-full" />
                                            <div>
                                                <h1 className="text-xl">{item?.snippet.title}</h1>
                                                <p className="text-sm text-gray-400">{omit(item.snippet.description)}</p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            } else {
                                console.log(item)
                                return (
                                    <Link key={item.contentId} className='block my-8 break-all sm:flex items-start gap-4 cursor-pointer' href={`https://nico.ms/${item.contentId}`} target="_blank">
                                        <div className="flex place-content-center flex-none">
                                            <Image src={`${item.thumbnailUrl}.M`} alt="" width={320} height={168.75} className='inline rounded-md' unoptimized />
                                        </div>
                                        <div className='inline'>
                                            <p>{item.title} </p>
                                            <p className="text-sm text-gray-400">{omit(item.description)}</p>
                                        </div>
                                    </Link>
                                )
                            }
                        })
                        :
                        <></>
                }
            </div>
            <button onClick={() => { inputRef.current?.focus() }} className="sm:hidden fixed right-10 bottom-10 z-50 border-2 px-4 py-3 rounded-full ">
                <p><FontAwesomeIcon icon={faSearch} /></p>
            </button>
        </>
    )
}