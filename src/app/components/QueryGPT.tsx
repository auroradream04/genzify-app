'use client'

import { useEffect, useState } from "react"
import { queryGpt } from "../utils/queryGpt"
import ReactMarkdown from 'react-markdown';
import hljs from "highlight.js";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import SuspenseComponent from "./SuspenseComponent";

export default function QueryGPT() {
    const [query, setQuery] = useState<string>("")
    const [result, setResult] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setResult("")
        const message = await queryGpt(query)
        setResult(message)
        setIsLoading(false)

        console.log(message)
    }

    // Highlight code blocks in the result via highlight.js
    useEffect(() => {
        hljs.highlightAll();
    }, [result]);

    return (
        <div className="w-full justify-center flex">
            <form className="w-full max-w-[800px] min-h-60 rounded-sm" onSubmit={handleSubmit}>
                <div className="w-full mb-4">
                    <Label className="text-sm font-bold mb-2">Ask me anything</Label>
                    <Textarea className="w-full px-4 py-2" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                {
                    result ?
                        <div className="w-full">
                            <Label className="text-sm font-bold mb-2">Response</Label>
                            <ReactMarkdown className="w-full text-sm gpt-result px-3 py-2 border-zinc-800 border rounded-md">{result}</ReactMarkdown>
                        </div>
                        : isLoading ? <SuspenseComponent /> : null
                }
            </form>
        </div>
    )
}