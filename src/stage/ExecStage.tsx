import { startLoop, type StageHandle, type StageProps } from '@koohoo/gallery-kit'
import { useEffect, useImperativeHandle, useMemo, useRef, useState, type Ref } from 'react'
import { C, drawCode, drawConsole, drawMemory, panel, type Rect } from './draw'
import { applyParamValues, runKey, type CsSpecimen, type Run } from './types'

/* 실행 무대: 표본 C# 를 실제로 실행한 기록(truth/<id>/trace.json)을 한 칸씩 재생한다.
 *   코드: 지금 줄(▶), 바로 앞 줄(→), 실행한 줄(·), 단계 표시 // [n]
 *   메모리: 스택 프레임(지금 메서드가 위), 정적 영역, 힙 객체와 참조 화살표. 바로 앞 칸과 달라진 값은 노랗게
 *   콘솔: 그 칸까지 찍힌 출력
 * 무대 시간 STEP 초마다 한 칸. 이벤트(한 줄, 다음 표시, 처음부터)는 시간에 '칸 어긋남'을 더해 옮긴다 (검사의 시간 고정과 함께 쓰려고).
 * 단계 보기 n 은 // [n] 표시 줄을 처음 실행한 직후에 멈춘다. 효과 끄기는 GALLERY_MISTAKE 를 켜고 실행한 기록이다.
 * 자동 데모는 끝까지 재생하고 잠깐 멈춘 뒤 처음부터 다시 돈다. */

const W = 1600
const H = 900
const CODE: Rect = { x: 16, y: 16, w: 780, h: 868 }
const MEM: Rect = { x: 812, y: 16, w: 772, h: 612 }
const OUT: Rect = { x: 812, y: 644, w: 772, h: 240 }
/** 한 칸에 쓰는 무대 시간 (초) */
export const STEP = 0.6
/** 자동 데모가 끝에서 쉬는 시간 (초) */
const END_PAUSE = 2

