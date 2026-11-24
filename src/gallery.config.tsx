import { defineGallery } from '@koohoo/gallery-kit'
import { ai } from './ai'
import { GROUPS, PLANNED, SPECIMENS } from './registry'
import { ExecStage } from './stage/ExecStage'
import { allCombos, MAX_COMBOS, runKey, type CsSpecimen } from './stage/types'

const STEP = /\/\/ \[(\d+)\]\s*$/

/** 도메인 검사 (브라우저에서 돈다): 기록, 입력값, 단계 표시. 파일·지문 검사는 tools/check-domain.mjs */
function lint(s: CsSpecimen): string[] {
  const out: string[] = []
  const m = s.meta
  if (!s.trace) out.push(`기록이 빌드에 없다 (truth/${m.id}/trace.json). npm run trace -- ${m.id}`)
  for (const p of m.params) if (p.type !== 'select' && p.type !== 'toggle') out.push(`입력값 ${p.key} 는 select 나 toggle 이어야 한다`)
  const combos = allCombos(m.params)
  if (combos.length > MAX_COMBOS) out.push(`입력 조합이 ${combos.length}개다 (최대 ${MAX_COMBOS})`)
  if (s.trace) for (const v of combos) if (!s.trace.runs[runKey(m.params, v)]) out.push(`기록에 입력 조합 ${runKey(m.params, v) || '(입력 없음)'} 이 없다`)
  const marks = new Set(s.files.flatMap(f => f.code.split(/\r?\n/).flatMap(l => (STEP.exec(l) ? [Number(STEP.exec(l)![1])] : []))))
  for (const st of m.steps) if (!marks.has(st.n)) out.push(`${st.n}단계를 가리키는 // [${st.n}] 표시가 원본에 없다`)
  if (m.events.map(e => e.id).join() !== 'line,next,restart') out.push('events 는 EXEC_EVENTS 를 그대로 쓴다 (실행 무대가 처리하는 이벤트)')
  if (!m.lecture.length) out.push('lecture 에 원본 교안 장이 없다')
  return out
}

export const config = defineGallery<CsSpecimen>({
  id: 'csharp-gallery',
  name: 'C# Gallery',
  brand: { title: 'C# GALLERY', tagline: 'C# 기초 · 실제 실행 기록 · 스택과 힙' },
  storageKey: 'jaytools.csharpgallery.v1.',
  downloadName: 'CSharpGallery.html',
  envLabel: 'C# 9 · .NET 콘솔',
  footer: '모든 코드와 글은 학습용으로 새로 작성했습니다. 원본 교안은 krkoohoo.github.io 의 C# 기초입니다.',
  hero: {
    eyebrow: '유니티 개발자 양성과정 · C# 기초',
    title: (
      <>
        한 줄씩 <em>실행</em>하며 메모리를 <em>본다</em>
      </>
    ),
    lead: '교안을 띄워 두고 옆에서 보는 보조 교안입니다. 교안의 장과 절 순서대로, 교안의 코드 예시를 실제로 실행한 기록을 한 줄씩 재생합니다. 변수 상자와 콘솔 출력이 줄마다 어떻게 바뀌는지 보고, 효과 끄기로 교안의 ❌ 상황(흔한 실수)을 넣은 실행과 비교합니다.',
  },
  searchPlaceholder: '검색: 참조, 구조체, 배열, static…',
  groups: GROUPS,
  tagLabel: '주제',
  specimens: SPECIMENS,
  planned: PLANNED,
  Stage: ExecStage,
  shotAlt: '실행 무대 화면',
  chips: s => [{ label: s.meta.concept, tone: '#b48cff' }],
  cardChip: s => ({ label: s.meta.concept, tone: '#b48cff' }),
  sections: [
    {
      id: 'lecture',
      title: '원본 교안',
      after: 'goals',
      render: s => (
        <ul>
          {s.meta.lecture.map(l => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noreferrer">
                {l.title}
              </a>
            </li>
          ))}
        </ul>
      ),
    },
  ],
  finalStep: { label: '최종', body: '처음부터 끝까지 한 줄씩 재생한다. 지금 줄은 ▶, 방금 실행한 줄은 →, 방금 바뀐 값은 노랗게 보인다.' },
  ai,
  about: {
    intro: (
      <>
        <p>
          유니티 개발자 양성과정의 C# 기초 수업에서 <b>교안 옆에 띄워 두는 보조 교안</b>입니다. 교안(C# 기초)의 장과 절 순서를 그대로 따르고, 교안의 코드 예시를 거의 그대로 실행해 <b>눈에 보이지 않는 메모리와 출력</b>을 한 줄씩 보여 줍니다. 표본마다 이름 옆 칩이 교안의 장과 절을 가리킵니다.
        </p>
        <p>
          무대의 그림은 손으로 그린 것이 아닙니다. 표본의 C# 코드를 C# 9 로 컴파일해 <b>실제로 실행하면서 줄마다 변수와 객체를 읽은 기록</b>을 재생합니다. 콘솔 입력(<code>Console.ReadLine</code>)은 무대에서 고른 입력을 친 것으로 실행하고, 교안의 ❌ 상황이 컴파일 오류면 효과 끄기 화면이 그 줄과 오류 메시지를 보여 줍니다.
        </p>
      </>
    ),
    principles: [
      '교안의 목차와 코드 예시를 따릅니다. 아직 배우지 않은 문법(그 장보다 뒤에 나오는 것)은 쓰지 않습니다.',
      '표본 프로그램은 수업 화면에서 한눈에 들어오도록 짧게 씁니다.',
      '효과 끄기는 교안의 ❌ 상황과 주의사항에 나온 실수를 재현한 실행입니다.',
    ],
    noticeEn: 'All code and text in this gallery are original work written for education, based on the instructor’s own C# lecture notes.',
    students: (
      <p>
        여기 있는 코드는 MIT 라이선스로 자유롭게 써도 됩니다. 다음 줄로 넘기기 전에 콘솔에 무엇이 찍힐지, 메모리 그림이 어떻게 바뀔지 먼저 맞혀 보세요. 틀린 곳이 가장 많이 배우는 곳입니다.
      </p>
    ),
  },
  lint,
})
