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
  A: { name: '기초 문법', desc: '변수, 연산, 제어문, 배열, 메서드와 매개변수 (교안 Part 1)' },
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

/* 아직 구현되지 않은 표본. 구현되면 자동으로 목록에서 빠진다. 근거와 순서는 docs/selection.md */
export const PLANNED: PlannedSpecimen[] = [
  { id: 'array-alias', title: '배열 대입은 주소 복사', group: 'A', order: 1, oneLiner: 'copy = original 은 배열을 복사하지 않는다. 두 변수가 배열 하나를 함께 가리킨다' },
  { id: 'pass-by-value-ref', title: '값 전달과 ref', group: 'A', order: 2, oneLiner: '매개변수는 사본이다. ref 를 붙이면 호출한 쪽 변수를 직접 고친다' },
  { id: 'ref-param-reassign', title: '매개변수에 new 를 넣으면', group: 'A', order: 3, oneLiner: '받은 객체의 필드를 고치면 원본이 바뀌지만, 매개변수에 새 객체를 넣으면 연결만 끊긴다' },
  { id: 'static-shared-counter', title: 'static 은 하나뿐', group: 'A', order: 4, oneLiner: '정적 필드는 객체마다가 아니라 클래스에 하나 있어, 모든 객체가 같은 칸을 센다' },
  { id: 'boxing-unboxing', title: '박싱과 언박싱', group: 'A', order: 5, oneLiner: 'object 에 int 를 넣으면 힙에 상자가 생기고, 꺼낼 때는 원래 형식으로만 꺼낼 수 있다' },
  { id: 'struct-out-of-array', title: '꺼낸 구조체는 사본', group: 'B', order: 2, oneLiner: '배열에서 꺼낸 구조체를 고쳐도 배열 칸은 그대로다. 고친 사본을 다시 넣어야 한다' },
  { id: 'struct-field-vs-class-field', title: '위치는 복사, 무기는 공유', group: 'B', order: 3, oneLiner: '객체 안의 구조체 필드와 클래스 필드가 대입에서 다르게 움직인다' },
  { id: 'stack-frames', title: '호출과 복귀: 스택 프레임', group: 'B', order: 4, oneLiner: '메서드를 부르면 프레임이 쌓이고 돌아오면 걷힌다. 재귀는 같은 메서드의 프레임이 겹겹이 쌓인다' },
  { id: 'heap-reachability', title: '참조가 끊긴 객체', group: 'B', order: 5, oneLiner: '아무 변수도 가리키지 않는 객체는 GC 대상이고, 정적 목록에 남은 객체는 계속 살아 있다' },
  { id: 'string-immutable', title: '문자열은 새로 만든다', group: 'C', order: 1, oneLiner: 'ToUpper 는 원본을 바꾸지 않고 새 문자열을 돌려준다. 받아 두지 않으면 사라진다' },
  { id: 'exception-propagation', title: '예외는 프레임을 거슬러 올라간다', group: 'C', order: 2, oneLiner: '잡지 않은 예외는 남은 줄을 건너뛰며 호출한 메서드로 올라가고, finally 는 그 길에서 반드시 돈다' },
  { id: 'polymorphism-new-vs-override', title: 'override 와 new 가리기', group: 'D', order: 1, oneLiner: '부모 형식 변수로 부를 때 override 는 자식 메서드를, new 로 가린 메서드는 부모 메서드를 부른다' },
  { id: 'list-removeat-skip', title: '지우면서 앞으로 돌면', group: 'E', order: 1, oneLiner: '앞에서부터 RemoveAt 하면 뒤 칸이 당겨져 하나씩 건너뛴다. 뒤에서부터 돌면 안전하다' },
  { id: 'lambda-loop-capture', title: '람다가 잡은 for 의 i', group: 'E', order: 2, oneLiner: '반복문 안 람다는 i 의 값이 아니라 변수를 잡는다. 나중에 부르면 모두 마지막 값이다' },
  { id: 'multicast-event', title: '델리게이트의 호출 목록', group: 'E', order: 3, oneLiner: '+= 는 목록에 더하고 = 는 목록을 갈아 치운다. event 는 바깥에서 = 를 막는다' },
]
