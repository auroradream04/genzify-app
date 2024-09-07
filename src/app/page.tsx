import Hero from "./components/Hero";
import QueryGPT from "./components/QueryGPT";

export default async function Home() {

    return (
        <div className="w-full min-h-dvh flex flex-wrap justify-center items-center p-4 sm:p-10 lg:p-20 xl:p-40 relative">
            <div className="w-full flex flex-wrap justify-center">
                <Hero />
                <QueryGPT />
            </div>
        </div>
    );
}

