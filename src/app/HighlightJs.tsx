'use client'

import hljs from "highlight.js";
import { useEffect } from "react";

export default function HighlightJs() {
    useEffect(() => {
        hljs.highlightAll();
    }, []);

    return null;
}