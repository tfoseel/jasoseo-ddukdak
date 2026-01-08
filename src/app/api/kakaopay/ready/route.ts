import { NextResponse } from "next/server";
import { readyPayment } from "@/lib/kakaopay";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { item_name, total_amount, user_id } = body;

        if (!item_name || !total_amount) {
            return NextResponse.json(
                { error: "item_name and total_amount are required" },
                { status: 400 }
            );
        }

        const partner_order_id = `order_${Date.now()}`;
        const partner_user_id = user_id || "guest";

        const origin = req.headers.get("origin");
        const baseUrl = origin || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        const result = await readyPayment({
            partner_order_id,
            partner_user_id,
            item_name,
            quantity: 1,
            total_amount,
            tax_free_amount: 0,
            approval_url: `${baseUrl}/kakaopay/callback?order_id=${partner_order_id}`,
            cancel_url: `${baseUrl}/kakaopay/cancel`,
            fail_url: `${baseUrl}/kakaopay/fail`,
        });

        return NextResponse.json({
            tid: result.tid,
            redirect_url: result.next_redirect_pc_url,
            mobile_redirect_url: result.next_redirect_mobile_url,
            partner_order_id,
            partner_user_id,
        });
    } catch (error: any) {
        console.error("KakaoPay Ready Error:", error);
        return NextResponse.json(
            { error: error.message || "Payment preparation failed" },
            { status: 500 }
        );
    }
}
