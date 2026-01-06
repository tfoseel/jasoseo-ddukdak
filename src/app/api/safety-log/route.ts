import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { data, email } = body;

        // [SAFETY_RESTORE_LOG] 프리픽스를 붙여 로그를 남깁니다.
        // Vercel Logs 등에서 이 프리픽스로 검색하여 데이터를 복원할 수 있습니다.
        console.info(`[SAFETY_RESTORE_LOG] User: ${email || "Unknown"} | Timestamp: ${new Date().toISOString()}`);
        console.info(JSON.stringify(data));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Safety Log Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
