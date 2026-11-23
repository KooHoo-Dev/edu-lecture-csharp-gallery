import type { Field, Frame, HeapObj, TraceStep, Val } from './types'

/* 실행 무대 그리기: 코드(지금 줄), 메모리(스택 프레임, 정적 영역, 힙과 참조 화살표), 콘솔 출력.
 * 캔버스는 1600×900 고정이고 화면 테마와 상관없이 어두운 바탕이다 (수업 화면에서 같은 그림이 되도록). */

export const C = {
  bg: '#0d1117',
  panel: '#151b24',
  border: '#2a3442',
  text: '#d8e0ea',
  dim: '#7d8a9c',
  faint: '#4a5566',
  accent: '#b48cff',
  now: '#3b2f63',
  nowEdge: '#b48cff',
  prev: '#2ea043',
  changed: '#f0b429',
  changedBg: 'rgba(240, 180, 41, 0.18)',
  value: '#1d2a3a',
  valueEdge: '#3d5a80',
  ref: '#58a6ff',
  heap: '#1b2230',
  heapEdge: '#465870',
  bug: '#ff6b6b',
  kw: '#c792ea',
  type: '#82aaff',
  str: '#f78c6c',
  num: '#f9d27a',
  comment: '#6a7a8c',
}

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

const MONO = '"JetBrains Mono", Consolas, monospace'
const SANS = '"Chakra Petch", "Malgun Gothic", sans-serif'

export function panel(g: CanvasRenderingContext2D, r: Rect, title: string, note?: string, tone: string = C.dim) {
  g.fillStyle = C.panel
  g.strokeStyle = C.border
  g.lineWidth = 1
  roundRect(g, r.x, r.y, r.w, r.h, 10)
  g.fill()
  g.stroke()
  g.fillStyle = tone
  g.font = `600 16px ${SANS}`
  g.textBaseline = 'top'
  g.textAlign = 'left'
  g.fillText(title, r.x + 16, r.y + 12)
  if (note) {
    g.textAlign = 'right'
    g.fillStyle = C.dim
    g.font = `500 14px ${SANS}`
    g.fillText(note, r.x + r.w - 16, r.y + 14)
    g.textAlign = 'left'
  }
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath()
  g.roundRect(x, y, w, h, r)
}

function clipText(g: CanvasRenderingContext2D, text: string, max: number): string {
  if (g.measureText(text).width <= max) return text
  let lo = 0
  let hi = text.length
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (g.measureText(text.slice(0, mid) + '…').width <= max) lo = mid
    else hi = mid - 1
  }
  return text.slice(0, lo) + '…'
}

/* ───────── 코드 ───────── */

export interface CodeView {
  file: string
  lines: string[]
  /** 줄 → 단계 번호 (`// [n]` 표시) */
  marks: Map<number, number>
  /** 꺼진 #if 구역의 줄 (흐리게) */
  inactive: Set<number>
  now: number
  prev: number
  /** 이미 실행한 줄 */
  visited: Set<number>
  /** 단계 보기에서 강조할 표시 번호 (0 이면 없음) */
  focus: number
}

const KEYWORDS = new Set(
  'abstract as base bool break byte case catch char class const continue decimal default delegate do double else enum event false finally float for foreach if in int interface internal is long namespace new null object out override params private protected public readonly ref return sealed short static string struct switch this throw true try uint ulong using var virtual void while get set'.split(' '),
)
const TOKEN = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|\$"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)')|(\b\d+(?:\.\d+)?[fFmMdDL]?\b)|(#\w+.*$)|([A-Za-z_]\w*)|(\s+|.)/g

