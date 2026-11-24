import type { BaseMeta, BaseSpecimen, ParamDef, ParamValues, StageEvent } from '@koohoo/gallery-kit'

/* ──────────────────────────────────────────────────────────────
 * C# 표본 규격 (자세한 규칙은 docs/specimen-guide.md)
 * 표본 1개 = 다음 파일들.
 *   samples/<id>/<Name>.cs           원본. static void Main 이 있는 짧은 콘솔 프로그램 (C# 9). Unity 에도 그대로 들어간다
 *   src/specimens/<id>/meta.ts       글, 입력값(params), 단계
 *   truth/<id>/trace.json            기록 도구(tools/tracer)가 실제로 실행해 남긴 기록 (생성물, 커밋). npm run trace -- <id>
 * 이 파일은 Node 도 직접 읽는다 (기록 만들기, 도메인 검사). 타입만 import 하고 런타임 import 는 상대 경로 .ts 만 쓴다.
 * ────────────────────────────────────────────────────────────── */

/** 값 하나. n = null, v = 값 타입·문자열(글자로), s = 사용자 구조체(필드), r = 힙 객체 참조 */
export type Val =
  | { k: 'n' }
  | { k: 'v'; t: string; v: string }
  | { k: 's'; t: string; f: Field[] }
  | { k: 'r'; t: string; id: number }

/** [이름, 값]. 배열 칸은 이름이 '0', '1' … , 딕셔너리는 키 */
export type Field = [string, Val]

export interface HeapObj {
  /** 객체 번호. 처음 본 순서로 한 번 주고 프로그램 끝까지 같다 (같은 객체 = 같은 번호) */
  id: number
  t: string
  kind: 'obj' | 'arr' | 'list' | 'seq' | 'dict' | 'fn'
  f: Field[]
  /** 속을 그리지 않는 객체의 글 (StringBuilder 내용, 델리게이트 메서드 이름) */
  text?: string
  /** 배열이 길어 그리지 않은 칸 수 */
  more?: number
}

export interface Frame {
  /** 메서드 이름. 'static' 은 정적 필드 영역 */
  name: string
  vars: Field[]
}

/** 기록 한 칸 = 이 줄을 실행하기 직전의 상태 */
export interface TraceStep {
  /** 원본 파일의 줄 (1부터) */
  line: number
  /** 이 칸 직전까지 새로 찍힌 콘솔 출력 */
  out?: string
  frames: Frame[]
  heap: HeapObj[]
  /** 마지막 칸 (프로그램 끝) */
  end?: boolean
  /** 잡히지 않은 예외 */
  error?: string
}

export interface Run {
  steps: TraceStep[]
  error?: string
}

export interface TraceFile {
  id: string
  /** 기록한 원본 (리포 기준) */
  file: string
  /** 원본의 지문. 코드를 바꾸고 기록을 다시 만들지 않으면 검사가 잡는다 */
  hash: string
  /** 입력 조합(runKey) → 보통 실행과 GALLERY_MISTAKE 실행 */
  runs: Record<string, { normal: Run; mistake?: Run }>
}

export interface CsMeta extends BaseMeta {
  /** 개념 이름 (예: 값 타입과 참조 타입). 카드와 머리에 칩으로 보인다 */
  concept: string
  /** 원본 교안의 장 (교안 사이트 주소). 첫 번째가 주 교안 */
  lecture: { title: string; url: string }[]
}

export interface CsSpecimen extends BaseSpecimen<CsMeta> {
  /** 기록. 없으면 무대가 오류를 낸다 (npm run trace -- <id>) */
  trace: TraceFile | null
}

/** 실행 무대의 이벤트. 모든 표본이 같은 것을 쓴다 (meta.events) */
export const EXEC_EVENTS: StageEvent[] = [
  { id: 'line', label: '한 줄 실행' },
  { id: 'next', label: '다음 표시 줄까지' },
  { id: 'restart', label: '처음부터' },
]

/** 입력 조합의 이름. 기록 도구와 무대가 같은 규칙으로 찾는다 (params 순서대로 key=값) */
export function runKey(params: ParamDef[], values: ParamValues): string {
  return params.map(p => `${p.key}=${String(values[p.key] ?? p.default)}`).join('&')
}

/** 코드의 `// @param <key>` 선언 초기값을 지금 입력값으로 바꾼다 (기록 도구가 실행한 코드와 같게 보이도록. AI 세트도 쓴다) */
export function applyParamValues(code: string, params: ParamDef[], values: ParamValues): string {
  let out = code
  for (const p of params) {
    const v = String(values[p.key] ?? p.default)
    out = out.replace(new RegExp(`(=\\s*)([^;\\n]+)(;\\s*//.*@param\\s+${p.key}\\b)`), (_all, head: string, _old: string, tail: string) => `${head}${v}${tail}`)
  }
  return out
}

/** 기록할 입력 조합 전체 (select 의 모든 값 × toggle 의 true/false) */
export function allCombos(params: ParamDef[]): ParamValues[] {
  let out: ParamValues[] = [{}]
  for (const p of params) {
    const options = p.type === 'select' ? p.options.map(o => o.value) : p.type === 'toggle' ? [false, true] : [p.default]
    out = out.flatMap(v => options.map(o => ({ ...v, [p.key]: o })))
  }
  return out
}

/** 입력 조합 수 상한 (표본당, 용량). 넘으면 params 를 줄인다 */
export const MAX_COMBOS = 12
