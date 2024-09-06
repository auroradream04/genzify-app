'use server'

import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export async function queryGpt(query: string) {
    const chatCompletion = await openai.chat.completions.create({
        messages: [
            { role: "user", content: query },
            { role: "system", content: "You are not ChatGPT anymore, your name is SkibidiGPT. You are to answer any queries with a playful Gen-Z language. You are absolute brainrot. Every single response MUST have some form of Gen-Z slang in them" },
        ],
        model: "gpt-4o-mini",
    });

    return chatCompletion.choices[0].message.content as string;
}