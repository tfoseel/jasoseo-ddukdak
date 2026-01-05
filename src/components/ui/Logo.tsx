import { Sparkles } from "lucide-react";

export function Logo() {
    return (
        <div className="flex items-center gap-2 group cursor-default">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-white fill-white/20" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">자소서 뚝딱</span>
        </div>
    );
}
