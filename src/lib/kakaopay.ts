// KakaoPay API utility functions
// Documentation: https://developers.kakaopay.com/docs/payment/online/single-payment

const KAKAOPAY_API_BASE = "https://open-api.kakaopay.com";

interface PaymentReadyRequest {
    partner_order_id: string;
    partner_user_id: string;
    item_name: string;
    quantity: number;
    total_amount: number;
    tax_free_amount?: number;
    approval_url: string;
    cancel_url: string;
    fail_url: string;
}

interface PaymentReadyResponse {
    tid: string;
    next_redirect_pc_url: string;
    next_redirect_mobile_url: string;
    created_at: string;
}

interface PaymentApproveRequest {
    tid: string;
    partner_order_id: string;
    partner_user_id: string;
    pg_token: string;
}

interface PaymentApproveResponse {
    aid: string;
    tid: string;
    cid: string;
    partner_order_id: string;
    partner_user_id: string;
    payment_method_type: string;
    amount: {
        total: number;
        tax_free: number;
        vat: number;
        point: number;
        discount: number;
    };
    item_name: string;
    created_at: string;
    approved_at: string;
}

/**
 * Step 1: Prepare payment and get redirect URL
 */
/**
 * Step 1: Prepare payment and get redirect URL
 */
export async function readyPayment(params: PaymentReadyRequest): Promise<PaymentReadyResponse> {
    const body = {
        cid: process.env.KAKAOPAY_CID!,
        partner_order_id: params.partner_order_id,
        partner_user_id: params.partner_user_id,
        item_name: params.item_name,
        quantity: params.quantity,
        total_amount: params.total_amount,
        tax_free_amount: params.tax_free_amount || 0,
        approval_url: params.approval_url,
        cancel_url: params.cancel_url,
        fail_url: params.fail_url,
    };

    const response = await fetch(`${KAKAOPAY_API_BASE}/online/v1/payment/ready`, {
        method: "POST",
        headers: {
            Authorization: `SECRET_KEY ${process.env.KAKAOPAY_SECRET_KEY_DEV}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`KakaoPay Ready Failed: ${JSON.stringify(error)}`);
    }

    return response.json();
}

/**
 * Step 2: Approve payment after user completes payment
 */
export async function approvePayment(params: PaymentApproveRequest): Promise<PaymentApproveResponse> {
    const body = {
        cid: process.env.KAKAOPAY_CID!,
        tid: params.tid,
        partner_order_id: params.partner_order_id,
        partner_user_id: params.partner_user_id,
        pg_token: params.pg_token,
    };

    const response = await fetch(`${KAKAOPAY_API_BASE}/online/v1/payment/approve`, {
        method: "POST",
        headers: {
            Authorization: `SECRET_KEY ${process.env.KAKAOPAY_SECRET_KEY_DEV}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`KakaoPay Approve Failed: ${JSON.stringify(error)}`);
    }

    return response.json();
}

/**
 * Cancel/Refund payment (optional)
 */
export async function cancelPayment(tid: string, cancel_amount: number, cancel_tax_free_amount = 0) {
    const body = {
        cid: process.env.KAKAOPAY_CID!,
        tid,
        cancel_amount: cancel_amount,
        cancel_tax_free_amount: cancel_tax_free_amount,
    };

    const response = await fetch(`${KAKAOPAY_API_BASE}/online/v1/payment/cancel`, {
        method: "POST",
        headers: {
            Authorization: `SECRET_KEY ${process.env.KAKAOPAY_SECRET_KEY_DEV}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`KakaoPay Cancel Failed: ${JSON.stringify(error)}`);
    }

    return response.json();
}
