// C# 갤러리 도메인 검사 (Node 쪽). kit 의 gallery check 가 부른다. 브라우저 쪽 규칙은 src/gallery.config.tsx 의 lint.
//   1. 원본: samples/<id>/ 에 Main 이 있는 .cs 하나 (또는 최상위 문 .cs 하나), 클래스로 쓴 원본은 namespace CSharpGallery.<Pascal id> 블록,
//            첫 줄 주석, // [n] 은 코드 줄 끝, 단계마다 // [n], 입력값마다 // @param <key> (stdin 은 Console.ReadLine 입력이라 제외)
//   2. 기록: truth/<id>/trace.json 이 있고, 지문이 지금 원본·기록 도구와 같고, 모든 입력 조합이 있고,
//            단계 표시 줄을 기본 입력의 기록이 실제로 지나간다

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadMeta, loadTypes, mainFile, read, sampleDir, sampleFiles, sourceHash, tracePath } from './lib/trace-lib.mjs'

const pascal = id => id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')

export default async function checkDomain({ project, ids, err, warn }) {
  const root = project.root
  const { allCombos, runKey, STDIN } = await loadTypes(root)
  for (const id of ids) {
    const files = sampleFiles(root, id)
    if (!files.length) {
      err(`${id}: samples/${id}/ 에 원본 .cs 가 없다`)
      continue
    }
    const main = mainFile(root, id)
    if (!main) err(`${id}: samples/${id}/ 에 static void Main 이 있는 .cs 가 하나(또는 최상위 문 .cs 하나만) 있어야 한다`)
    let meta
    try {
      meta = await loadMeta(root, id)
    } catch (e) {
      err(`${id}: meta.ts 를 Node 가 읽지 못한다 (타입은 import type, 상대 경로는 .ts 확장자): ${e.message}`)
      continue
    }
    const hasStdin = meta.params.some(p => p.key === STDIN)

    const ns = new RegExp(`namespace\\s+CSharpGallery\\.${pascal(id)}\\s*\\{`)
    for (const name of files) {
      const rel = `samples/${id}/${name}`
      const code = read(join(sampleDir(root, id), name))
      const topLevel = !/\bstatic\s+(void|int)\s+Main\s*\(/.test(code)
      if (!topLevel && !ns.test(code)) err(`${rel}: namespace CSharpGallery.${pascal(id)} { … } 블록 안에 둔다 (Unity 프로젝트 하나에 표본을 모두 넣어도 이름이 겹치지 않게)`)
      if (/^\s*namespace\s+[\w.]+\s*;/m.test(code)) err(`${rel}: 파일 범위 namespace 는 Unity 6 의 C# 9 에서 안 된다`)
      if (!/^\s*\/\/.*\S/.test(code.split('\n').find(l => l.trim()) ?? '')) warn(`${rel}: 첫 줄에 무엇을 보여 주는 프로그램인지 한국어 주석을 둔다`)
      code.split('\n').forEach((line, i) => {
        if (/^\s*\/\/ \[\d+\]/.test(line)) err(`${rel}:${i + 1}: // [n] 은 코드 줄 끝에 둔다 (단계 보기가 그 줄을 실행한 직후로 간다)`)
      })
      const noComments = code.split('\n').map(l => l.replace(/\/\/.*$/, '')).join('\n')
      if (/\bConsole\.(ReadKey|Read)\s*\(/.test(noComments)) err(`${rel}: ReadKey · Read 는 기록할 수 없다. 줄 입력(ReadLine)만 쓴다`)
      if (/\bConsole\.ReadLine\s*\(/.test(noComments) && !hasStdin) err(`${rel}: Console.ReadLine 을 쓰면 meta.params 에 입력값 ${STDIN} (읽을 입력, | 로 줄 나눔) 을 둔다`)
      if (/\bnew\s+Random\s*\(\s*\)/.test(code)) err(`${rel}: 시드 없는 Random 은 실행마다 결과가 달라 기록과 맞지 않는다. new Random(시드) 를 쓴다`)
    }
    if (!main) continue
    const source = read(join(sampleDir(root, id), main))
    const lines = source.split('\n')
    const markLines = n => lines.flatMap((l, i) => (new RegExp(`// \\[${n}\\]\\s*$`).test(l) ? [i + 1] : []))
    for (const st of meta.steps) if (!markLines(st.n).length) err(`${id}: ${st.n}단계를 가리키는 // [${st.n}] 표시가 ${main} 에 없다`)
    for (const p of meta.params) {
      if (p.type !== 'select' && p.type !== 'toggle') err(`${id}: 입력값 ${p.key} 는 select 나 toggle 이어야 한다 (미리 기록한 조합만 재생한다)`)
      if (p.key !== STDIN && !new RegExp(`//.*@param\\s+${p.key}\\b`).test(source)) err(`${id}: 입력값 ${p.key} 의 선언 줄에 // @param ${p.key} 가 없다`)
    }
    if (!meta.lecture?.length) warn(`${id}: meta.lecture 에 원본 교안 장이 없다`)

    // 기록
    const path = tracePath(root, id)
    if (!existsSync(path)) {
      err(`${id}: 기록이 없다 (truth/${id}/trace.json). npm run trace -- ${id}`)
      continue
    }
    const trace = JSON.parse(readFileSync(path, 'utf8'))
    if (trace.hash !== sourceHash(root, id, main)) err(`${id}: 기록이 지금 원본(또는 기록 도구)과 다르다. npm run trace -- ${id}`)
    const hasMistake = /#if\s+GALLERY_MISTAKE\b/.test(source)
    if (!hasMistake) err(`${id}: 효과 끄기용 #if GALLERY_MISTAKE 구역이 원본에 없다`)
    for (const values of allCombos(meta.params)) {
      const key = runKey(meta.params, values)
      const slot = trace.runs[key]
      if (!slot?.normal || (hasMistake && !slot.mistake)) err(`${id}: 기록에 입력 조합 ${key || '(입력 없음)'} 이 없다. npm run trace -- ${id}`)
    }
    const base = trace.runs[runKey(meta.params, {})]?.normal
    if (base) {
      for (const st of meta.steps) {
        const want = markLines(st.n)
        if (want.length && !base.steps.some(s => want.includes(s.line))) err(`${id}: ${st.n}단계 표시 줄(${want.join(', ')}번)을 기본 입력의 실행이 지나가지 않는다`)
      }
      if (base.steps.length > 400) warn(`${id}: 기본 실행이 ${base.steps.length}칸이다. 수업에서 따라가기에 길다 (200칸 안팎 권장)`)
    }
  }
}
