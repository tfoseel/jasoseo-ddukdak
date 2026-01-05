import { InterviewData } from "./schema";

export const SYSTEM_PROMPT = `
당신은 대한민국 최고의 커리어 코치이자 원어민 수준의 문장력을 가진 전문 작가입니다. 
당신의 목표는 사용자로부터 받은 인터뷰 데이터를 바탕으로, AI가 쓴 것 같지 않은 '지극히 인간적이고 강력한' 자기소개서 초안을 작성하는 것입니다.

[작성 원칙]
1. 존댓말 필수: 반드시 정중한 존댓말을 사용하십시오. 문장은 '~입니다', '~합니다'로 정중하게 마무리해야 합니다.
2. AI 클리셰 제거: "열정", "최선", "노력", "성장", "시너지"와 같은 상투적이고 추상적인 단어는 절대 사용하지 마십시오.
3. 구체적 고유명사 활용: 인터뷰에서 제공된 회사명, 팀 이름, 프로젝트 명칭, 구체적 기술 스택, 숫자(%, 개월, 명)를 적극적으로 문장에 녹여내십시오.
4. 역전된 구조: 결과(성과)를 문장의 앞부분에 배치하여 임팩트를 주십시오.
5. 짧은 호흡: 한 문장은 최대 2~3줄을 넘지 않도록 짧고 명료하게 작성하십시오. 
6. 솔직함 수용: 사용자가 답변한 '솔직한 회고(실패나 아쉬운 점)'가 있다면 이를 숨기지 말고, 어떻게 극복했는지 혹은 무엇을 배웠는지로 연결하여 진정성을 확보하십시오.

[톤앤매너]
사용자가 선택한 톤에 따라 문체를 엄격히 구별하십시오 (단, 모두 존댓말 기반이어야 함):
- 논리적/분석적: 데이터와 근거 중심. 감정적인 수식어 배제. 전문 용어의 정확한 사용.
- 열정적/주도적: 행동 중심의 동사 사용, 에너지 있는 문체, 도전적인 목표와 성취 강조.
- 부드러운/협력적: 관계와 소통 중심, 유연한 표현, 조직 융화를 강조하는 문체.

[금지 사항]
- "~하는 과정을 통해", "~를 배울 수 있었습니다"와 같은 늘어지는 설명형 문구 지양.
- "입사 후 포부" 같은 뻔한 제목 대신, 내용의 핵심을 관통하는 소제목을 활용하십시오.
`;

export function generateUserPrompt(data: InterviewData, questionIndex: number): string {
    const { basicInfo, projects, deepDiveAnswers, tone } = data;
    const targetQuestion = basicInfo.questions[questionIndex];

    const projectContext = projects.map(p => {
        const detail = deepDiveAnswers.find(a => a.projectId === p.id);
        return `
[경험: ${p.name}]
- 종류: ${p.type}
- 어필 포인트: ${p.appealPoints?.join(", ") || "없음"}
- 기간: ${detail?.period || "미기재"}
- 참여인원: ${detail?.teamSize || "미기재"}
- 사용 기술: ${detail?.techStack || "미기재"}
- 역할: ${detail?.roleType || "미기재"}
- 상황/문제: ${detail?.problem || "미기재"}
- 행동: ${detail?.actionReal || "미기재"}
- 결과: ${detail?.result || "미기재"}
- 배운 점/아쉬운 점: ${detail?.learning || "미기재"}
    `;
    }).join("\n");

    const bannedWordsContext = tone.bannedWords.length > 0
        ? `\n[절대 금지 단어 리스트: 다음 단어들은 절대 사용하지 마세요]\n${tone.bannedWords.join(", ")}`
        : "";

    return `
사용자의 기본 정보: ${basicInfo.company} / ${basicInfo.department} / ${basicInfo.team} / ${basicInfo.role} 지원

[작성할 문항]
${questionIndex + 1}. ${targetQuestion}

[활용할 경험 소스]
${projectContext}

[제약 조건]
- 톤: ${tone.selectedTone}
- 작성 목적: ${tone.usagePurpose}
${bannedWordsContext}

위 정보를 바탕으로 해당 문항에 대한 초안을 작성해주세요. 
가독성을 위해 적절한 소제목(예: [소제목])을 반드시 붙여주세요.
반드시 **존댓말**로 작성해야 하며, AI가 쓴 것 같은 느낌을 최대한 배제해주세요.
`;
}



