# 배포 가이드 (Deployment Guide)

이 프로젝트는 Next.js로 구축되었으며, **Vercel**을 통한 배포를 가장 권장합니다.

## 1. Vercel 배포 (권장)

Vercel은 Next.js 개발사에서 만든 플랫폼으로, 가장 쉽고 최적화된 배포 경험을 제공합니다.

1. [Vercel](https://vercel.com/)에 가입하고 프로젝트를 연동합니다.
2. GitHub 저장소를 선택합니다.
3. **Environment Variables** 설정 단계에서 아래 항목들을 반드시 추가해야 합니다:
   - `ANTHROPIC_API_KEY`: Anthropic API 키
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: (결제 기능 사용 시) Stripe 공개 키
   - `STRIPE_SECRET_KEY`: (결제의 서버 사이드 검증 시) Stripe 비밀 키
4. 'Deploy' 버튼을 누르면 배포가 시작됩니다.

## 2. 환경 변수 체크리스트

배포 전, `.env.local`에 정의된 변수들이 프로덕션 환경(Vercel Dashboard 등)에도 모두 등록되어 있는지 확인하십시오. 특히 AI 모델 호출을 위한 `ANTHROPIC_API_KEY`가 필수입니다.

## 3. 로컬 빌드 테스트

배포 전 로컬에서 빌드가 정상적으로 수행되는지 확인하는 것이 좋습니다.

```bash
npm run build
```
*(이미 확인 결과 성공하였습니다.)*

## 4. 기타 플랫폼 (AWS, Netlify 등)

다른 플랫폼을 사용하는 경우, `output: 'standalone'` 설정을 `next.config.js`에 추가애야 할 수도 있습니다. 하지만 본 프로젝트의 아키텍처 상 Vercel이 가장 안정적입니다.
