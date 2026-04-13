/**
 * 이용약관 — 간단 구성. 서비스 소개, 이용자 의무, 지재권, 면책, 관할.
 */
export function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">
        <header className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">이용약관</h1>
          <p className="text-xs text-brand-textDim">시행일: 2026년 4월 13일</p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-brand-textDim">
          <Section title="제1조 (목적)">
            <p>
              본 약관은 AIGoLab(이하 "서비스")이 제공하는 온라인 학습 서비스의 이용 조건 및 절차,
              이용자와 서비스 운영자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </Section>

          <Section title="제2조 (정의)">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>이용자</strong>: 본 약관에 따라 서비스를 이용하는 모든 자
              </li>
              <li>
                <strong>회원</strong>: 이메일 또는 Google 계정으로 가입한 이용자
              </li>
              <li>
                <strong>콘텐츠</strong>: 서비스가 제공하는 커리큘럼, 레슨, 퀴즈, 코드 예제,
                프로젝트 등의 학습 자료
              </li>
            </ul>
          </Section>

          <Section title="제3조 (서비스의 제공)">
            <p>
              서비스는 브라우저 기반의 무료 AI·프로그래밍 학습 플랫폼으로, 다음의 기능을
              제공합니다.
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Python 코딩 실습 및 인터랙티브 노트북</li>
              <li>AI 이론 강의 및 퀴즈</li>
              <li>머신러닝 프로젝트 실습</li>
              <li>학습 진도 저장 및 수료증 발급</li>
            </ul>
          </Section>

          <Section title="제4조 (이용자의 의무)">
            <p>이용자는 서비스 이용 시 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>타인의 계정을 도용하거나 허위 정보를 등록하는 행위</li>
              <li>서비스의 정상적인 운영을 방해하는 행위 (과도한 크롤링, 자동화 공격 등)</li>
              <li>서비스에 게시된 콘텐츠를 무단으로 복제·배포·상업적 이용하는 행위</li>
              <li>법령 또는 공공질서에 반하는 행위</li>
            </ul>
          </Section>

          <Section title="제5조 (지적재산권)">
            <p>
              서비스가 제공하는 모든 콘텐츠의 저작권은 서비스 운영자에게 있으며, 이용자는 개인적인
              비영리 학습 목적에 한하여 이용할 수 있습니다. 이용자가 서비스 내에서 작성한 코드,
              노트북, 메모 등의 저작권은 해당 이용자에게 귀속됩니다.
            </p>
          </Section>

          <Section title="제6조 (서비스의 변경 및 중단)">
            <p>
              서비스 운영자는 운영상 또는 기술상의 필요에 따라 서비스의 내용을 변경하거나 일시적
              또는 영구적으로 중단할 수 있으며, 이로 인해 발생한 이용자의 손해에 대하여 고의 또는
              중대한 과실이 없는 한 책임을 지지 않습니다.
            </p>
          </Section>

          <Section title="제7조 (책임의 제한)">
            <p>
              서비스는 무료로 제공되며, 서비스 운영자는 천재지변, 통신 장애, 제3자 서비스(Supabase,
              Google, Vercel 등)의 장애로 인해 발생한 손해에 대해 책임을 지지 않습니다. 이용자가
              본 서비스를 통해 학습한 내용을 실제 업무나 상업적 목적에 활용하여 발생하는 결과에
              대한 책임은 이용자 본인에게 있습니다.
            </p>
          </Section>

          <Section title="제8조 (회원 탈퇴)">
            <p>
              회원은 언제든지 서비스 내 기능 또는 운영자에게 이메일로 요청하여 탈퇴할 수 있으며,
              탈퇴 시 저장된 개인정보 및 학습 기록은 관련 법령에 따라 지체 없이 파기됩니다.
            </p>
          </Section>

          <Section title="제9조 (약관의 변경)">
            <p>
              본 약관은 관계 법령 및 서비스 정책에 따라 변경될 수 있으며, 변경 시 서비스 내
              공지사항을 통해 사전에 고지합니다. 변경된 약관의 효력 발생일 이후 서비스를 계속
              이용하는 경우 변경된 약관에 동의한 것으로 간주합니다.
            </p>
          </Section>

          <Section title="제10조 (준거법 및 관할)">
            <p>
              본 약관은 대한민국 법령에 따라 해석되며, 서비스 이용과 관련하여 발생한 분쟁에 대한
              소는 민사소송법에 따른 관할 법원에 제기합니다.
            </p>
          </Section>

          <Section title="문의">
            <p>
              약관에 관한 문의는{" "}
              <a
                href="mailto:gyumsonsam@gmail.com"
                className="text-brand-primary hover:underline"
              >
                gyumsonsam@gmail.com
              </a>{" "}
              으로 연락 바랍니다.
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
      <div>{children}</div>
    </section>
  );
}
