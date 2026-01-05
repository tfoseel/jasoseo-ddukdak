import { NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT, generateUserPrompt } from "@/lib/prompts";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: generateUserPrompt(data) },
            ],
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;

        if (!content) {
            throw new Error("AI did not return any content");
        }

        // Split by the specific separator defined in the prompt
        const drafts = content
            .split("---DRAFT_SEPARATOR---")
            .map(d => d.trim())
            .filter(Boolean);

        return NextResponse.json({ drafts });
    } catch (error: any) {
        console.error("OpenAI Error:", error);
        return NextResponse.json(
            { error: error.message || "알 수 없는 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
