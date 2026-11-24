# C# 기초 갤러리 계획

- 작성: 2026-11-23. 설계는 kit 리포의 `docs/design.md` 4-1, 4-3절 (C# 문법 갤러리)이다. 이 문서는 그 설계를 이 리포에서 어떻게 했는지와 진행 기록이다.
- 공통 틀: `@koohoo/gallery-kit` v0.1.2 (`C:\Users\user\edu-lecture-gallery-kit`, GitHub `KooHoo-Dev/edu-lecture-gallery-kit`).
- 원본 교안: `krKooHoo/krKooHoo.github.io` 의 `docs/01-csharp-basic` (사이트 https://krkoohoo.github.io/01-csharp-basic/).

## 1. 결정

| 항목 | 결정 |
|---|---|
| 리포 | `KooHoo-Dev/edu-lecture-csharp-gallery`. 루트가 웹 앱이다 (패턴 갤러리와 같다) |
| 목적 (2026-11-24) | **교안을 띄워 두고 옆에서 쓰는 보조 교안.** 교안의 목차·주제·코드 예시를 그대로 따른다 (비전공자용 흐름, 조건문·반복문이 나오는 때까지 맞춰 둔 것). Unity 는 신경 쓰지 않는다 |
| 표본 | 교안 절(들)의 코드 블록을 거의 그대로 실행하는 최상위 문 콘솔 프로그램 (C# 9). order = 장 번호 × 10 + 장 안 순서, 칩 = 교안 장·절 |
| 무대 | 실행 무대 하나 (`src/stage/ExecStage.tsx`): 코드(지금 줄), 메모리(스택 프레임, 정적 영역, 힙, 참조 화살표), 콘솔 |
| 웹 = 실제 | 기록 도구(`tools/tracer`, Roslyn)가 원본을 실제로 실행한 기록을 재생한다. 웹에 C# 를 옮긴 코드가 없다 |
| 값 조절 | 미리 기록한 입력 조합만 (select, toggle. `// @param`) |
| 단계 | `// [n]` 줄을 처음 실행한 직후 |
| 효과 끄기 | 교안의 ❌ 상황. `#if GALLERY_MISTAKE` 를 켜고 실행한 기록. 컴파일 오류면 오류 줄과 메시지 |
| 그룹 | 교안 파트 (지금은 A = Part 1 만) |
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

### 2026-11-24 교안 목차를 따르는 보조 교안으로 다시 짬

- Jay 피드백: 앞의 표본 13개는 장마다 개념을 골라 새 예시로 만들어 교안 흐름과 달랐다 (01장 표본에 for 를 쓰는 등 아직 배우지 않은 문법도 썼다). 갤러리는 교안을 띄워 두고 옆에서 메모리와 출력을 보여 주는 보조 교안이어야 하고, 교안의 목차와 주제를 그대로 따른다. 우선 01 변수, 02 자료형, 03 연산자, 04 콘솔 입출력. 나머지는 내려도 된다.
- 내린 것: 표본 15개 전부 (`value-vs-reference`, `array-alias` 와 Part 1 표본 13개). 커밋 `c0294e0` 에 남아 있다. 준비 중 카드는 교안 05~13장으로 바꿨다.
- 기록 도구: 최상위 문 원본 (프레임 이름 Main, `using System;` 은 1번 줄 앞에 붙여 줄 번호 유지), 선언만 한 지역 변수를 '값 없음' 으로 (`__T.U`, Roslyn `DefinitelyAssignedOnEntry`), 보이는 지역 변수를 문법 대신 의미 분석(`LookupSymbols`)으로 구한다, `Console.ReadLine` 입력 (`run.stdin`, 읽은 줄을 콘솔에 찍는다), 효과 끄기 실행이 컴파일 오류면 오류 기록 (`compile: true`, 오류 줄 `bad`).
- 무대: 값 없음 점선 상자, 컴파일 오류 줄 빨간 표시와 메시지, 메모리 칸 안내. 입력값 key `stdin` (값의 `|` 가 줄바꿈). `CONSOLE_UNITY` 공통 Unity 글. 도메인 검사: 최상위 문 원본 허용, `Console.ReadLine` 은 `stdin` 입력값이 있을 때만.
- 새 기준 샘플 `variable-four-stages` (01장 3.1~3.3 · 4.2 · 4.3): 교안 4.2 코드를 줄 번호까지 그대로, 교안의 강조 줄(2·5·9·13)이 네 단계, 4.3 ❌ 가 효과 끄기 (CS0165 컴파일 오류 화면).
- 리뷰 요청으로 더한 것: 메모리의 스택 변수 칸 오른쪽에 자료형(int, float, decimal …)을 흐리게 적는다 (02장의 핵심). 프로그램 끝 칸에도 마지막 변수 상태를 남긴다 (최상위 문은 마지막 문장 뒤 상태 `__T.Final`, 그 밖은 마지막 칸 상태).
- 제작: 워크플로우로 제작 6묶음 + 리뷰어 2명. 전체 `gallery check` 통과, 경고 2개 (`console-tryparse` 는 교안 4.3 ✅ 가 네 문장이라 5칸뿐이라 이벤트 검사가 경고한다).
- Jay 확인 거리: (1) `datatype-value-vs-reference` 는 교안 3.3·3.4·4.2 에 ❌ 가 없어 효과 끄기(`int[] arrC = arrA;`)를 3.4 설명을 바탕으로 만들어 넣었다. (2) 교안 블록이 코드로 시작하는 표본은 첫 줄 주석 규칙 때문에 줄 번호가 교안보다 하나 밀린다. (3) 교안 수정 거리: 03장 3.4 출력 주석 `true` (콘솔은 `True`), 03장 5절 '100.0 인 것에 주의' 주석 (핵심은 `(double)`), '괄호로 묶이는 단위를 드러낸다' 아래 줄에 괄호 없음, 02장 5절 할인율 출력은 `15.00%`, 02장 3.1·4.1·4.3 블록이 같은 이름(level, pi, speed, grade)을 다시 선언해 한 파일에 잇지 못한다.
- 01~04장 표본 목록 (교안 목차 순서): 11 `variable-four-stages`, 12 `variable-game-character`, 21 `datatype-basic-types`, 22 `datatype-value-vs-reference`, 23 `datatype-shop-detail`, 31 `operator-arithmetic-assign`, 32 `operator-compare-logic`, 33 `operator-increment-ternary`, 34 `operator-before-after`, 35 `operator-skill-check`, 41 `console-read-parse`, 42 `console-tryparse`, 43 `console-normalize`, 44 `console-guard-character`.

## 5. 남은 일

1. GitHub Settings > Pages > Source 를 GitHub Actions 로 (Jay). 리포 생성과 첫 push 는 2026-11-23 에 했다.
2. 교안 05장부터 같은 방식으로 (Jay 가 순서를 정한다). 05장 전에 기록 도구가 `else if` 조건, `for` · `while` 조건 검사를 칸으로 남겨야 조건문·반복문의 흐름이 보인다 (조건식 값 true/false 표시도).
3. 예측 질문 (`steps[].ask`): 그 줄에서 멈추고 보기를 고르게 한 뒤 진행. 설계 4-3절.
4. 기록 도구: 문자열을 힙 객체로 그리는 선택 (교안이 문자열 불변을 다룰 때).
5. 무대: 힙이 한 열이라 객체 5~6개를 넘으면 접힌다. 08장 배열 전에 두 열 배치나 줄 높이 줄이기.
6. 단계 표시: 핵심 줄이 `#if GALLERY_MISTAKE` 구역 안에 있으면 다음 공통 줄에 둘 수밖에 없다. '구역 직후' 표시 방법을 검토.
7. 썸네일 시각을 표본마다 정하는 칸.
8. JayDispatch 잡 틀 (`jobs/`, `tools/workflow/`): writePaths(`samples/<id>/`, `src/specimens/<id>/`, `truth/<id>/`, `src/shots/<id>/`), verify(`npm run trace -- <id> --no-build`, `check <id>`).
9. (해결 2026-11-24) 교안 `02_datatype.md` 의 float 출력 주석을 고쳤다 (krKooHoo.github.io `882b997`).
