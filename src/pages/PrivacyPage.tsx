/**
 * 개인정보처리방침 — 한국 개인정보보호법 기준 최소 구성.
 * 수집 항목 / 이용 목적 / 제3자 제공 / 보관 기간 / 권리 / 책임자.
 */
export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">
        <header className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">개인정보처리방침</h1>
          <p className="text-xs text-brand-textDim">
            시행일: 2026년 4월 13일
          </p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-brand-text">
          <Section title="1. 수집하는 개인정보 항목">
            <p>
              AIGoLab(이하 "서비스")은 회원 가입 및 서비스 제공을 위해 아래 항목을 수집합니다.
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                <strong>필수 항목</strong>: 이메일 주소
              </li>
              <li>
                <strong>Google 로그인 이용 시</strong>: Google이 제공하는 이메일 주소, 이름,
                프로필 이미지 URL
              </li>
              <li>
                <strong>자동 수집 항목</strong>: 서비스 이용 기록(학습 진도, 퀴즈 결과, 완료한
                챕터/강의), 접속 로그, IP 주소, 쿠키, 브라우저 정보
              </li>
            </ul>
          </Section>

          <Section title="2. 개인정보의 수집 및 이용 목적">
            <ul className="list-disc pl-5 space-y-1">
              <li>회원 식별 및 로그인 인증</li>
              <li>학습 진도 및 퀴즈 결과의 저장·동기화</li>
              <li>서비스 이용 통계 분석 및 개선</li>
              <li>문의사항 응대 및 공지사항 안내</li>
            </ul>
          </Section>

          <Section title="3. 개인정보의 보유 및 이용 기간">
            <p>
              서비스는 회원의 개인정보를 회원 탈퇴 시까지 보유하며, 탈퇴 즉시 지체 없이 파기합니다.
              단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.
            </p>
          </Section>

          <Section title="4. 개인정보의 제3자 제공 및 처리 위탁">
            <p>
              서비스는 원활한 운영을 위해 아래와 같이 개인정보 처리를 위탁하고 있습니다.
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead className="text-brand-textDim">
                  <tr className="border-b border-brand-subtle">
                    <th className="text-left py-2 pr-3 font-medium">수탁업체</th>
                    <th className="text-left py-2 pr-3 font-medium">위탁 업무</th>
                    <th className="text-left py-2 font-medium">처리 지역</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-brand-subtle/50">
                    <td className="py-2 pr-3">Supabase Inc.</td>
                    <td className="py-2 pr-3">회원 인증, 데이터베이스</td>
                    <td className="py-2">미국</td>
                  </tr>
                  <tr className="border-b border-brand-subtle/50">
                    <td className="py-2 pr-3">Google LLC</td>
                    <td className="py-2 pr-3">OAuth 로그인, 이용 통계(Google Analytics)</td>
                    <td className="py-2">미국</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3">Vercel Inc.</td>
                    <td className="py-2 pr-3">웹 호스팅, 접속 로그</td>
                    <td className="py-2">미국</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="5. 정보주체의 권리">
            <p>
              이용자는 언제든지 본인의 개인정보를 조회, 수정, 삭제, 처리 정지를 요구할 수
              있습니다. 요청은 아래 연락처로 이메일을 통해 접수합니다.
            </p>
          </Section>

          <Section title="6. 쿠키 및 유사 기술의 사용">
            <p>
              서비스는 로그인 세션 유지 및 이용 통계 수집을 위해 쿠키, 로컬 스토리지,
              IndexedDB 등을 사용합니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수
              있으나, 이 경우 일부 기능(로그인 유지, 학습 진도 저장 등) 이용에 제한이 발생할 수
              있습니다.
            </p>
          </Section>

          <Section title="7. 개인정보 보호책임자">
            <ul className="space-y-1">
              <li>성명: 손준원</li>
              <li>
                이메일:{" "}
                <a
                  href="mailto:gyumsonsam@gmail.com"
                  className="text-brand-primary hover:underline"
                >
                  gyumsonsam@gmail.com
                </a>
              </li>
              <li>주소: 경기도 수원시 영통구 광교호수공원로 155</li>
            </ul>
          </Section>

          <Section title="8. 개인정보처리방침의 변경">
            <p>
              본 방침은 법령 및 서비스 정책에 따라 변경될 수 있으며, 변경 시 서비스 내 공지사항을
              통해 사전에 고지합니다.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-brand-text mb-2">{title}</h2>
      <div className="text-brand-textDim">{children}</div>
    </section>
  );
}
