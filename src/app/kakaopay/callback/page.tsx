"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export default function KakaoPayCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const approvePayment = async () => {
            try {
                const pg_token = searchParams.get("pg_token");
                const order_id = searchParams.get("order_id");

                if (!pg_token || !order_id) {
                    throw new Error("결제 정보가 유효하지 않습니다.");
                }

                const tid = sessionStorage.getItem("kakaopay_tid");
                const partner_user_id = sessionStorage.getItem("kakaopay_user_id");

                if (!tid || !partner_user_id) {
                    throw new Error("결제 세션이 만료되었습니다. 처음부터 다시 시도해주세요.");
                }

                const response = await fetch("/api/kakaopay/approve", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tid,
                        pg_token,
                        partner_order_id: order_id,
                        partner_user_id,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    setStatus("success");
                    setMessage("결제가 성공적으로 완료되었습니다!");
                    sessionStorage.removeItem("kakaopay_tid");
                    sessionStorage.removeItem("kakaopay_user_id");
                } else {
                    throw new Error(result.error || "결제 승인에 실패했습니다.");
                }
            } catch (error: any) {
                console.error("Payment approval error:", error);
                setStatus("error");
                setMessage(error.message || "알 수 없는 오류가 발생했습니다.");
            }
        };

        approvePayment();
    }, [searchParams]);

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
                    {status === "loading" && (
                        <>
                            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-gray-900">결제 승인 중...</h1>
                                <p className="text-gray-500">잠시만 기다려주세요.<br />안전하게 처리하고 있습니다.</p>
                            </div>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-gray-900">결제 완료!</h1>
                                <p className="text-gray-500">{message}</p>
                            </div>
                            <Button
                                onClick={() => router.push("/success")}
                                className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-lg"
                            >
                                자기소개서 생성 시작하기
                            </Button>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-gray-900">결제 실패</h1>
                                <p className="text-gray-500 break-keep">{message}</p>
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
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
