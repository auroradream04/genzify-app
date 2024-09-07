'use client'

import React, { useEffect, useState, useRef } from "react"
import { moderationGpt, queryGpt } from "../utils/fetchGpt"
import ReactMarkdown from 'react-markdown';
import hljs from "highlight.js";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import SuspenseComponent from "./SuspenseComponent";
import { IoArrowUpCircleOutline, IoCopyOutline } from "react-icons/io5";
import { MdRestartAlt } from "react-icons/md";
import AuthorPlug from "./AuthorPlug";
import { toast } from "sonner";
import { getConversationHistory } from "../utils/localStorage";


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
                toast.error('Please don\'t leave the query blank homie 🗿', {
                    description: 'You can’t just leave me hanging like that, fam! 🤨',
                    classNames: {
                        icon: "text-red-700",
                    }
                });
                setIsLoading(false)
                return
            }, 1000);
        } else {
            // Use the last query if the reset button is clicked
            const chatQuery = reset ? lastQuery : query

            // Check if the query is flagged for moderation
            try {
                const isFlagged = await moderationGpt(chatQuery)

                if (isFlagged) {
                    setResult("Ayo, we don't do that here. Please keep it clean and respectful. 🙅‍♂️")
                    toast.error('Please keep it clean and respectful 🚫', {
                        description: 'We don’t do that here, fam! 🙅‍♂️',
                        classNames: {
                            icon: "text-red-700",
                        }
                    });
                    setIsLoading(false)
                    return
                }
            } catch (error) {
                console.error(error)
                setIsLoading(false)
                return
            }

            try {
                // Get conversation history from localStorage
                let conversationHistory = getConversationHistory();

                // Get the response from the GPT model
                const message = await queryGpt(chatQuery, conversationHistory)

                // Save the updated conversation history to localStorage
                conversationHistory.push({
                    role: "assistant",
                    content: `QUERY: ${query}\nRESPONSE: ${message}`
                })

                localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));

                // Set the result and last query
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

    // Copy the result to the clipboard
    const handleCopy = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        navigator.clipboard.writeText(result).then(() => {
            toast.success('Copied to clipboard! 📋', {
                description: 'You can flex that result wherever you want, fam! ✨💅'
            });
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    // Automatically grow the textarea as the user types
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const maxHeight = 200;

    const autoGrow = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (textareaRef.current && textareaRef.current.scrollHeight < maxHeight && textareaRef.current.scrollHeight > textareaRef.current.clientHeight) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }

    useEffect(() => {
        autoGrow({ target: textareaRef.current! } as React.ChangeEvent<HTMLTextAreaElement>)
    }, [query])

    // Highlight code blocks in the result via highlight.js
    useEffect(() => {
        hljs.highlightAll();
    }, [result]);

    const buttonCss = "p-1.5 disabled:cursor-not-allowed transition disabled:text-[rgb(130,130,130)] text-white bg-zinc-800 disabled:bg-zinc-900 rounded-md"

    // Random placeholder for the query input
    const queryPlaceholderList = [
        "Ayo, what’s the tea? 👀✨",
        "What’s the vibe check today? 🎉🕺",
        "Spill the tea, I’m all ears! 🍵👀",
        "What’s poppin’ in your world? 🌍✨",
        "Hit me with your hot takes! 🔥💬",
        "What’s the scoop, fam? 🥤🤩",
        "Lay it on me, no cap! 📣💯",
        "911, what's your emergency? 📞🚑",
        "Got any juicy deets to share? 🍑🤭",
        "What’s the mood today? 💖🌈",
        "Hit me with some fire words! 🔥🔥",
        "Mix, match, and make it vibe! 🎉💥 Which one’s your fave?",
    ]
    
    const randomPlaceholder = queryPlaceholderList[Math.floor(Math.random() * queryPlaceholderList.length)]

    return (
        <div className="w-full justify-center flex translate-y-10 sm:translate-y-0 sm:static">
            <form className="w-full max-w-[800px] min-h-60 rounded-sm" onSubmit={handleSubmit}>
                <div className="w-full">
                    <Label className="text-white text-sm font-bold">GenZify anything</Label>
                    <div className="flex relative mt-2">
                        <Textarea ref={textareaRef} disabled={isLoading} className="flex-1 w-full px-4 pr-20 py-2 h-[80px] min-h-[80px]" value={query} placeholder={randomPlaceholder} onChange={(e) => setQuery(e.target.value)} />
                        <div className="flex items-center absolute right-2 bottom-2 justify-center">
                            <button disabled={isLoading} type="submit" className={`${buttonCss} p-2`}>
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
                            <div className="flex items-center mt-2 text-[13px]">
                                <button onClick={handleCopy} className={`${buttonCss} mr-1`}>
                                    <IoCopyOutline size={14} className="-scale-x-100" />
                                </button>
                                <button onClick={(e) => handleSubmit(e, true)} disabled={isLoading || lastQuery.length === 0} type="reset" className={`${buttonCss}`}>
                                    <MdRestartAlt size={14} className="" />
                                </button>
                            </div>
                        </div>
                        : isLoading ? <SuspenseComponent /> : null
                }
                <AuthorPlug />
            </form>
        </div>
    )
}