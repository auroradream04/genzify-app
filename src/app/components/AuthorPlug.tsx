import Link from "next/link";

export default function AuthorPlug() {
    return (
        <div className="w-full text-[9px] mt-2">
            <span className="text-[rgb(150,150,150)]">
                MADE WITH ❤️ BY
            </span>
            <Link className="pl-1 underline text-blue-500 hover:text-purple-500 transition" href={"https://github.com/auroradream04/"}>
                AURORA
            </Link>
        </div>
    )
}