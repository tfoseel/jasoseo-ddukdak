import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    try {
        const stripeKey = process.env.STRIPE_SECRET_KEY;

        if (!stripeKey) {
            return NextResponse.json(
                { error: "Stripe API Key가 설정되지 않았습니다. .env.local 파일을 확인해주세요." },
                { status: 500 }
            );
        }

        const stripe = new Stripe(stripeKey, {
            apiVersion: "2024-12-18.acacia" as any,
        });

        const { items } = await req.json();


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "krw",
                        product_data: {
                            name: "자소서 뚝딱 - 프리미엄 초안 생성",
                            description: "AI가 작성하는 고퀄리티 맞춤형 자기소개서 초안",
                        },
                        unit_amount: 9900, // 9,900 KRW
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get("origin")}/interview`,
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json(
            { error: error.message || "결제 세션 생성 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
