'use server'

import OpenAI from "openai";
import { headers as nextHeaders } from 'next/headers'
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

// OpenAI 
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Ratelimit
const requestLimit = 3;
const interval = 15;
const ratelimit = new Ratelimit({
    redis: kv,


    limiter: Ratelimit.slidingWindow(requestLimit, `${interval} s`),
});

const cache: { [query: string]: string } = {};

export async function queryGpt(query: string, isReset = false) {
    // Check if the query is already in the cache
    if (cache[query] && !isReset) {
        return cache[query];
    }

    // Check if the user has exceeded the rate limit
    const headersList = nextHeaders();
    const ip = headersList.get('x-forwarded-for') || headersList.get('remoteAddress') || '127.0.0.1';
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(
        ip
    );

    if (!success) {
        const resetDate = new Date(reset);
        const currentTime = new Date();
        const timeUntilReset = Math.ceil((resetDate.getTime() - currentTime.getTime()) / (1000 * 60)); // Time in minutes until reset
        return `Ayo, sounds like you hit a wall, fam! 🚧 Just chill for a sec and vibe out while you wait ${timeUntilReset} minutes before sendin' another request. Patience is key, my dude! 💅⏳✨`;
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

    return message;
}

export async function moderationGpt(query: string) {
    const moderation = await openai.moderations.create({ input: query });

    return moderation.results[0].flagged;
}