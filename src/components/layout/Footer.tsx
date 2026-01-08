import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterProps {
    className?: string;
}

export function Footer({ className }: FooterProps) {
    return (
        <footer className={cn("py-12 border-t border-gray-100 bg-white", className)}>
            <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
                <div className="text-xs text-gray-400 space-y-1.5 leading-relaxed">
                    <p className="font-bold text-gray-500">리소프트 (Leesoft)</p>
                    <p>대표자: 이승우 | 사업자등록번호: 419-37-01612</p>
                    <p>주소: 서울특별시 양천구 지양로9길 23</p>
                    <p>문의: smilelee9@naver.com</p>
                </div>

                <div className="flex justify-center gap-6 text-[10px] text-gray-400 font-medium">
                    <Link href="/terms" className="hover:text-gray-600 underline underline-offset-2">
                        이용약관 및 환불규정
                    </Link>
                    <span>© 2026 Leesoft. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}
