import Hero from "./components/Hero";
import QueryGPT from "./components/QueryGPT";

export default async function Home() {

    return (
        <div className="w-full min-h-dvh flex flex-wrap justify-center p-4 sm:p-10 lg:p-20 xl:p-40">
            <Hero />
            <QueryGPT />
        </div>
    );
}