function drawCodeLine(g: CanvasRenderingContext2D, text: string, x: number, y: number, maxX: number, dimAll: boolean) {
  let cx = x
  for (const m of text.matchAll(TOKEN)) {
    const [tok, comment, str, num, pre, word] = m
    let color = C.text
    if (comment || pre) color = C.comment
    else if (str) color = C.str
    else if (num) color = C.num
    else if (word && KEYWORDS.has(word)) color = C.kw
    else if (word && /^[A-Z]/.test(word)) color = C.type
    g.fillStyle = dimAll ? C.faint : color
    const w = g.measureText(tok).width
    if (cx + w > maxX) {
      // 넘치는 토큰은 들어가는 데까지 그리고 … 로 끝낸다 (긴 주석이 통째로 사라지지 않게)
      g.fillText(clipText(g, tok, maxX - cx), cx, y)
      return
    }
    g.fillText(tok, cx, y)
    cx += w
  }
}

export function drawCode(g: CanvasRenderingContext2D, r: Rect, v: CodeView) {
  const top = r.y + 44
  const lh = 22
  const rows = Math.floor((r.h - 56) / lh)
  // 지금 줄이 가운데 근처에 오게 창을 옮긴다 (짧은 파일은 처음부터)
  let start = 0
  if (v.lines.length > rows) start = Math.max(0, Math.min(v.lines.length - rows, v.now - Math.floor(rows / 2)))
  g.font = `400 15px ${MONO}`
  g.textBaseline = 'middle'
  for (let i = 0; i < rows && start + i < v.lines.length; i++) {
    const no = start + i + 1
    const y = top + i * lh
    const raw = v.lines[no - 1]
    const mark = v.marks.get(no)
    const text = raw.replace(/\s*\/\/ \[\d+\]\s*$/, '').replace(/\s*\/\/\s*@param\s+\w+\s*$/, '')
    if (no === v.now) {
      g.fillStyle = C.now
      g.fillRect(r.x + 8, y, r.w - 16, lh)
      g.fillStyle = C.nowEdge
      g.fillRect(r.x + 8, y, 4, lh)
    } else if (v.focus && mark === v.focus) {
      g.fillStyle = 'rgba(180, 140, 255, 0.12)'
      g.fillRect(r.x + 8, y, r.w - 16, lh)
    }
    // 줄 번호와 실행 표시
    g.textAlign = 'right'
    g.fillStyle = no === v.now ? C.text : C.faint
    g.fillText(String(no), r.x + 52, y + lh / 2)
    g.textAlign = 'left'
    if (no === v.prev && no !== v.now) {
      g.fillStyle = C.prev
      g.fillText('→', r.x + 58, y + lh / 2)
    } else if (v.visited.has(no) && no !== v.now) {
      g.fillStyle = C.faint
      g.fillText('·', r.x + 62, y + lh / 2)
    }
    if (no === v.now) {
      g.fillStyle = C.nowEdge
      g.fillText('▶', r.x + 58, y + lh / 2)
    }
    drawCodeLine(g, text, r.x + 78, y + lh / 2, r.x + r.w - (mark ? 56 : 16), v.inactive.has(no))
    if (mark) {
      const bx = r.x + r.w - 46
      g.fillStyle = mark === v.focus ? C.accent : C.border
      roundRect(g, bx, y + 3, 32, lh - 6, 8)
      g.fill()
      g.fillStyle = mark === v.focus ? '#1d0b3a' : C.dim
      g.font = `600 12px ${SANS}`
      g.textAlign = 'center'
      g.fillText(String(mark), bx + 16, y + lh / 2 + 1)
      g.textAlign = 'left'
      g.font = `400 15px ${MONO}`
    }
  }
  if (start > 0 || start + rows < v.lines.length) {
    g.fillStyle = C.dim
    g.font = `500 12px ${SANS}`
    g.textAlign = 'right'
    g.textBaseline = 'top'
    g.fillText(`${start + 1}–${Math.min(v.lines.length, start + rows)} / ${v.lines.length}줄`, r.x + r.w - 16, r.y + r.h - 20)
    g.textAlign = 'left'
  }
}

/* ───────── 값 글 ───────── */

