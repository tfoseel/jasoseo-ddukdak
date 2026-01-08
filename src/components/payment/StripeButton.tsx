"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/Button";
import { Loader2, CreditCard } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeButtonProps {
    price: number;
}

export function StripeButton({ price }: StripeButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        try {
            setIsLoading(true);
            const stripe = await stripePromise;
            if (!stripe) throw new Error("Stripe failed to initialize.");

            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: [{ id: "premium-plan", quantity: 1, price }] }),
            });

            const { sessionId, error } = await response.json();
            if (error) throw new Error(error);

            const result = await (stripe as any).redirectToCheckout({ sessionId });
            if (result.error) throw new Error(result.error.message);

        } catch (error: any) {
            console.error("Stripe Checkout Error:", error);
            alert(error.message || "결제 세션 생성 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleCheckout}
            disabled={isLoading}
            variant="outline"
            className="w-full h-14 bg-white text-gray-900 border-gray-200 hover:bg-gray-50 font-bold"
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Stripe 결제 준비 중...
                </>
            ) : (
                <>
                    <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
                    카드 결제 (Stripe)
                </>
            )}
        </Button>
    );
}
