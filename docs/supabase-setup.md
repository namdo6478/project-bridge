# Supabase 연결 체크리스트

실제 프로젝트가 만들어지면 아래 순서로 연결합니다. 화면 예시는 환경변수가 없어도 기존처럼 동작하며, 값이 들어온 뒤부터 인증 세션 갱신을 시작합니다.

1. Supabase 프로젝트를 생성합니다.
2. Project URL과 Publishable key를 `.env.local`에 입력합니다.
3. `supabase/migrations`의 SQL을 순서대로 적용합니다.
4. Auth에서 휴대폰 로그인을 활성화하고 국내 SMS 공급자·요금·발신 규칙을 확인합니다.
5. 테스트 회원으로 회원가입 후 `profiles`가 자동 생성되는지 확인합니다.
6. 소유자가 아닌 회원이 매물을 수정하지 못하는지 RLS 검증을 진행합니다.
7. `listing-photos` 버킷에서 승인 전 사진은 소유자만, 승인 후 사진은 방문자도 읽는지 확인합니다.

## 환경변수

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Publishable key는 브라우저에서 사용할 수 있지만 RLS가 반드시 켜져 있어야 합니다. `service_role` 키는 브라우저 환경변수에 넣지 않고, 운영자 서버 작업이 필요할 때만 별도 비공개 환경변수로 사용합니다.

## 연결된 코드

- `lib/supabase/client.ts`: 브라우저용 클라이언트
- `lib/supabase/server.ts`: Server Component·Server Action용 클라이언트
- `proxy.ts`: 로그인 쿠키 갱신과 캐시 방지 헤더 전달
- `supabase/migrations`: 테이블, 인덱스, RLS, 사진 버킷 정책
