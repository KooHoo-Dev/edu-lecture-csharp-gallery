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

## 5. 남은 일

1. GitHub Settings > Pages > Source 를 GitHub Actions 로 (Jay). 리포 생성과 첫 push 는 2026-11-23 에 했다.
2. 예측 질문 (`steps[].ask`): 그 줄에서 멈추고 보기를 고르게 한 뒤 진행. 설계 4-3절. 무대와 meta 형식.
3. 기준 샘플 2: 메서드 프레임이 둘 이상인 표본 (`pass-by-value-ref` 또는 `array-alias`). 기준 샘플 2개를 독립 리뷰한 뒤 워커 묶음으로.
4. 기록 도구: 문자열을 힙 객체로 그리는 선택(`string-immutable`), 박싱된 값을 힙 상자로(`boxing-unboxing`), `ref` 매개변수를 호출한 쪽 변수로 잇는 화살표(`pass-by-value-ref`). 지금 ref 매개변수는 값만 보인다.
5. 힙 객체 번호는 칸마다 닿는 순서로 다시 매긴다. 순서가 바뀌는 표본에서 '바뀐 값' 노란 표시가 잘못 켜질 수 있다. 실제 객체 정체성(런타임에서 한 번 준 번호)을 유지하도록 고친다.
6. JayDispatch 잡 틀 (`jobs/`, `tools/workflow/`): 패턴 갤러리 것을 가져와 writePaths(`samples/<id>/`, `src/specimens/<id>/`, `truth/<id>/`, `src/shots/<id>/`), verify(`npm run trace -- <id>`, `check <id>`, `unity-compile <id>`) 로 바꾼다.
