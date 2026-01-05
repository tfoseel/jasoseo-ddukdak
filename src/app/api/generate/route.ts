import { NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT, generateUserPrompt } from "@/lib/prompts";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { basicInfo, projects, deepDiveAnswers, tone, questionIndex } = body;

        if (questionIndex === undefined) {
            return NextResponse.json({ error: "questionIndex is required" }, { status: 400 });
        }

        // Wrap the full interview data for the prompt generator
        const interviewDataContent = { basicInfo, projects, deepDiveAnswers, tone };

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: generateUserPrompt(interviewDataContent, questionIndex) },
            ],
            temperature: 0.7,
        });

        const draft = response.choices[0].message.content;

        if (!draft) {
            throw new Error("AI did not return any content");
        }

        return NextResponse.json({ draft });
    } catch (error: any) {
        console.error("OpenAI Error:", error);
        return NextResponse.json(
            { error: error.message || "알 수 없는 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}

