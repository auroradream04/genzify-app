import Image from "next/image"
import DynamicTagline from "./DynamicTagline"

export default function Hero() {
    const title = "Welcome to GenZify🗿"

    const taglines = [
        "Bet your AI isn’t this lit—turning mid-code into GOAT-level status 🐐⚡.",
        "Your code's been mewing, now it’s an absolute gigachad 🧠💪.",
        "Turning your mid texts into giga-level mews—AI flexing hard. 🚀",
        "GenZ-ify your code, unlock your inner gigachad. No mew, no gain. 💪🚀",
        "Making your texts absolute gigachad material, one mew at a time. 🧠✨",
        "Why code like a boomer? GenZify makes it lit 🔥🦾.",
        "Mewing your code to gigachad status—no cap, just pure gains. 🦾💯",
        "AI that’s mewing harder than a Chad on leg day. 🏋️‍♂️🔥",
        "Mewing texts and codes into giga-status—don’t let them stay NPC. 🦾👾",
    ];


    return (
        <div className="w-full flex justify-center items-center max-w-[800px]">
            <div className="max-w-52 sm:max-w-72 md:max-w-80">
                <Image src="/giga-chad.png" width={1600} height={1200} alt="Hero" className="w-full" />
            </div>
            <div className="flex-1">
                {/* create a hero title and tagline for this GenZify app (use gen-z language)*/}
                <h1 className="text-4xl font-bold text-white mb-1">{title}</h1>
                <DynamicTagline taglines={taglines} />
                <p className="text-[9px] uppercase text-[rgb(150,150,150)]">Powered by AI 🤖✨</p>
            </div>
        </div>
    )
}