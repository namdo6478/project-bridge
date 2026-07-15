# 축산기계장터

전국 축산 농가와 장비 판매자를 연결하는 축산기계 중고·신품 거래 MVP입니다.

## 현재 기능

- 7개 대분류·세부 품목 기반 매물 탐색
- 검색, 지역, 상태, 가격 정렬 필터
- 매물 상세와 장비 팔기 등록 화면
- Supabase 기반 회원·매물 저장 구조와 RLS 정책
- PC·태블릿·모바일 반응형 화면

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase 연결

1. `.env.example`을 `.env.local`로 복사합니다.
2. Supabase Project URL과 Publishable Key를 입력합니다.
3. `supabase/migrations/20260715090000_initial_marketplace.sql`을 SQL Editor에서 실행합니다.
4. Authentication의 Site URL과 Redirect URL에 서비스 주소와 `/auth/callback`을 등록합니다.

환경 변수가 없을 때는 샘플 매물로 동작하며 로그인과 실제 등록만 비활성화됩니다.

주요 개발 순서는 [개발 로드맵](./docs/DEVELOPMENT_ROADMAP.md)에서 확인할 수 있습니다.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
