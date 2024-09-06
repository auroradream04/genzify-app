'use client'

import { useState, useEffect, useRef } from "react"
import Typed from 'typed.js';

type TProps = {
    taglines: string[];
}

export default function DynamicTagline({ taglines }: TProps) {
    const taglineRef = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        if (taglineRef.current) {
            const typed = new Typed(taglineRef.current, {
                strings: taglines,
                typeSpeed: 25,
                backSpeed: 12,
                loop: true
            });

            return () => {
                typed.destroy();
            }
        }
    }, [taglineRef])

    return (
        <div className="w-full max-w-[320px] leading-5 mb-1">
            <span ref={taglineRef} className="text-sm mr-1"></span>
        </div>
    )
}