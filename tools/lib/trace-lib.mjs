// 실행 기록 공용 도구. tools/trace.mjs (기록 만들기)와 tools/check-domain.mjs (기록 검사)가 쓴다.
// Node 는 갤러리의 TS 를 직접 읽는다 (타입 지우기). 그래서 meta.ts 와 stage/types.ts 는 타입만 import 하고
// 런타임 import 는 확장자를 붙인 상대 경로(.ts)만 쓴다 (docs/specimen-guide.md 3절).

import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

export const sampleDir = (root, id) => join(root, 'samples', id)
export const tracePath = (root, id) => join(root, 'truth', id, 'trace.json')

/** 표본 폴더의 .cs (이름순) */
export const sampleFiles = (root, id) =>
  existsSync(sampleDir(root, id))
    ? readdirSync(sampleDir(root, id))
        .filter(n => n.endsWith('.cs'))
        .sort()
    : []

/** 기록하는 원본: static void Main 이 있는 파일 (하나여야 한다). 최상위 문 원본은 폴더의 유일한 .cs */
export function mainFile(root, id) {
  const files = sampleFiles(root, id)
  const mains = files.filter(n => /\bstatic\s+(void|int)\s+Main\s*\(/.test(read(join(sampleDir(root, id), n))))
  if (mains.length === 1) return mains[0]
  // 교안처럼 최상위 문으로 쓴 원본 (Main 없이): 폴더에 .cs 가 하나면 그것
  return mains.length === 0 && files.length === 1 ? files[0] : null
}

export const read = path => readFileSync(path, 'utf8').replace(/\r\n/g, '\n')

/** 기록이 기대는 원본의 지문 (원본, 기록 런타임, 트레이서). 바꾸고 기록을 다시 만들지 않으면 검사가 잡는다 */
export function sourceHash(root, id, file) {
  const hash = createHash('sha1')
  hash.update(read(join(sampleDir(root, id), file)))
  for (const t of ['Program.cs', 'Runtime.cs.txt']) hash.update(read(join(root, 'tools', 'tracer', t)))
  return hash.digest('hex').slice(0, 12)
}

export async function loadMeta(root, id) {
  return (await import(pathToFileURL(join(root, 'src', 'specimens', id, 'meta.ts')).href)).meta
}

export async function loadTypes(root) {
  return import(pathToFileURL(join(root, 'src', 'stage', 'types.ts')).href)
}
