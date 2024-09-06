'use client'

import { useEffect, useState } from "react"
import { queryGpt } from "./utils/queryGpt"
import ReactMarkdown from 'react-markdown';
import hljs from "highlight.js";

export default function QueryGPT() {
    const [query, setQuery] = useState<string>("")
    const [result, setResult] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const message = await queryGpt(query)
        setResult(message)

        console.log(message)
    }

    // Highlight code blocks in the result via highlight.js
    useEffect(() => {
        hljs.highlightAll();
    }, [result]);

    return (
        <form className="p-4 w-[800px] min-h-60 border border-[rgb(70,70,70)] rounded-sm" onSubmit={handleSubmit}>
            <input className="w-full px-4 py-2 outline-none bg-[rgb(50,50,50)] hover:bg-[rgb(100,100,100)] transiiton ease-linear" type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
            <ReactMarkdown className="w-full text-sm gpt-result">{result}</ReactMarkdown>
        </form>
    )
}