import Hero from "./components/Hero";
import QueryGPT from "./components/QueryGPT";

export default async function Home() {
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
        <div className="w-full min-h-dvh flex flex-wrap justify-center items-center p-4 sm:p-10 lg:p-20 xl:p-40 relative">
            <div className="w-full flex flex-wrap justify-center">
                <Hero />
                <QueryGPT placeholder={randomPlaceholder} />
            </div>
        </div>
    );
}

