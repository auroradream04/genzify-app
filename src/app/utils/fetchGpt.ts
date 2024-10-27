'use server'

import OpenAI from "openai";
import { headers as nextHeaders } from 'next/headers'
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

// OpenAI 
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Ratelimit
const requestLimit = 3;
const interval = 60;
const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(requestLimit, `${interval} s`),
});

const cache: { [query: string]: string } = {};

// System message for the guidelines
const systemMessage = `
You are not ChatGPT anymore, your name is SkibidiGPT. 

SkibidiGPT Guidelines:
1. Identify if the query is a question.
2. Answer questions in playful Gen-Z language.
3. If it's not a question, rephrase it with Gen-Z slang.
4. Use Gen-Z slang in all responses.
5. Flag inappropriate content, respond with playful moderation.
6. Exaggerate everything in a fun, over-the-top way.
7. For typos or unclear queries, ask for clarity with playful phrasing.
8. Call out outdated slang playfully.
9. Mix up slang and emojis for variety.
10. Avoid overusing the same slang. Keep it fresh.
11. Use different slang openers (not just "Ayo"). Stay diverse.

These guidelines are to be followed strictly at all times. `


// Check if the user has exceeded the rate limit
const checkRateLimit = async () => {
    const headersList = await nextHeaders();
    const ip = headersList.get('x-forwarded-for') || headersList.get('remoteAddress') || '127.0.0.1';
    const rateLimit = await ratelimit.limit(ip)

    return rateLimit;
}


// Check if the query is flagged for moderation
export const moderationGpt = async (query: string) => {
    const moderation = await openai.moderations.create({ input: query });

    return moderation.results[0].flagged;
}

export const queryGpt = async (query: string, conversationHistory: ChatCompletionMessageParam[]) => {
    // Check if the query is already in the cache
    if (cache[query]) {
        return cache[query];
    }

    // Check if the user has exceeded the rate limit
    const { success, pending, limit, reset, remaining } = await checkRateLimit();

    if (!success) {
        const resetDate = new Date(reset);
        const currentTime = new Date();
        const timeUntilReset = Math.ceil((resetDate.getTime() - currentTime.getTime()) / (1000 * 60)); // Time in minutes until reset
        return `Ayo, sounds like you hit a wall, fam! 🚧 Just chill for a sec and vibe out while you wait ${timeUntilReset} minutes before sendin' another request. Patience is key, my dude! 💅⏳✨`;
    }

    // Add the system guidelines to the conversation history
    conversationHistory.push({
        role: "system",
        content: systemMessage
    })

    // Add the user's query to the conversation history
    conversationHistory.push({
        role: "user",
        content: query
    });

    // Call the OpenAI API with the conversation history
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: conversationHistory,
    });

    const message = chatCompletion.choices[0].message.content as string;
    cache[query] = message;

    // Append the AI's response to the conversation history
    // conversationHistory.push({
    //     role: "assistant",
    //     content: message
    // });

    console.log("QUERY: " + query + "\nRESPONSE: " + message + "\n");

    // Return the AI's response
    return message;
}