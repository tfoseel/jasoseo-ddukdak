import { InterviewData } from "./schema";

export const SYSTEM_PROMPT = `
당신은 대한민국 최고의 커리어 코치이자 원어민 수준의 문장력을 가진 전문 작가입니다. 
당신의 목표는 사용자로부터 받은 인터뷰 데이터를 바탕으로, AI가 쓴 것 같지 않은 '지극히 인간적이고 강력한' 자기소개서 초안을 작성하는 것입니다.

[기본 작성 원칙]
1. 존댓말 필수: 반드시 정중한 존댓말(하십시오체 또는 해요체)을 사용하십시오. 문장은 '~입니다', '~합니다'로 정중하게 마무리해야 합니다.
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

export const WRITING_GUIDE_HEADER = `
[전문가용 작성 가이드 및 합격 예시]
다음은 고퀄리티 자소서 작성을 위한 심화 가이드와 참고 예시입니다. 이 내용을 숙지하고 작성에 반영하십시오.
`;

export const STRATEGY_SYSTEM_PROMPT = `
당신은 자소서의 전체적인 흐름과 소재 배치를 설계하는 전략가입니다.
사용자가 입력한 여러 개의 경험(프로젝트)과 자소서 문항들을 분석하여, 어떤 문항에 어떤 경험을 배치하는 것이 가장 효과적일지 결정하십시오.

[전략 수립 원칙]
1. 소재 중복 방지: 동일한 경험이 여러 문항에 중복해서 들어가는 것을 최대한 피하십시오. 각 문항이 지원자의 다른 면모를 보여줄 수 있어야 합니다.
2. 문항 성격 맞춤: 문항에서 요구하는 역량(직무 전문성, 도전, 협업 등)에 가장 잘 부합하는 경험을 매칭하십시오.
3. 다중 소재 활용: 한 문항에 2개 이상의 경험을 섞어서 풍부하게 작성하는 것이 효과적일 경우, 이를 적극적으로 제안하십시오.
4. 논리적 근거: 왜 이 소재를 선택했는지에 대한 짦은 근거를 포함하십시오.

출력은 반드시 다음 JSON 형식을 따르십시오:
{
  "strategy": [
    { "questionIndex": 0, "projectIds": ["id1", "id2"], "reasoning": "선택 근거" },
    ...
  ]
}
`;

export function generateStrategyPrompt(data: InterviewData): string {
    const { basicInfo, projects, deepDiveAnswers } = data;

    const projectContext = projects.map(p => {
        const detail = deepDiveAnswers.find(a => a.projectId === p.id);
        return `
[ID: ${p.id} / 경험명: ${p.name}]
- 종류: ${p.type}
- 어필포인트: ${p.appealPoints?.join(", ")}
- 핵심 문제/성과: ${detail?.problem} -> ${detail?.result}
        `;
    }).join("\n");

    return `
[지원 정보]
회사: ${basicInfo.company} / 직무: ${basicInfo.role}

[자소서 문항 리스트]
${basicInfo.questions.map((q, i) => `${i + 1}. ${q.content}`).join("\n")}

[활용 가능한 경험 소스]
${projectContext}

위 정보를 바탕으로 소재 매칭 전략을 수립해주세요.
`;
}

export function generateUserPrompt(data: InterviewData, questionIndex: number): string {
    const { basicInfo, projects, deepDiveAnswers, tone, strategy, userProfile } = data;
    const targetQuestion = basicInfo.questions[questionIndex];

    // Safety guard: Ensure strategy is an array before calling .find()
    const strategyArray = Array.isArray(strategy) ? strategy : [];
    const targetStrategy = strategyArray.find(s => s.questionIndex === questionIndex);

    // Use ONLY the projects assigned by the strategy for this question
    const assignedProjectIds = targetStrategy?.projectIds || [];
    const assignedProjects = projects.filter(p => assignedProjectIds.includes(p.id));

    const projectContext = assignedProjects.map(p => {
        const detail = deepDiveAnswers.find(a => a.projectId === p.id);
        return `
