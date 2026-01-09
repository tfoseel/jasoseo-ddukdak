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
            className="w-full h-14 bg-[#FEE500] hover:bg-[#FDD000] text-gray-900 font-bold rounded-2xl transition-colors"
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    결제 준비 중...
                </>
            ) : (
                <>
                    <img
                        src="/images/kakaopay-badge.png"
                        alt="KakaoPay"
                        className="h-7 w-auto mr-2"
                    />
                    카카오페이로 결제하기
                </>
            )}
        </Button>
    );
}
