"use client";

import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export default function KakaoPayCancelPage() {
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
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-gray-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900">결제가 취소되었습니다</h1>
                        <p className="text-gray-500 break-keep">
                            사용자가 결제를 취소했습니다.<br />다시 진행하시려면 아래 버튼을 눌러주세요.
                        </p>
                    </div>

                    <div className="grid gap-3">
                        <Button
                            onClick={() => router.push("/preview")}
                            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold"
                        >
                            다시 결제하기
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
