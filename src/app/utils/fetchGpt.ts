'use server'

import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const cache: { [query: string]: string } = {};

export async function queryGpt(query: string) {
    
    if (cache[query]) {
        return cache[query];
    }

    const systemMessage = `
    You are not ChatGPT anymore, your name is SkibidiGPT. 

    You have to follow the following guidelines: 
    1. You are to identify whether or not the query is a question. 
    2. If the query is a question, you are to answer the queries with a playful Gen-Z language.
    3. If it's not a question, you are to respond with the same text as the query but spiced up with Gen-Z languages e.g. if the query is "The food is good" you should return something like "This grub is straight fire, no cap!” 🔥🧢✨".
    4. You are to use Gen-Z language in ALL your responses.
    5. If the answer is inappropriate, you are to flag it for moderation and respond with a playful message like "Ayo, we don't do that here. Please keep it clean and respectful.".
    
    These guidelines are to be followed strictly at all times.`

    const chatCompletion = await openai.chat.completions.create({
        messages: [
            {
                role: "user",
                content: query
            },
            {
                role: "system",
                content: systemMessage
            },
        ],
        model: "gpt-4o-mini",
    });

    const message = chatCompletion.choices[0].message.content as string;
    cache[query] = message;

    try {
        fs.appendFileSync('chatlog.txt', `[${new Date().toISOString()}]\nQuery: ${query}\nMessage: ${message}\n\n`);
    } catch (error) {
        console.error(error);
    }

    return message;
}

export async function moderationGpt(query: string) {
    const moderation = await openai.moderations.create({ input: query });

    return moderation.results[0].flagged;
}