export function valText(v: Val): string {
  switch (v.k) {
    case 'n':
      return 'null'
    case 'v':
      return v.t === 'string' ? `"${v.v}"` : v.t === 'char' ? `'${v.v}'` : v.v
    case 's':
      return `{ ${v.f.map(([n, x]) => `${n} = ${valText(x)}`).join(', ')} }`
    case 'r':
      return `→ ${v.t}`
  }
}

/** 바뀐 값 찾기용 열쇠 (참조는 가리키는 객체 번호로) */
function valKey(v: Val): string {
  return v.k === 'r' ? `#${v.id}` : valText(v)
}

/* ───────── 메모리 ───────── */

interface Anchor {
  x: number
  y: number
}

const ROW = 26
const HEAD = 30

function frameHeight(f: Frame) {
  return HEAD + Math.max(1, f.vars.length) * ROW + 8
}

function heapRows(o: HeapObj) {
  return Math.max(1, o.f.length + (o.text !== undefined ? 1 : 0) + (o.more ? 1 : 0))
}

function heapHeight(o: HeapObj) {
  return HEAD + heapRows(o) * ROW + 8
}

/** 한 칸 그리기. prev 는 바로 앞 칸 (바뀐 값을 노랗게) */
export function drawMemory(g: CanvasRenderingContext2D, r: Rect, step: TraceStep, prev: TraceStep | null) {
  const stackX = r.x + 16
  const stackW = 360
  const heapX = r.x + 420
  const heapW = r.w - 436
  const top = r.y + 44
  const bottom = r.y + r.h - 12

  g.font = `500 13px ${SANS}`
  g.textBaseline = 'top'
  g.fillStyle = C.dim
  g.fillText('스택 (위가 지금 실행 중인 메서드)', stackX, top)
  g.fillText('힙 (new 로 만든 객체)', heapX, top)

  const prevVars = new Map<string, string>()
  if (prev) {
    for (const f of prev.frames) for (const [n, v] of f.vars) prevVars.set(`${f.name}/${n}`, valKey(v))
    for (const o of prev.heap) for (const [n, v] of o.f) prevVars.set(`#${o.id}/${n}`, valKey(v))
  }
  const changed = (key: string, v: Val) => prev !== null && prevVars.has(key) && prevVars.get(key) !== valKey(v)
  const isNew = (key: string) => prev !== null && !prevVars.has(key)

  // 힙 객체 자리 먼저 (화살표 끝)
  const boxes = new Map<number, Rect>()
  let hy = top + 24
  for (const o of step.heap) {
    const h = heapHeight(o)
    boxes.set(o.id, { x: heapX, y: hy, w: heapW, h })
    hy += h + 14
  }

  /** edge = 상자 오른쪽 끝 (화살표가 상자 밖으로 나온 뒤 휜다) */
  const arrows: { from: Anchor; edge: number; to: number; fromHeap: boolean }[] = []

  const drawRows = (fields: Field[], x: number, y: number, w: number, owner: string, nameW: number) => {
    fields.forEach(([name, v], i) => {
      const ry = y + i * ROW
      const key = `${owner}/${name}`
      const cellX = x + nameW
      const cellW = w - nameW - 10
      if (changed(key, v) || isNew(key)) {
        g.fillStyle = C.changedBg
        g.fillRect(x + 2, ry + 1, w - 4, ROW - 2)
      }
      g.font = `400 14px ${MONO}`
      g.textBaseline = 'middle'
      g.fillStyle = C.text
      g.fillText(clipText(g, name, nameW - 14), x + 10, ry + ROW / 2)
      if (v.k === 'r') {
        // 참조: 칸 오른쪽 끝의 점에서 화살표가 나간다 (다른 칸 위를 지나지 않게)
        const dotX = cellX + cellW - 8
        g.strokeStyle = C.valueEdge
        roundRect(g, cellX, ry + 3, cellW, ROW - 6, 5)
        g.stroke()
        g.fillStyle = C.dim
        g.font = `400 13px ${MONO}`
        g.fillText(clipText(g, `참조 → ${v.t}`, cellW - 28), cellX + 7, ry + ROW / 2)
        g.fillStyle = C.ref
        g.beginPath()
        g.arc(dotX, ry + ROW / 2, 5, 0, Math.PI * 2)
        g.fill()
        arrows.push({ from: { x: dotX, y: ry + ROW / 2 }, edge: x + w, to: v.id, fromHeap: owner.startsWith('#') })
      } else {
        // 값 타입은 상자 안에 값이 들어 있다
        g.fillStyle = C.value
        g.strokeStyle = changed(key, v) ? C.changed : C.valueEdge
        roundRect(g, cellX, ry + 3, cellW, ROW - 6, 5)
        g.fill()
        g.stroke()
        g.fillStyle = v.k === 'n' ? C.dim : C.text
        g.fillText(clipText(g, valText(v), cellW - 14), cellX + 7, ry + ROW / 2)
      }
    })
  }

  // 스택: 정적 영역을 맨 위, 그 아래 지금 메서드부터
  const frames = [...step.frames]
  const statics = frames.filter(f => f.name === 'static')
  const calls = frames.filter(f => f.name !== 'static').reverse()
  let sy = top + 24
  for (const [k, f] of [...statics, ...calls].entries()) {
    const h = frameHeight(f)
    if (sy + h > bottom) {
      g.fillStyle = C.dim
      g.font = `500 13px ${SANS}`
      g.textBaseline = 'top'
      g.fillText(`… 프레임 ${statics.length + calls.length - k}개 더`, stackX, sy)
      break
    }
    const current = f.name !== 'static' && f === calls[0]
    g.fillStyle = f.name === 'static' ? '#1a1f2b' : current ? '#20193a' : '#171d27'
    g.strokeStyle = current ? C.nowEdge : C.border
    g.lineWidth = current ? 2 : 1
    roundRect(g, stackX, sy, stackW, h, 8)
    g.fill()
    g.stroke()
    g.lineWidth = 1
    g.fillStyle = current ? C.accent : C.dim
    g.font = `600 14px ${SANS}`
    g.textBaseline = 'middle'
    g.fillText(f.name === 'static' ? '정적 영역 (static)' : `${f.name}()`, stackX + 12, sy + HEAD / 2 + 2)
    if (!f.vars.length) {
      g.fillStyle = C.faint
      g.font = `400 13px ${SANS}`
      g.fillText('아직 기록한 변수가 없다', stackX + 12, sy + HEAD + ROW / 2)
    }
    drawRows(f.vars, stackX, sy + HEAD, stackW, f.name, 130)
    sy += h + 12
  }

  // 힙
  for (const o of step.heap) {
    const b = boxes.get(o.id)!
    if (b.y + b.h > bottom) {
      g.fillStyle = C.dim
      g.font = `500 13px ${SANS}`
      g.textBaseline = 'top'
      g.fillText('… 객체 더 있음', heapX, b.y)
      break
    }
    g.fillStyle = C.heap
    g.strokeStyle = isNew(`#${o.id}`) ? C.changed : C.heapEdge
    roundRect(g, b.x, b.y, b.w, b.h, 8)
    g.fill()
    g.stroke()
    g.fillStyle = C.text
    g.font = `600 14px ${MONO}`
    g.textBaseline = 'middle'
    const kind = { obj: '', arr: ' 배열', list: '', seq: '', dict: '', fn: ' 델리게이트' }[o.kind]
    g.fillText(clipText(g, `${o.t}${kind}`, b.w - 24), b.x + 12, b.y + HEAD / 2 + 2)
    const fields: Field[] = o.f.map(([n, v]) => [o.kind === 'arr' || o.kind === 'list' || o.kind === 'seq' ? `[${n}]` : n, v])
    drawRows(fields, b.x, b.y + HEAD, b.w, `#${o.id}`, o.kind === 'arr' || o.kind === 'list' || o.kind === 'seq' ? 60 : 130)
    let extra = fields.length
    if (o.text !== undefined) {
      g.fillStyle = C.dim
      g.font = `400 14px ${MONO}`
      g.fillText(clipText(g, o.text, b.w - 24), b.x + 12, b.y + HEAD + extra * ROW + ROW / 2)
      extra++
    }
    if (o.more) {
      g.fillStyle = C.dim
      g.font = `400 13px ${SANS}`
      g.fillText(`… ${o.more}칸 더`, b.x + 12, b.y + HEAD + extra * ROW + ROW / 2)
    }
    if (!fields.length && o.text === undefined && !o.more) {
      g.fillStyle = C.faint
      g.font = `400 13px ${SANS}`
      g.fillText(o.kind === 'obj' ? '필드 없음' : '비어 있음', b.x + 12, b.y + HEAD + ROW / 2)
    }
  }
  if (!step.heap.length) {
    g.fillStyle = C.faint
    g.font = `400 14px ${SANS}`
    g.textBaseline = 'top'
    g.fillText('아직 힙에 객체가 없다', heapX, top + 30)
  }

  // 참조 화살표: 점에서 객체 상자의 왼쪽 위로
  g.strokeStyle = C.ref
  g.fillStyle = C.ref
  g.lineWidth = 2
  for (const a of arrows) {
    const b = boxes.get(a.to)
    if (!b || b.y + b.h > bottom) continue
    const tx = b.x
    const ty = b.y + HEAD / 2
    g.beginPath()
    g.moveTo(a.from.x, a.from.y)
    const exitX = a.edge + 10
    g.lineTo(exitX, a.from.y)
    if (a.fromHeap) {
      // 힙 안 참조는 오른쪽으로 돌아 대상 상자의 오른쪽으로 들어간다
      const out = Math.max(exitX, b.x + b.w) + 14
      g.bezierCurveTo(out, a.from.y, out, ty, b.x + b.w, ty)
      g.stroke()
      arrowHead(g, b.x + b.w, ty, Math.PI)
    } else {
      const mid = (exitX + tx) / 2
      g.bezierCurveTo(mid, a.from.y, mid, ty, tx, ty)
      g.stroke()
      arrowHead(g, tx, ty, 0)
    }
  }
  g.lineWidth = 1
}

