"use client";

import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export default function KakaoPayFailPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/">
                        <Logo />
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-[32px] border border-gray-100 shadow-xl p-10 text-center space-y-6">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900">결제 실패</h1>
                        <p className="text-gray-500 break-keep">
                            일시적인 오류로 결제에 실패했습니다.<br />잠시 후 다시 시도해 주세요.
                        </p>
                    </div>

                    <div className="grid gap-3">
                        <Button
                            onClick={() => router.push("/preview")}
                            className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-gray-800 font-bold"
                        >
                            다시 시도하기
                        </Button>
                        <Button
                            onClick={() => router.push("/")}
                            variant="ghost"
                            className="w-full h-14 rounded-2xl font-medium text-gray-500"
                        >
                            홈으로 돌아가기
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
