"use client";
//React
import { useState, useRef } from "react";
import { useDebounce } from "react-use";
//shadcn/ui
import { Badge } from "@/components/ui/badge";
//Font Awesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSquareArrowUpRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
//React Icons
import { SiNiconico } from "react-icons/si";
//types
import { SearchResult } from "@/types/search";
import YoutubeChannelCard from "./cards/youtubeChannelCard";
import YouTubeVideoCard from "./cards/youtubeVideoCard";
import NiconicoVideoCard from "./cards/nicoVideoCard";
import { usePathname } from "next/navigation";

export default function Home() {
    //next Router
    const pathname = usePathname();
    //state
    const [inputQuery, setInputQuery] = useState("")
    const [result, setResult] = useState<Array<SearchResult> | undefined>()
    const [suggest, setSuggest] = useState([])
    const [get, setGet] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const handleClear = () => {
        setResult(undefined)
        setSuggest([])
        setInputQuery("")
        // フォーカスを戻す
        inputRef.current?.focus()
    }
    const getSearch = async () => {
        if (inputQuery) {
            const res = await (await fetch(`/api/external/search?q=${inputQuery}&get=${get}`)).json();
            setResult(res.data)
            setSuggest([])
        }
    }
    useDebounce(
        () => {
            if(inputQuery === "") {
                setSuggest([])
                return null;
            }
            // APIを呼び出す
            const fetchSuggestions = async () => {
                const res = await (await fetch(`/api/external/suggest?q=${inputQuery}`)).json()
                setSuggest(res.data);
            };
            fetchSuggestions();
        },
        250,
        [inputQuery]
    );
    const handleBlur = () => {
        setSuggest([]);
    };
    return (
        <div className="w-full">
            <div className="relative w-full max-w-xl mx-auto">
                <div className="flex place-content-center mt-4 bb-2">
                <form 
                className="w-full"
                onSubmit={(e) => {
                    e.preventDefault()
                    getSearch()
                }}>
                    <div className="flex w-full">
                        <input ref={inputRef} type="search" className='bg-gray-100 dark:text-black p-2 rounded-l-full border-2 outline-0 w-full ' placeholder='検索するワードを入力' onChange={(e) => { setInputQuery(e.target.value) }} value={inputQuery} onBlur={handleBlur} />
                        <button type="submit" className='py-2 px-4 bg-gray-100 border-y-2 border-r-2 rounded-r-full text-black'><FontAwesomeIcon icon={faSearch} /></button>
                    </div>
                    <div className="flex gap-x-4 mt-2">
                        <Badge 
                            variant={get == "" ? "default" : "outline"}
                            color={"red"}
                            className={`cursor-pointer`}
                            onClick={() => { setGet("") }}
                        >
                            <FontAwesomeIcon icon={faYoutube} className="mr-1" />
                            Youtube
                        </Badge>
                        <Badge 
                            variant={get == "niconico" ? "default" : "outline"}
                            color="blue"
                            className={`cursor-pointer`}
                            onClick={() => { setGet("niconico") }}
                        >
                            <SiNiconico className="mr-1" />
                            ニコニコ動画
                        </Badge>
                        {(result && result.length > 0)? (
                            <Badge
                                className="ml-auto"
                                onClick={handleClear}
                                aria-label="検索結果をクリア"
                                variant={"destructive"}
                            >
                                <FontAwesomeIcon icon={faTrash} className="mr-2"/>クリア
                            </Badge>
                        ) : null}
                    </div>
                </form>
            </div>
                {suggest.length !== 0 ?
                    <div className="absolute inset-x-0 top-full z-20 mt-3 w-full rounded-2xl border border-border bg-white py-2 shadow-xl ring-1 ring-black/5 backdrop-blur dark:bg-popover">
                        <div className="max-h-64 overflow-y-auto">
                            {
                                suggest.map((item) => (
                                    <div className="flex items-center gap-2" key={item}>
                                        <button
                                            type="button"
                                            className="flex-1 cursor-pointer rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-gray-50 dark:hover:bg-white/10"
                                            onClick={() => { setInputQuery(item); getSearch() }}
                                        >
                                            {item}
                                        </button>
                                        <button
                                            type="button"
                                            className="-scale-x-100 scale-y-100 ml-2 flex-shrink-0 cursor-pointer rounded-xl p-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-gray-50 dark:hover:bg-white/10"
                                            onClick={() => { setInputQuery(item) }}
                                            aria-label={`select ${item}`}
                                        >
                                            <FontAwesomeIcon icon={faSquareArrowUpRight} />
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    : <></>}
            </div>
            <div className="px-4 max-w-screen-xl m-auto">
                {
                    result ?
                        result.map((item: SearchResult) => {
                            if (item.id?.kind == "youtube#video") {
                                return (
                                    <YouTubeVideoCard key={item.id?.videoId} item={item} isPlayerPage={pathname == "/play"} />
                                )
                            } else if (item.id?.kind == "youtube#channel") {
                                return (
                                    <YoutubeChannelCard key={item.id?.channelId} item={item} />
                                )
                            } else {
                                return (
                                    <NiconicoVideoCard key={item.contentId} item={item} isPlayerPage={pathname == "/play"}/>
                                )
                            }
                        })
                        :
                        <></>
                }
            </div>
        </div>
    )
}