function arrowHead(g: CanvasRenderingContext2D, x: number, y: number, angle: number) {
  g.beginPath()
  g.moveTo(x, y)
  g.lineTo(x - 10 * Math.cos(angle - 0.4), y - 10 * Math.sin(angle - 0.4))
  g.lineTo(x - 10 * Math.cos(angle + 0.4), y - 10 * Math.sin(angle + 0.4))
  g.closePath()
  g.fill()
}

/* ───────── 콘솔 ───────── */

export function drawConsole(g: CanvasRenderingContext2D, r: Rect, text: string, error: string | null, ended: boolean) {
  const lines = text.split('\n')
  if (lines.at(-1) === '') lines.pop()
  if (ended) lines.push(error ? '' : '— 프로그램 끝 —')
  const lh = 22
  const rows = Math.floor((r.h - 56) / lh) - (error ? 1 : 0)
  const shown = lines.slice(Math.max(0, lines.length - rows))
  g.font = `400 15px ${MONO}`
  g.textBaseline = 'middle'
  shown.forEach((line, i) => {
    g.fillStyle = line.startsWith('— ') ? C.dim : C.text
    g.fillText(clipText(g, line, r.w - 32), r.x + 16, r.y + 44 + i * lh + lh / 2)
  })
  if (error) {
    g.fillStyle = C.bug
    g.font = `600 15px ${MONO}`
    g.fillText(clipText(g, `처리되지 않은 예외: ${error}`, r.w - 32), r.x + 16, r.y + 44 + shown.length * lh + lh / 2)
  }
  if (!lines.length && !error) {
    g.fillStyle = C.faint
    g.font = `400 14px ${SANS}`
    g.fillText('아직 출력이 없다', r.x + 16, r.y + 44 + lh / 2)
  }
}
