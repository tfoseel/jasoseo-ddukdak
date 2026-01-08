"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

interface KakaoPayButtonProps {
    itemName: string;
    amount: number;
    userId?: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function KakaoPayButton({ itemName, amount, userId, onSuccess, onError }: KakaoPayButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async () => {
        try {
            setIsLoading(true);

            const response = await fetch("/api/kakaopay/ready", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    item_name: itemName,
                    total_amount: amount,
                    user_id: userId || "guest",
                }),
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            // Store payment info in sessionStorage for callback
            sessionStorage.setItem("kakaopay_tid", result.tid);
            sessionStorage.setItem("kakaopay_user_id", result.partner_user_id);

            // Redirect to KakaoPay payment page
            window.location.href = result.redirect_url;
        } catch (error: any) {
            console.error("Payment initiation error:", error);
            onError?.(error.message || "결제 시작 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold"
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    결제 준비 중...
                </>
            ) : (
                <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3C6.48 3 2 6.93 2 11.75c0 2.89 1.86 5.43 4.65 6.89-.06.52-.4 2.04-.46 2.37 0 0-.03.25.13.35.16.09.35.01.35.01.46-.06 5.31-3.47 6.16-4.05.39.05.79.08 1.17.08 5.52 0 10-3.93 10-8.75S17.52 3 12 3z" />
                    </svg>
                    카카오페이로 결제하기
                </>
            )}
        </Button>
    );
}
