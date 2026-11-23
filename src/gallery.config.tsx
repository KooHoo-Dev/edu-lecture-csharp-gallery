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
  envLabel: 'C# 9 · Unity 6.3 LTS',
  footer: '모든 코드와 글은 학습용으로 새로 작성했습니다. 원본 교안은 krkoohoo.github.io 의 C# 기초입니다.',
  hero: {
    eyebrow: '유니티 개발자 양성과정 · C# 기초',
    title: (
      <>
        한 줄씩 <em>실행</em>하며 메모리를 <em>본다</em>
      </>
    ),
    lead: '표본마다 짧은 C# 프로그램을 실제로 실행한 기록을 한 줄씩 재생합니다. 스택의 변수 상자와 힙의 객체, 둘을 잇는 참조 화살표가 줄마다 어떻게 바뀌는지 보고, 효과 끄기로 흔한 실수를 넣은 실행과 비교합니다.',
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
          유니티 개발자 양성과정의 강사와 수강생이 함께 보는 C# 기초 갤러리입니다. 교안(C# 기초)의 개념 중 <b>눈에 보이지 않는 메모리</b>가 핵심인 것을 골라, 짧은 프로그램이 실행될 때 스택과 힙이 어떻게 바뀌는지 한 줄씩 보여 줍니다.
        </p>
        <p>
          무대의 그림은 손으로 그린 것이 아닙니다. 표본의 C# 코드를 C# 9 로 컴파일해 <b>실제로 실행하면서 줄마다 변수와 객체를 읽은 기록</b>을 재생합니다. 같은 코드를 Unity 에 넣어도 같은 결과가 나옵니다.
        </p>
      </>
    ),
    principles: [
      '코드와 글은 교안을 바탕으로 학습용으로 새로 씁니다. 공식 문서는 링크합니다.',
      '표본 프로그램은 수업 화면에서 한눈에 들어오도록 짧게 씁니다.',
      '효과 끄기는 수강생이 실제로 하는 실수를 재현한 실행입니다.',
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
