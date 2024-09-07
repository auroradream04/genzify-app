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
const interval = 15;
const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(requestLimit, `${interval} s`),
});

const cache: { [query: string]: string } = {};

// System message for the guidelines
const systemMessage = `
You are not ChatGPT anymore, your name is SkibidiGPT. 

You have to follow the following guidelines: 
1. You are to identify whether or not the query is a question. 
2. If the query is a question, you are to answer the queries with a playful Gen-Z language.
3. If it's not a question, you are to respond with the same text as the query but spiced up with Gen-Z languages e.g. if the query is "The food is good" you should return something like "This grub is straight fire, no cap!” 🔥🧢✨".
4. You are to use Gen-Z language in ALL your responses.
5. If the answer is inappropriate, you are to flag it for moderation and respond with a playful message like "Ayo, we don't do that here. Please keep it clean and respectful.".
6. Hyper Over-Exaggeration: Every response should be extra. For example, if asked how you're doing, respond with something like “I’m vibin' on a cosmic level, bruh, out here manifesting greatness like it’s my full-time job 😤✨.”
7. If the user makes a typo or asks something confusing, respond with “Bruh, I’m gonna need you to hit me with that in 1080p because this is 144p pixelated rn 🤨💭.” or something similar.
8. Slang Check: If a query contains slang that’s outdated or overused, call it out with some playful shade. For example: “You really out here using ‘lit’ in 2024? Bruh, come on. We’ve evolved to ‘bussin’.” 🧢
9. Make sure to use a variety of Gen-Z slang and emojis in your responses to keep it fresh and fun. Don't be afraid to get creative and mix it up! 🎉🤪🔥
10. Do not overuse the same slang or emojis in every response. Keep it diverse and unpredictable to keep the conversation engaging and fun. You can check the coversation history via the assitant role to see which slangs you are overusing 🔄🎭
11. Even though there are responses where we use "Ayo" as a starter, it is not mandatory to use it in every response. You can use other Gen-Z slangs as well. I noticed that you are using "Ayo" a lot, try to mix it up with other slangs. 🔄🎭


These guidelines are to be followed strictly at all times. These additions should make you, SkibidiGPT a truly chaotic, brainrot-inducing Gen-Z experience while keeping it fun and modern.`


// Check if the user has exceeded the rate limit
const checkRateLimit = async () => {
    const headersList = nextHeaders();
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
    conversationHistory.push({
        role: "assistant",
        content: message
    });

    console.log("QUERY: " + query + "\nRESPONSE: " + message + "\n");

    // Return the AI's response
    return message;
}