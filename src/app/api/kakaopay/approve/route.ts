import { NextResponse } from "next/server";
import { approvePayment } from "@/lib/kakaopay";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { tid, pg_token, partner_order_id, partner_user_id } = body;

        if (!tid || !pg_token || !partner_order_id || !partner_user_id) {
            return NextResponse.json(
                { error: "tid, pg_token, partner_order_id, and partner_user_id are required" },
                { status: 400 }
            );
        }

        const result = await approvePayment({
            tid,
            pg_token,
            partner_order_id,
            partner_user_id,
        });

        return NextResponse.json({
            success: true,
            payment: result,
        });
    } catch (error: any) {
        console.error("KakaoPay Approve Error:", error);
        return NextResponse.json(
            { error: error.message || "Payment approval failed" },
            { status: 500 }
        );
    }
}
