import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, STRATEGY_SYSTEM_PROMPT, generateUserPrompt, generateStrategyPrompt, WRITING_GUIDE_HEADER } from "@/lib/prompts";
import fs from "fs";
import path from "path";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { data, questionIndex, mode } = body;
        const { basicInfo, projects, deepDiveAnswers, tone, strategy, userProfile } = data;

        // Mode 1: Strategize (Question-Project Mapping)
        if (mode === "STRATEGIZE") {
            const response = await anthropic.messages.create({
                model: "claude-opus-4-5-20251101",
                max_tokens: 2000,
                system: STRATEGY_SYSTEM_PROMPT,
                messages: [
                    { role: "user", content: generateStrategyPrompt(data) },
                ],
                temperature: 0.3,
            });

            const content = response.content[0].type === "text" ? response.content[0].text : "";
            if (!content) throw new Error("AI did not return any strategy content");

            // Claude returns a string. We need to extract the JSON part if it includes markdown blocks
            let jsonString = content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonString = jsonMatch[0];
            }

            let strategyArray: any[] = [];
            try {
                const parsed = JSON.parse(jsonString);
                if (Array.isArray(parsed)) {
                    strategyArray = parsed;
                } else if (parsed.strategy && Array.isArray(parsed.strategy)) {
                    strategyArray = parsed.strategy;
                } else {
                    const firstArray = Object.values(parsed).find(val => Array.isArray(val));
                    strategyArray = (firstArray as any[]) || [];
                }
            } catch (pErr) {
                console.error("JSON Parse Error:", pErr, "Raw Content:", content);
                throw new Error("전략 데이터 파싱에 실패했습니다.");
            }

            return NextResponse.json({ strategy: strategyArray });
        }

        // Mode 2: Generate (Writing the Draft)
        if (questionIndex === undefined) {
            return NextResponse.json({ error: "questionIndex is required for GENERATE mode" }, { status: 400 });
        }

        const interviewDataContent = { basicInfo, projects, deepDiveAnswers, tone, strategy, userProfile };

        // Load refined tips for cached input
        let refinedTips = "";
        try {
            const tipsPath = path.join(process.cwd(), "docs", "knowledge-base.md");
            refinedTips = fs.readFileSync(tipsPath, "utf-8");
        } catch (err) {
            console.error("Failed to load knowledge base:", err);
        }

        const response = await (anthropic.messages.create as any)({
            model: "claude-opus-4-5-20251101",
            max_tokens: 4000,
            system: [
                {
                    type: "text",
                    text: SYSTEM_PROMPT,
                },
                {
                    type: "text",
                    text: WRITING_GUIDE_HEADER + "\n" + refinedTips,
                    cache_control: { type: "ephemeral" },
                }
            ],
            messages: [
                { role: "user", content: generateUserPrompt(interviewDataContent, questionIndex) },
            ],
            temperature: 0.7,
        });

        const draft = response.content[0].type === "text" ? response.content[0].text : "";

        if (!draft) {
            throw new Error("AI did not return any content");
        }

        return NextResponse.json({ draft });
    } catch (error: any) {
        console.error("Claude API Error:", error);
        return NextResponse.json(
            { error: error.message || "알 수 없는 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}


