import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import Image from 'next/image'
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Home() {
    const searchParams = useSearchParams()
    const [inputQuery, setInputQuery] = useState("")
    const [result, setResult] = useState([])
    const [suggest, setSuggest] = useState([])
    const getSearch = async () => {
        if (inputQuery) {
            const res = await (await fetch(`/api/search?q=${inputQuery}`)).json();
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
    useEffect(() => {
        getSuggest(inputQuery)
    }, [inputQuery])
    // props: { setYtid: (id: string) => void }
    // props.setYtid(item.id.videoId);
    return (
        <>
            <div className="flex place-content-center my-4">
                <div className="flex gap-x-2">
                    <input type="text" onKeyPress={(e) => {
                        if (e.code == "Enter") {
                            getSearch()
                        }
                    }} className='p-2 rounded-md border-2 outline-0' placeholder='検索するワードを入力' onChange={(e) => { setInputQuery(e.target.value) }} value={inputQuery} />
                    <button onClick={() => { getSearch() }} className='py-2 px-4 rounded-lg bg-gray-100'><FontAwesomeIcon icon={faSearch} /></button>
                </div>
            </div>
            <div className="flex place-content-center z-10">
                {suggest.length !== 0 ?
                    <div className="absolute p-4 border-2 rounded-lg bg-white">
                        {
                            suggest.map((item) => {
                                return (<p className="cursor-pointer" onClick={() => { setInputQuery(item) }} key={item}>{item}</p>)
                            })
                        }
                    </div>
                    : <></>}
            </div>
            <div className="px-4 max-w-screen-xl m-auto">
                {
                    result ? result.map((item: { id: { kind: string, videoId: string }, snippet: { title: string, channelTitle: string } }) => {
                        if (item.id.kind == "youtube#video") {
                            return (
                                <Link key={item.id.videoId} className='block my-8 break-all sm:flex items-start gap-4 cursor-pointer' onClick={() => { }} href={`/play?${createQueryString('v', item.id.videoId)}`}>
                                    <div className="flex place-content-center flex-none">
                                        <Image src={`https://i.ytimg.com/vi/${item.id.videoId}/mqdefault.jpg`} alt="" width={120 * 2.5} height={67.5 * 2.5} className='inline rounded-md' />
                                    </div>
                                    <div className='inline'>
                                        <p>{item.snippet.title} </p>
                                        <p className='text-slate-600 text-sm'>{item.snippet.channelTitle} </p>
                                    </div>
                                </Link>
                            )
                        }
                    })
                        :
                        <></>
                }
            </div>
        </>
    )
}