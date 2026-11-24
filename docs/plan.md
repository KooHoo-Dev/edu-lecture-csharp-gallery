# C# 기초 갤러리 계획

- 작성: 2026-11-23. 설계는 kit 리포의 `docs/design.md` 4-1, 4-3절 (C# 문법 갤러리)이다. 이 문서는 그 설계를 이 리포에서 어떻게 했는지와 진행 기록이다.
- 공통 틀: `@koohoo/gallery-kit` v0.1.2 (`C:\Users\user\edu-lecture-gallery-kit`, GitHub `KooHoo-Dev/edu-lecture-gallery-kit`).
- 원본 교안: `krKooHoo/krKooHoo.github.io` 의 `docs/01-csharp-basic` (사이트 https://krkoohoo.github.io/01-csharp-basic/).

## 1. 결정

| 항목 | 결정 |
|---|---|
| 리포 | `KooHoo-Dev/edu-lecture-csharp-gallery`. 루트가 웹 앱이다 (패턴 갤러리와 같다) |
| 표본 | 교안 개념 하나를 보여 주는 짧은 콘솔 프로그램 (C# 9). Unity 에도 그대로 들어간다 |
| 무대 | 실행 무대 하나 (`src/stage/ExecStage.tsx`): 코드(지금 줄), 메모리(스택 프레임, 정적 영역, 힙, 참조 화살표), 콘솔 |
| 웹 = 실제 | 기록 도구(`tools/tracer`, Roslyn)가 원본을 실제로 실행한 기록을 재생한다. 웹에 C# 를 옮긴 코드가 없다 |
| 값 조절 | 미리 기록한 입력 조합만 (select, toggle. `// @param`) |
| 단계 | `// [n]` 줄을 처음 실행한 직후 |
| 효과 끄기 | `#if GALLERY_MISTAKE` 를 켜고 실행한 기록 |
| 그룹 | 교안 파트 A~E |
| AI 세트 | 설명해 줘, 예측 문제 만들기, 내 코드 점검, Unity 로 옮기기. Skill `csharp-for-unity` |

## 2. 리포 구조

```text
edu-lecture-csharp-gallery/
├─ src/
│  ├─ main.tsx, gallery.config.tsx, registry.ts, ai.ts, theme.css
│  ├─ stage/            실행 무대 (types, draw, ExecStage)
│  ├─ specimens/<id>/   meta.ts
│  └─ shots/<id>/       무대 썸네일 (gallery thumbs)
├─ samples/<id>/        원본 C# (Main 이 있는 콘솔 프로그램)
├─ truth/<id>/          trace.json (실행 기록, 생성물, 커밋)
├─ tools/
│  ├─ gallery.mjs       kit 도구 진입점 (kit 템플릿)
│  ├─ tracer/           기록 도구 (dotnet 콘솔, Roslyn 4.12)
│  ├─ trace.mjs         npm run trace: 입력 조합마다 기록 도구를 돌려 truth/ 에 쓴다
│  ├─ check-domain.mjs  도메인 검사 (kit check 가 부른다)
│  ├─ lib/trace-lib.mjs 기록 공용 (지문, meta 읽기)
│  └─ kit-sync.mjs      로컬 kit 변경을 node_modules 에 복사 (확인용)
├─ skill/csharp-for-unity/  Skill (생성물, 커밋)
└─ docs/                plan, handoff, specimen-guide, selection
```

## 3. 기록 도구 (tools/tracer)

설계 4-3절의 '트레이서 시험'을 이 뼈대에서 했다. 결과: **Roslyn 문장 단위 끼워 넣기로 간다** (축소판 불필요).

- 원본을 C# 9 로 파싱하고, `// @param` 초기값을 바꾼 뒤(줄 수 유지), 메서드·생성자·로컬 함수 본문의 문장마다 앞에 `__T.L(원래 줄, 보이는 변수...)` 를 끼운다. 본문은 `__T.Enter(이름)` + `try { } finally { __T.Exit(); }` 로 감싼다. `if (x) y++;` 처럼 블록이 아닌 자리의 문장은 `{ 기록; 문장 }` 으로 감싼다. `=>` 식 본문 메서드는 블록으로 바꾼다.
- 보이는 변수는 문법 트리로 구한다: 앞선 형제 문장의 초기화된 지역 변수, for/foreach/using/catch 변수, out 이 아닌 매개변수, 인스턴스 메서드의 this (구조체 생성자 제외).
- 기록 런타임(`Runtime.cs.txt`)을 같이 컴파일해 메모리에서 실행한다. 칸마다 프레임별 변수, 정적 필드, 변수에서 닿는 힙 객체(필드, 배열·List·Dictionary 칸), 새 콘솔 출력을 JSON 으로 남긴다.
- 원본을 그대로 먼저 컴파일해 표본 자체의 오류는 원래 줄 번호로 알린다.
- 시험한 것 (`value-vs-reference` 와 시험 프로그램): struct 복사, 참조 공유, 메서드 호출 프레임, 정적 필드, 배열, List, for 본문 문장, if/else 한 줄 문장, 식 본문 메서드, 생성자, 잡히지 않은 예외 (GALLERY_MISTAKE 에서 NullReferenceException, 마지막 스택 유지).
- 아직 시험하지 않은 것: `yield` 이터레이터, `async`, 람다 안 문장(지금은 기록하지 않음), 재귀 깊이, 순환 참조 객체(같은 객체는 번호 하나라 무한히 펼치지 않는다), 큰 배열(40칸까지).
- 기록 크기: `value-vs-reference` 실행 4개(입력 2 × 보통·실수) 10칸씩 12KB. 칸마다 힙 전체를 다시 적으므로 긴 표본은 커진다. 표본당 gzip 45KB 예산 안에서 200칸 안팎.

## 4. 진행 기록

### 2026-11-23 뼈대

- kit v0.1.2 로 설치. 갤러리 설정, 실행 무대, 기록 도구, `npm run trace`, 도메인 검사, AI 세트, Skill, 배포 워크플로.
- 기준 샘플 1 `value-vs-reference` (교안 P2-05, P2-02). `gallery check` 전체 통과(경고 0), Unity 컴파일 통과(6000.3.20f1).
- 단계 보기를 '표시 줄 직전' 에서 '표시 줄 직후' 로 바꿨다. 그 줄이 한 일이 메모리에 보여야 수업에서 쓰기 좋다.
- 교안 조사로 후보 16개를 골랐다 (selection.md).

### 2026-11-23 기준 샘플 2

- `array-alias` (교안 P1-08 §3.4, §8, part6 04 A6 해설). 대입(`copy = original`)과 메서드 전달(`Clamped(enemyHealths)`)이 같은 원리(주소 복사)임을 한 프로그램에 이었다. Main 과 Clamped 프레임 둘, 힙 배열 셋.
- 입력값은 select 3개(`= original`, `new int[original.Length]`, `(int[])original.Clone()`)로, 값이 C# 식이다. 효과 끄기는 메서드 안 `int[] result = healths;` (원본을 고쳐 돌려줌).
- 실행 6개(입력 3 × 보통·실수) 16칸씩, 기록 55KB. `gallery check` 전체 통과(경고 0), Unity 컴파일 통과.
- 본 것: 힙 배치는 Main 부터 닿는 순서라 단계가 바뀌어도 배열 자리가 그대로다. 대신 위쪽 Clamped 프레임의 화살표가 아래 배열로 가며 Main 의 화살표와 엇갈린다. 자리가 움직이지 않는 쪽이 낫다고 보고 두었다.

### 2026-11-24 비유 장면을 시도하고 걷어 냄

- Jay 요청으로 편의점·물류 센터 비유를 무대에 넣어 봤다. 세 판을 만들었다: 메모리 패널을 테마로 다시 그린 비유 장면, 사람 캐릭터가 일하고 말하는 1장 애니메이션(2D), 같은 대본의 three.js 3D 디오라마.
- Jay 결정: 비유는 강사가 말로 설명한다. 무대에서 비유를 모두 걷어 냈다 (장면·대본·three 의존성). 무대는 다시 코드 + 메모리 + 콘솔 한 화면이다.
- 남긴 것: 기록 런타임의 힙 객체 번호를 실제 객체 정체성으로 고정한 것 (남은 일 5). 단계가 바뀌어도 같은 객체가 같은 번호라 메모리 그림 비교에도 낫다.

### 2026-11-24 교안 Part 1 표본 13개

- 기록 도구: `ref` · `in` 매개변수를 부른 쪽 변수(지역 변수, 매개변수, 정적 필드)로 잇는다. 부르는 문장 앞에서 `__T.RefArg` 로 남기고 `Enter` 가 가져가며, 부른 쪽 변수 칸은 ref 매개변수의 지금 값으로 바꿔 보인다 (같은 자리라서). `object` · 인터페이스 자리의 값 타입은 힙의 박싱 상자(`kind: 'box'`)로 그린다. 무대는 ref 를 초록 점선 상자와 화살표로, 박싱 상자를 `int (박싱된 값)` 으로 그린다. 기존 두 표본은 기록을 다시 만들었고 지문 말고는 같다.
- `npm run trace -- <id> --no-build`: 여러 표본을 동시에 기록할 때 dotnet build 가 서로 파일을 잠그지 않게.
- 표본 13개 (그룹 A, order = 교안 장 순서. `array-alias` 는 8): `variable-reassign`(01), `float-precision`(02), `integer-division`(03), `tryparse-guard`(04), `if-chain-order`(05), `loop-accumulator`(06), `break-one-level`(07), `jagged-array`(09), `return-value`(10), `pass-by-value-ref` · `ref-param-reassign`(11), `static-shared-counter`(12), `boxing-unboxing`(13). 연산·조건·반복 장도 실행 결과가 갈리는 실수가 있는 개념만 골랐다 (selection.md 7절 쟁점에 대한 답).
- 만든 방법: 워크플로우로 제작 7묶음을 병렬로 돌리고, 리뷰어 2명이 기록 출력·단계 화면·효과 끄기 화면을 대조해 고쳤다. 전체 `gallery check` 통과(경고 0), Unity 컴파일 15개 통과, Skill 31개 파일.
- 무대: 예외 문구를 자르지 않고 3줄까지 접는다 (`boxing-unboxing` 의 `System.Int32 → System.Int64` 가 보이게). 정적 영역 이름 칸을 넓혔다.

## 5. 남은 일

1. GitHub Settings > Pages > Source 를 GitHub Actions 로 (Jay). 리포 생성과 첫 push 는 2026-11-23 에 했다.
2. 예측 질문 (`steps[].ask`): 그 줄에서 멈추고 보기를 고르게 한 뒤 진행. 설계 4-3절. 무대와 meta 형식.
3. 기준 샘플 2개(`value-vs-reference`, `array-alias`) 독립 리뷰. 그 뒤 워커 묶음으로.
4. 기록 도구: 문자열을 힙 객체로 그리는 선택(`string-immutable`). 박싱 상자와 ref 화살표는 2026-11-24 에 했다.
5. (해결 2026-11-24) 힙 객체 번호를 실제 객체 정체성으로 고정했다.
6. JayDispatch 잡 틀 (`jobs/`, `tools/workflow/`): 패턴 갤러리 것을 가져와 writePaths(`samples/<id>/`, `src/specimens/<id>/`, `truth/<id>/`, `src/shots/<id>/`), verify(`npm run trace -- <id> --no-build`, `check <id>`, `unity-compile <id>`) 로 바꾼다.
7. 기록 도구: `else if` 조건, `for`·`while` 조건 검사를 칸으로 남기기 (조건식 값 true/false 표시도). 지금은 `if-chain-order` 가 갈래를 한 줄로 써서 피해 갔다.
8. 무대: 힙이 한 열이라 객체 5~6개를 넘으면 접힌다 (`static-shared-counter` 의 4개 프리셋, `jagged-array`). 두 열 배치나 넘칠 때 줄 높이 줄이기. heap-reachability, List 계열 전에 필요하다.
9. 단계 표시: 핵심 줄이 `#if GALLERY_MISTAKE` 구역 안에 있으면 다음 공통 줄에 둘 수밖에 없어 한 칸 뒤 화면이 된다 (`variable-reassign`, `float-precision`). '구역 직후' 표시 방법을 검토.
10. 도메인 검사: namespace 를 id 의 단어 첫 글자만 대문자로 보므로 `tryparse-guard` 는 `CSharpGallery.TryparseGuard` 다 (대소문자 무시 비교 검토). `Console.ReadLine` 금지 검사가 주석에도 걸린다.
11. 썸네일 시각을 표본마다 정하는 칸 (`pass-by-value-ref` 처럼 핵심 그림이 늦게 나오는 표본).
12. 교안 수정 (krKooHoo.github.io): `02_datatype.md` 99~100줄의 `Console.WriteLine(1234567.8f) // 1234568` 은 .NET Core 3.0 이후 `1234567.8` 이다 (`float-precision` 리뷰에서 발견).
