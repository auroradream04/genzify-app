'use client'

import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

// Retrieve conversation history from localStorage (or initialize if not found)
export const getConversationHistory = () => {
    const conversation = localStorage.getItem('conversationHistory');
    return conversation ? JSON.parse(conversation) : [];
};

// Save the updated conversation history to localStorage
export const saveConversationHistory = (history: ChatCompletionMessageParam[]) => {
    localStorage.setItem('conversationHistory', JSON.stringify(history));
};