[경험: ${p.name}]
- 종류: ${p.type}
- 어필 포인트: ${p.appealPoints?.join(", ") || "없음"}
- 기간: ${detail?.period || "미기재"}
- 참여인원: ${detail?.teamSize || "미기재"}
- 사용 기술: ${detail?.techStack || "미기재"}
- 역할 상세: ${detail?.roleType} (${detail?.roleDetail})
- 주요 장애물: [${detail?.obstacleType}] ${detail?.obstacleDetail}
- 초기 대응: ${detail?.actionFirst}
- 상황/문제: ${detail?.problem}
- 구체적 행동: ${detail?.actionReal}
- 수치적 성과: ${detail?.result}
- 배운 점/인사이트: ${detail?.learning}
    `;
    }).join("\n");

    const bannedWordsContext = tone.bannedWords.length > 0
        ? `\n[절대 금지 단어 리스트: 다음 단어들은 절대 사용하지 마세요]\n${tone.bannedWords.join(", ")}`
        : "";

    const subtitleInstruction = tone.includeSubtitles
        ? '내용의 핵심을 임팩트 있게 담은 창의적인 소제목(예: [소제목])을 반드시 붙여주세요.'
        : '소제목을 절대 붙이지 마세요. 본문으로만 작성하십시오.';

    const lengthInstruction = targetQuestion.maxChars
        ? `글자 수 제한: 공백 포함 ${targetQuestion.maxChars}자. **반드시 ${Math.floor(targetQuestion.maxChars * 0.9)}자 ~ ${Math.floor(targetQuestion.maxChars * 0.95)}자 사이**로 작성하십시오. 분량을 채우기 위해 의미 없는 수식어를 늘리지 말고, 경험의 디테일과 당신의 생각, 인사이트를 풍부하게 서술하십시오.`
        : "";

    // Build User Profile Context with safety guards
    const profile = userProfile || { strengths: [], weakness: "", vision: "", coreValue: "" };
    const profileContext = `
[지원자 프로필 (가치관 및 성향)]
- 나의 강점 키워드: ${profile.strengths?.join(", ") || "미기재"}
- 나의 약점 및 보완점: ${profile.weakness || "미기재"}
- 업무 비전(Vision): ${profile.vision || "미기재"}
- 핵심 가치 메시지(Core Value): ${profile.coreValue || "미기재"}
    `.trim();

    return `
사용자의 기본 정보: ${basicInfo.company} / ${basicInfo.role} 지원

${profileContext}

[문항]
${questionIndex + 1}. ${targetQuestion.content}

[선택된 경험 소스]
${projectContext}

[제약 조건]
- 톤: ${tone.selectedTone}
- 작성 목적: ${tone.usagePurpose}
${lengthInstruction}
${subtitleInstruction}
${bannedWordsContext}

[작성 가이드 - 고퀄리티 필수 요건]
1. **구체적 묘사**: "문제를 해결했다"는 식의 결과 나열은 지양하십시오. 마치 독자가 현장에 있는 것처럼, 당시 마주했던 기술적 난제, 협업에서의 갈등 상황, 본인이 내린 결정의 근거를 생생하게 묘사하십시오.
2. **기술적 디테일**: 사용된 기술 스택, 구체적인 도구, 수치(%, 개월, 명)를 문장 속에 자연스럽게 녹여내어 전문성을 증명하십시오.
3. **인간적 서술**: AI 특유의 '완벽한 정답형' 말투를 버리십시오. 본인의 고민, 아쉬움, 그리고 이를 극복하며 얻은 진솔한 인사이트를 포함하여 인간적인 매력을 보여주십시오.
4. **90~95% 분량 준수**: 설정된 글자 수의 90~95% 범위로 작성하십시오. 최대 글자 수를 초과해서는 안 됩니다. 경험의 디테일을 더 깊게 파고들어 충분한 분량과 깊이감을 확보하십시오.
5. **개인화된 가치 반영**: 지원자가 제시한 '강점 키워드'와 '핵심 가치 메시지'가 글 전반에 자연스럽게 묻어나도록 작성하십시오. 단순한 경험 서술을 넘어, 지원자가 어떤 태도로 업무에 임하는 사람인지가 드러나야 합니다.
6. **존댓말**: 반드시 정중한 존댓말로 작성하십시오.

위 가이드를 엄격히 준수하여, 사용자가 감동할 만한 압도적인 퀄리티의 초안을 작성해주세요.
`;
}




