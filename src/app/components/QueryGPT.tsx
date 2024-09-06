'use client'

import { useEffect, useState } from "react"
import { moderationGpt, queryGpt } from "../utils/fetchGpt"
import ReactMarkdown from 'react-markdown';
import hljs from "highlight.js";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import SuspenseComponent from "./SuspenseComponent";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import AuthorPlug from "./AuthorPlug";


export default function QueryGPT() {
    const [query, setQuery] = useState<string>("")
    const [result, setResult] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setResult("")

        // Check if the query is flagged for moderation
        try {
            const isFlagged = await moderationGpt(query)

            if (isFlagged) {
                setResult("Ayo, we don't do that here. Please keep it clean and respectful.")
                setIsLoading(false)
                return
            }
        } catch (error) {
            console.error(error)
            setIsLoading(false)
            return
        }

        try {
            const message = await queryGpt(query)

            setResult(message)
            console.log(message)
        } catch (error) {
            console.error(error)
            return
        }

        setIsLoading(false)
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
                        <button disabled={isLoading} type="submit" className="flex items-center disabled:cursor-not-allowed absolute right-2 bottom-2 justify-center p-2 bg-zinc-800 rounded-md ml-2">
                            <IoArrowUpCircleOutline className="text-white text-lg" />
                        </button>
                    </div>
                </div>
                {
                    result ?
                        <div className="w-full mt-4">
                            <Label className="text-white text-sm font-bold">Response</Label>
                            <ReactMarkdown className="mt-2 w-full text-sm gpt-result px-3 py-2 border-zinc-800 border rounded-md">{result}</ReactMarkdown>
                        </div>
                        : isLoading ? <SuspenseComponent /> : null
                }
                <AuthorPlug />
            </form>
        </div>
    )
}