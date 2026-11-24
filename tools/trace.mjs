// 실행 기록 만들기: 표본 C# 를 기록 도구(tools/tracer, dotnet)로 실행해 truth/<id>/trace.json 을 쓴다.
//   npm run trace                 모든 표본
//   npm run trace -- <id> ...     지정한 표본
//   npm run trace -- <id> --no-build   기록 도구를 다시 빌드하지 않는다 (동시에 여러 표본을 기록할 때)
// 입력 조합(meta.params 의 select 값 × toggle)마다 보통 실행, 원본에 #if GALLERY_MISTAKE 가 있으면 그것을 켠 실행도 남긴다.
// 입력값 key 'stdin' 은 Console.ReadLine 이 읽는 입력이다 (값의 | 가 줄바꿈). 효과 끄기 실행이 컴파일되지 않으면 오류 줄과 메시지를 남긴다.
// .NET SDK 10 이 있어야 한다. CI 는 커밋된 기록으로 검사하므로 dotnet 이 필요 없다.

import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadMeta, loadTypes, mainFile, read, sampleDir, sourceHash, tracePath } from './lib/trace-lib.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const TRACER = join(ROOT, 'tools', 'tracer')

const all = readdirSync(join(ROOT, 'src', 'specimens'), { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
const ids = process.argv.slice(2).filter(a => !a.startsWith('--'))
for (const id of ids) if (!all.includes(id)) fail(`표본 폴더가 없다: src/specimens/${id}`)

const dll = join(TRACER, 'bin', 'Release', 'net10.0', 'Tracer.dll')
// --no-build: 이미 빌드한 기록 도구를 쓴다 (여러 표본을 동시에 기록할 때 dotnet build 가 서로 파일을 잠그지 않게)
if (process.argv.includes('--no-build') && existsSync(dll)) console.log('기록 도구 빌드 건너뜀 (--no-build)')
else {
  console.log('기록 도구 빌드 (dotnet build)')
  const build = spawnSync('dotnet', ['build', TRACER, '-c', 'Release', '-v', 'q', '-nologo'], { encoding: 'utf8' })
  if (build.status !== 0) fail(`기록 도구 빌드 실패\n${build.stdout}\n${build.stderr}`)
}

const { allCombos, runKey, MAX_COMBOS, STDIN } = await loadTypes(ROOT)
let failed = false
for (const id of ids.length ? ids : all) {
  const meta = await loadMeta(ROOT, id)
  const file = mainFile(ROOT, id)
  if (!file) {
    console.log(`${id}: samples/${id}/ 에 static void Main 이 있는 .cs 가 하나여야 한다`)
    failed = true
    continue
  }
  const bad = meta.params.filter(p => p.type !== 'select' && p.type !== 'toggle')
  if (bad.length) {
    console.log(`${id}: 입력값은 select, toggle 만 쓴다 (미리 기록한 조합만 재생한다): ${bad.map(p => p.key).join(', ')}`)
    failed = true
    continue
  }
  const combos = allCombos(meta.params)
  if (combos.length > MAX_COMBOS) {
    console.log(`${id}: 입력 조합이 ${combos.length}개다 (최대 ${MAX_COMBOS})`)
    failed = true
    continue
  }
  const source = read(join(sampleDir(ROOT, id), file))
  const hasMistake = /#if\s+GALLERY_MISTAKE\b/.test(source)
  const runs = combos.flatMap(values => {
    const key = runKey(meta.params, values)
    // 입력값 stdin 은 코드가 아니라 Console.ReadLine 이 읽는 입력이다 (| 로 줄을 나눈다)
    const v = Object.fromEntries(Object.entries(values).filter(([k]) => k !== STDIN).map(([k, x]) => [k, String(x)]))
    const stdin = values[STDIN] === undefined ? '' : String(values[STDIN]).split('|').join('\n')
    return [{ key, mistake: false, values: v, stdin }, ...(hasMistake ? [{ key, mistake: true, values: v, stdin }] : [])]
  })
  const res = spawnSync('dotnet', [dll], { input: JSON.stringify({ file: `samples/${id}/${file}`, source, runs }), encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
  let out
  try {
    out = JSON.parse(res.stdout)
  } catch {
    console.log(`${id}: 기록 도구가 결과를 내지 못했다\n${res.stderr || res.stdout}`.slice(0, 4000))
    failed = true
    continue
  }
  if (out.errors.length) {
    console.log(`${id}: 기록 실패\n  ${out.errors.join('\n  ')}`)
    failed = true
    continue
  }
  const trace = { id, file: `samples/${id}/${file}`, hash: sourceHash(ROOT, id, file), runs: out.runs }
  const path = tracePath(ROOT, id)
  mkdirSync(dirname(path), { recursive: true })
  const text = JSON.stringify(trace)
  writeFileSync(path, text + '\n')
  const steps = Object.values(out.runs).flatMap(r => Object.values(r).map(x => x.steps.length))
  console.log(`${id}: 실행 ${runs.length}개, 칸 ${Math.min(...steps)}~${Math.max(...steps)}개, ${(text.length / 1024).toFixed(0)} KB -> truth/${id}/trace.json`)
}
if (!existsSync(dll)) failed = true
process.exitCode = failed ? 1 : 0

function fail(message) {
  console.log(message)
  process.exit(1)
}
