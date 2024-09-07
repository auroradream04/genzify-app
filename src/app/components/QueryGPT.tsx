'use client'

import { useEffect, useState } from "react"
import { moderationGpt, queryGpt } from "../utils/fetchGpt"
import ReactMarkdown from 'react-markdown';
import hljs from "highlight.js";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import SuspenseComponent from "./SuspenseComponent";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { MdRestartAlt } from "react-icons/md";
import AuthorPlug from "./AuthorPlug";


export default function QueryGPT() {
    const [query, setQuery] = useState<string>("")
    const [result, setResult] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [lastQuery, setLastQuery] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLButtonElement | MouseEvent>, reset = false) => {
        e.preventDefault()
        setIsLoading(true)
        setResult("")
        
        if (query.length === 0 && !reset) {
            await setTimeout(() => {
                setResult("Ayo, you gotta write something first my homie 🤷‍♂️")
                setIsLoading(false)
                return
            }, 1000);
        } else {
            const chatQuery = reset ? lastQuery : query

            // Check if the query is flagged for moderation
            try {
                const isFlagged = await moderationGpt(chatQuery)

                if (isFlagged) {
                    setResult("Ayo, we don't do that here. Please keep it clean and respectful. 🙅‍♂️")
                    setIsLoading(false)
                    return
                }
            } catch (error) {
                console.error(error)
                setIsLoading(false)
                return
            }

            try {
                const message = await queryGpt(chatQuery)

                setResult(message)
                setLastQuery(chatQuery)
            } catch (error) {
                console.error(error)
                return
            }

            setIsLoading(false)
            return
        }

    }

    // Highlight code blocks in the result via highlight.js
    useEffect(() => {
        hljs.highlightAll();
    }, [result]);

    // What's a good GenZ placeholder for the textarea below? > not this > genzify it > 

    return (
        <div className="w-full justify-center flex">
            <form className="w-full max-w-[800px] min-h-60 rounded-sm" onSubmit={handleSubmit}>
                <div className="w-full">
                    <Label className="text-white text-sm font-bold">GenZify anything</Label>
                    <div className="flex relative mt-2">
                        <Textarea disabled={isLoading} className="flex-1 w-full px-4 pr-20 py-2 h-[80px] min-h-[80px]" value={query} placeholder="Ayo, what’s the tea? 👀✨" onChange={(e) => setQuery(e.target.value)} />
                        <div className="flex items-center absolute right-2 bottom-2 justify-center">
                            <button onClick={(e) => handleSubmit(e, true)} disabled={isLoading || lastQuery.length === 0} type="reset" className="disabled:cursor-not-allowed transition disabled:text-[rgb(130,130,130)] text-white p-2 bg-zinc-800 disabled:bg-zinc-900 rounded-md">
                                <MdRestartAlt className="text-lg" />
                            </button>
                            <button disabled={isLoading} type="submit" className="disabled:cursor-not-allowed transition disabled:text-[rgb(130,130,130)] text-white p-2 bg-zinc-800 disabled:bg-zinc-900 rounded-md ml-2">
                                <IoArrowUpCircleOutline className="text-lg" />
                            </button>
                        </div>
                    </div>
                </div>
                {
                    result ?
                        <div className="w-full mt-4">
                            <Label className="text-white text-sm font-bold">Response</Label>
                            <ReactMarkdown className="mt-2 h-full w-full text-sm gpt-result px-3 py-2 border-zinc-800 border rounded-md">{result}</ReactMarkdown>
                        </div>
                        : isLoading ? <SuspenseComponent /> : null
                }
                <AuthorPlug />
            </form>
        </div>
    )
}