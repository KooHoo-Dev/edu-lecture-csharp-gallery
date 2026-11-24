import { collectFiles, collectMetas, collectShots, sortSpecimens, type PlannedSpecimen } from '@koohoo/gallery-kit'
import type { CsMeta, CsSpecimen, TraceFile } from './stage/types'

/* 표본 자동 등록: src/specimens/<id>/meta.ts 를 만들면 갤러리에 나타난다.
 * 원본 C# 는 samples/<id>/ 에서, 실행 기록은 truth/<id>/trace.json 에서, 촬영은 src/shots/<id>/ 에서 모은다.
 * glob 의 첫 '/*\/' 가 표본 자리다 (격리 빌드). */
const metas = import.meta.glob<{ meta: CsMeta }>('./specimens/*/meta.ts', { eager: true })
const sources = import.meta.glob<string>('../samples/*/*.cs', { query: '?raw', import: 'default', eager: true })
const traces = import.meta.glob<TraceFile>('../truth/*/trace.json', { import: 'default', eager: true })
const shots = import.meta.glob<string>('./shots/*/*.webp', { import: 'default', eager: true })

/* 그룹은 교안(01-csharp-basic)의 파트와 같다. docs/selection.md */
export const GROUPS: Record<string, { name: string; desc: string }> = {
  A: { name: 'Part 1 기초 문법', desc: '교안 Part 1 의 장과 절 순서대로. 교안을 띄워 두고 옆에서 메모리와 출력을 본다' },
  B: { name: '메모리와 구조', desc: '클래스와 구조체, 스택과 힙, 값 타입과 참조 타입 (교안 Part 2)' },
  C: { name: '실용 도구', desc: '문자열, 예외 처리 (교안 Part 3)' },
  D: { name: '객체 지향', desc: '캡슐화, 상속, 다형성 (교안 Part 4)' },
  E: { name: '컬렉션과 델리게이트', desc: 'List, Dictionary, 델리게이트, 람다 (교안 Part 5)' },
}

/** 파일 순서: Main 이 있는 원본이 먼저, Unity 판 예시(*Behaviour.cs)는 뒤 */
const order = (rel: string) => (rel.endsWith('Behaviour.cs') ? 1 : 0)

export const SPECIMENS: CsSpecimen[] = sortSpecimens(
  collectMetas(metas, './specimens/').map(meta => ({
    meta,
    files: collectFiles(sources, '../samples/', meta.id, 'Assets/CSharpGallery/', order),
    trace: traces[`../truth/${meta.id}/trace.json`] ?? null,
    shots: collectShots(shots, './shots/', meta.id),
  })),
  Object.keys(GROUPS),
)

/* 아직 만들지 않은 교안 장. 교안(Part 1) 목차 순서대로 표본을 만든다 (docs/plan.md). 표본이 생기면 그 장의 카드를 지운다.
 * order 는 장 번호 × 10 (같은 장의 표본은 장 번호 × 10 + 절 순서) */
export const PLANNED: PlannedSpecimen[] = [
  { id: 'ch05-conditional', title: '05. 조건문', group: 'A', order: 50, oneLiner: 'if · else if · switch 가 어느 갈래를 타는지 줄마다 본다' },
  { id: 'ch06-loop', title: '06. 반복문', group: 'A', order: 60, oneLiner: 'for · while · foreach 가 돌 때마다 변수가 어떻게 바뀌는지 본다' },
  { id: 'ch07-flow', title: '07. 프로그램 흐름 제어', group: 'A', order: 70, oneLiner: 'break · continue · return 이 흐름을 어디로 보내는지 본다' },
  { id: 'ch08-array', title: '08. 배열', group: 'A', order: 80, oneLiner: '배열 본체는 힙에, 변수에는 주소가 들어 있는 것을 본다' },
  { id: 'ch09-multidim', title: '09. 다차원 배열', group: 'A', order: 90, oneLiner: '2차원 배열과 가변 배열이 힙에 어떻게 놓이는지 본다' },
  { id: 'ch10-method', title: '10. 메서드', group: 'A', order: 100, oneLiner: '메서드를 부르면 프레임이 쌓이고 돌아오면 걷히는 것을 본다' },
  { id: 'ch11-reference', title: '11. 참조', group: 'A', order: 110, oneLiner: '값 전달 · ref · out 이 부른 쪽 변수에 무엇을 하는지 본다' },
  { id: 'ch12-scope', title: '12. 스코프 · 정적 · 상수', group: 'A', order: 120, oneLiner: '변수가 살아 있는 범위와 static 이 하나뿐인 것을 본다' },
  { id: 'ch13-casting', title: '13. 형 변환', group: 'A', order: 130, oneLiner: '캐스트 · 파싱 · 박싱이 값을 어떻게 바꾸는지 본다' },
]
