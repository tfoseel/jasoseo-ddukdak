# KakaoPay Test Payment Integration Plan

## Goal
Implement a test payment flow using KakaoPay's **single payment (단건 결제)** API in the Next.js app. The flow includes:
1. **Payment Ready** – request a payment and obtain a `tid` and redirect URL.
2. **Redirect to KakaoPay** – open the KakaoPay payment page for the user.
3. **Payment Approve** – after the user completes payment, KakaoPay redirects back with a `pg_token`; we confirm the payment.
4. **Result Page** – show success/failure to the user.

## Required Environment Variables (already added to `.env.local`)
```
KAKAOPAY_CLIENT_ID=42C2CB180DBE33CEC22A
KAKAOPAY_CLIENT_SECRET=3EDC5AC55DE5F10B49F0재발급
KAKAOPAY_SECRET_KEY_DEV=DEV58A6E88E547BF8549DE65F8DE9426EAFA0C08재발급
KAKAOPAY_CID=TC0ONETIME   # test CID, no real merchant registration needed
```
These values are loaded via `process.env`.

## Implementation Steps
1. **Create a utility module** `src/lib/kakaoPay.ts`
   - Export `readyPayment`, `approvePayment`, and optionally `cancelPayment`.
   - Use `node-fetch` (or native `fetch` in Next.js 13) to call KakaoPay endpoints.
   - Include required headers:
     ```ts
     const headers = {
       "Authorization": `KakaoAK ${process.env.KAKAOPAY_CLIENT_ID}`,
       "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
     };
     ```
   - Body parameters (URL‑encoded) for **Ready**:
     - `cid` – `process.env.KAKAOPAY_CID`
     - `partner_order_id` – a unique order identifier (e.g., `order_${Date.now()}`)
     - `partner_user_id` – the current user id (or a placeholder)
     - `item_name` – description of the service (e.g., `Resume Generation`)
     - `quantity` – `1`
     - `total_amount` – test amount, e.g., `1000`
     - `vat_amount` – `0`
     - `tax_free_amount` – `0`
     - `approval_url`, `cancel_url`, `fail_url` – URLs that KakaoPay will redirect to after the user action.
   - Return the JSON response which contains `tid` and `next_redirect_pc_url`.

2. **Create API routes** under `src/app/api/kakao/pay`:
   - `ready/route.ts` – POST handler that calls `readyPayment` and returns `{tid, redirectUrl}`.
   - `approve/route.ts` – POST handler that receives `{tid, pg_token}` from the client (after redirect) and calls `approvePayment`.
   - Both routes should use the **dev secret key** for authentication (`KAKAOPAY_SECRET_KEY_DEV`). The secret key is sent in the `Authorization` header as `KakaoAK <secret>` when using the **test** environment.

3. **Client‑side page** `src/app/kakao/pay/page.tsx` (or a component on the success page):
   - When the user clicks **“결제하기”**, call `/api/kakao/pay/ready`.
   - Receive `redirectUrl` and open it in a new window (or `window.location.href`).
   - KakaoPay will redirect back to the URLs you supplied. Use the `approval_url` to point to a new Next.js page `src/app/kakao/pay/callback/page.tsx`.
   - In the callback page, read query parameters `tid` and `pg_token`, then POST to `/api/kakao/pay/approve`.
   - Show a loading spinner while awaiting the approval response, then display success or error.

4. **Add UI components**:
   - `KakaoPayButton.tsx` – a simple button that triggers the ready call.
   - `PaymentResult.tsx` – displays the result message.

5. **Update `next.config.js`** (if needed) to allow the KakaoPay domain for redirects during development:
   ```js
   module.exports = {
     async redirects() {
       return [
         {
           source: '/kakao/pay/callback',
           destination: '/kakao/pay/callback',
           permanent: false,
         },
       ];
     },
   };
   ```

6. **Testing**
   - Run the dev server (`npm run dev`).
   - Navigate to the payment page, click the button, and you should be taken to KakaoPay's sandbox UI.
   - Complete the payment using the test credentials (KakaoPay provides a dummy card number `1234-5678-9012-3456`).
   - Verify that the callback receives a `pg_token` and the approval request succeeds (response includes `aid`, `tid`, `status`).

## Security Notes
- Never commit `.env.local` – it is now excluded from Git thanks to the `.gitignore` rule.
- In production replace the dev CID (`TC0ONETIME`) and dev secret key with the real merchant CID and secret.
- Keep the `KAKAOPAY_CLIENT_SECRET` and `KAKAOPAY_SECRET_KEY_DEV` on the server side only; never expose them to the client.

## Verification Checklist
- [ ] `.env.local` contains the four variables (already added).
- [ ] `.gitignore` allows `.env.local` (`!.env.local`).
- [ ] `src/lib/kakaoPay.ts` implements the three helper functions.
- [ ] API routes `/api/kakao/pay/ready` and `/api/kakao/pay/approve` exist and return proper JSON.
- [ ] Front‑end button triggers the flow and redirects correctly.
- [ ] Callback page processes `pg_token` and shows success.
- [ ] Lint passes (`npm run lint`).

Once you approve this plan, I will create the files and code snippets.
