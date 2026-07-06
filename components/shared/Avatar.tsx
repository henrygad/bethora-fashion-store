import { UserRound } from "lucide-react";

export default function Avatar({
    src, alt = "", className = "w-10 h-10", iconSize = 20,
}: { src?: string; alt?: string; className?: string; iconSize?: number }) {
    if (src) {
        return <img src={src} alt={alt} className={`${className} rounded-full object-cover shrink-0`} />;
    }
    return (
        <div className={`${className} rounded-full bg-gray-200 text-gray-400 flex items-center justify-center shrink-0`}>
            <UserRound size={iconSize} />
        </div>
    );
}