/** `#if GALLERY_MISTAKE` 구역 중 지금 꺼진 줄 */
function inactiveLines(lines: string[], mistake: boolean): Set<number> {
  const out = new Set<number>()
  const stack: ('on' | 'off' | 'other')[] = []
  lines.forEach((line, i) => {
    const t = line.trim()
    if (/^#if\s+GALLERY_MISTAKE\b/.test(t)) stack.push(mistake ? 'on' : 'off')
    else if (/^#if\b/.test(t)) stack.push('other')
    else if (/^#else\b/.test(t) && stack.length && stack.at(-1) !== 'other') stack[stack.length - 1] = stack.at(-1) === 'on' ? 'off' : 'on'
    else if (/^#endif\b/.test(t)) stack.pop()
    else if (stack.includes('off')) out.add(i + 1)
  })
  return out
}

export function ExecStage({ ref, specimen, values, step, off, playing, speed, auto, startTime, children }: StageProps<CsSpecimen> & { ref?: Ref<StageHandle> }) {
  const m = specimen.meta
  const canvas = useRef<HTMLCanvasElement>(null)
  const st = useRef({ time: startTime ?? 0, offset: 0, held: false, frames: 0, dirty: true, endWait: 0 })
  const live = useRef({ step, playing, speed, auto })
  live.current = { step, playing, speed, auto }

  const trace = specimen.trace
  const file = useMemo(() => specimen.files.find(f => trace && trace.file.endsWith(`/${f.name}`)) ?? specimen.files[0], [specimen.files, trace])
  const key = runKey(m.params, values)
  // 보이는 코드도 지금 입력값으로 (기록 도구가 실행한 코드와 같게). 입력 조합이 바뀔 때만 다시 만든다
  const lines = useMemo(() => applyParamValues(file?.code ?? '', m.params, values).replace(/\r\n/g, '\n').split('\n'), [file, key]) // eslint-disable-line react-hooks/exhaustive-deps
  const marks = useMemo(() => {
    const map = new Map<number, number>()
    lines.forEach((line, i) => {
      const x = /\/\/ \[(\d+)\]\s*$/.exec(line)
      if (x) map.set(i + 1, Number(x[1]))
    })
    return map
  }, [lines])

  const run: Run | undefined = trace?.runs[key]?.[off ? 'mistake' : 'normal']
  const error = !trace
    ? `기록이 없다: truth/${m.id}/trace.json (npm run trace -- ${m.id})`
    : !run
      ? `기록에 없는 입력 조합${off ? ' (GALLERY_MISTAKE)' : ''}: ${key || '(입력 없음)'}. npm run trace -- ${m.id}`
      : null
  const inactive = useMemo(() => inactiveLines(lines, off), [lines, off])
  const [shownError, setShownError] = useState<string | null>(null)
  useEffect(() => setShownError(error), [error])

  /** 단계 n 의 칸: // [n] 줄을 처음 실행한 직후 (그 줄이 → 로, 그 줄이 바꾼 값이 노랗게 보인다) */
  const stepIndex = (r: Run, n: number) => {
    const target = [...marks].filter(([, k]) => k === n).map(([no]) => no)
    const i = r.steps.findIndex(s => target.includes(s.line) && !s.end)
    return i < 0 ? 0 : Math.min(r.steps.length - 1, i + 1)
  }
  const indexOf = (r: Run) => {
    const s = st.current
    if (live.current.step > 0) return stepIndex(r, live.current.step)
    return Math.max(0, Math.min(r.steps.length - 1, Math.floor(s.time / STEP + 1e-6) + s.offset))
  }
  const runRef = useRef(run)
  runRef.current = run

  // 입력값, 효과 끄기, 표본이 바뀌면 처음부터 (링크의 t= 는 그 시간에서)
  useEffect(() => {
    const s = st.current
    s.time = startTime ?? 0
    s.offset = 0
    s.endWait = 0
    s.dirty = true
  }, [key, off, specimen, startTime])
  useEffect(() => {
    st.current.dirty = true
  }, [step])

  useImperativeHandle(ref, () => ({
    fire: id => {
      const r = runRef.current
      const s = st.current
      if (!r) return
      const cur = indexOf(r)
      if (id === 'line') s.offset += 1
      else if (id === 'next') {
        const next = r.steps.findIndex((x, i) => i > cur && marks.has(x.line) && !x.end)
        s.offset += (next < 0 ? r.steps.length - 1 : next) - cur
      } else if (id === 'restart') s.offset = -Math.floor(s.time / STEP + 1e-6)
      s.endWait = 0
      s.dirty = true
    },
    capture: () => new Promise(ok => (canvas.current ? canvas.current.toBlob(b => ok(b), 'image/png') : ok(null))),
    seek: time => {
      const s = st.current
      s.held = time !== null
      if (time !== null) s.time = time
      s.dirty = true
    },
    status: () => ({ frames: st.current.frames, time: st.current.time, error }),
  }))

  useEffect(
    () =>
      startLoop(dt => {
        const s = st.current
        const p = live.current
        const r = runRef.current
        const g = canvas.current?.getContext('2d')
        if (!g) return
        if (r && p.playing && !s.held && p.step === 0) {
          const last = r.steps.length - 1
          if (indexOf(r) < last) {
            s.time += dt * p.speed
            s.dirty = true
          } else if (p.auto) {
            // 끝에서 잠깐 멈춘 뒤 처음부터
            s.endWait += dt * p.speed
            if (s.endWait >= END_PAUSE) {
              s.time = 0
              s.offset = 0
              s.endWait = 0
              s.dirty = true
            }
          }
        }
        if (!s.dirty) return
        s.dirty = false
        render(g, r)
        s.frames++
      }),
    // render 가 쓰는 자료(lines, marks, inactive, run)가 바뀌면 다시 붙인다
    [lines, marks, inactive, run],
  )

  function render(g: CanvasRenderingContext2D, r: Run | undefined) {
    g.fillStyle = C.bg
    g.fillRect(0, 0, W, H)
    const fileName = file?.name ?? '(파일 없음)'
    if (!r) {
      panel(g, CODE, fileName)
      panel(g, MEM, '메모리')
      panel(g, OUT, '콘솔')
      return
    }
    const i = indexOf(r)
    const cur = r.steps[i]
    const prev = i > 0 ? r.steps[i - 1] : null
    const visited = new Set(r.steps.slice(0, i).map(x => x.line))
    const ended = !!cur.end
    const title = off ? `${fileName} · 나쁜 예 (GALLERY_MISTAKE)` : fileName
    panel(g, CODE, title, ended ? `끝 · ${r.steps.length - 1}칸` : `${i + 1} / ${r.steps.length - 1}칸 · ${cur.line}번 줄 실행 직전`, off ? C.bug : C.dim)
    drawCode(g, CODE, { file: fileName, lines, marks, inactive, now: ended ? 0 : cur.line, prev: prev?.line ?? 0, visited, focus: live.current.step })
    panel(g, MEM, '메모리')
    drawMemory(g, MEM, cur, prev)
    const out = r.steps
      .slice(0, i + 1)
      .map(x => x.out ?? '')
      .join('')
    panel(g, OUT, '콘솔 출력')
    drawConsole(g, OUT, out, ended ? (cur.error ?? null) : null, ended)
  }

  return (
    <div className="stage" tabIndex={-1} aria-label={`${m.title} 실행 무대`}>
      <canvas ref={canvas} className="stage-canvas" width={W} height={H} />
      {shownError && (
        <div className="stage-error" role="alert">
          <b>기록 오류</b>
          <pre>{shownError}</pre>
        </div>
      )}
      {children}
    </div>
  )
}
