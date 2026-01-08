import { Sparkles } from "lucide-react";

export function Logo() {
    return (
        <div className="flex items-center gap-2 group cursor-default">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img src="/favicon.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">자소서 뚝딱</span>
        </div>
    );
}
