# C# 표본 제작 가이드

C# 갤러리 전용 규칙이다. 모든 갤러리가 지키는 공통 규칙(meta 글쓰기, 콘텐츠 정책, 무대 계약, 검사)은 kit 의 `docs/kit-guide.md` (`node_modules/@koohoo/gallery-kit/docs/kit-guide.md`) 를 따른다.

## 0. 기준 샘플

| 표본 | 무엇의 기준인가 |
|---|---|
| `value-vs-reference` | 폴더 구성, 원본 코드 모양, 단계 표시, 효과 끄기(`#if GALLERY_MISTAKE`), toggle 입력값, meta 글 |
| `array-alias` | 메서드 프레임이 둘인 표본 (부르는 줄과 `return` 줄의 단계), 메서드 안의 효과 끄기, C# 식을 값으로 쓰는 select 입력값, 한 줄에 `// @param` 과 `// [n]` 함께 쓰기 |

## 1. 표본 하나 = 파일 셋

```text
samples/<id>/<Name>.cs          원본. static void Main 이 있는 짧은 콘솔 프로그램 (C# 9). Unity 에도 그대로 들어간다
src/specimens/<id>/meta.ts      글, 입력값(params), 단계 (타입은 src/stage/types.ts 의 CsMeta)
truth/<id>/trace.json           npm run trace -- <id> 가 만든 실행 기록 (생성물, 커밋)
```

- `id` 는 개념 이름의 kebab-case 영어다 (`value-vs-reference`, `array-alias`). 영구 불변.
- 그룹은 교안 파트다: A 기초 문법, B 메모리와 구조, C 실용 도구, D 객체 지향, E 컬렉션과 델리게이트.
- Unity 판 예시가 필요하면 같은 폴더에 `<Name>Behaviour.cs` 를 둔다 (기록하지 않고 코드 탭에만 보인다).

## 2. 원본 코드 (`samples/<id>/<Name>.cs`)

- 첫 줄은 무엇을 보여 주는 프로그램인지 한국어 주석 한 줄. 코드 주석은 교안처럼 한다체.
- 모든 형식은 `namespace CSharpGallery.<PascalCase id> { … }` 블록 안에 둔다 (Unity 프로젝트 하나에 모든 표본을 넣어도 겹치지 않게). 파일 범위 namespace, top-level 문은 쓰지 않는다 (C# 9, Unity).
- **짧게.** 수업 화면에 한 번에 들어오도록 50줄 안팎, 기본 실행 200칸 안팎. 무대 코드 칸은 37줄이 보인다.
- 콘솔 입력(`Console.ReadLine`)은 쓰지 않는다. 입력은 `// @param` 값으로 받는다 (4절).
- 시드 없는 `new Random()` 은 쓰지 않는다 (실행마다 결과가 달라 기록과 어긋난다). `new Random(42)`.
- 소재는 교안을 따른다: Player, Monster, 슬라임, 전사, Health, 골드. 용어는 값 타입·참조 타입, 메서드, 매개변수·인자.

### 기록 도구의 한계 (코드를 이렇게 쓴다)

기록 도구는 문장 앞마다 `__T.L(줄, 보이는 변수...)` 를 끼워 실행한다. 그래서:

- **지역 변수는 선언할 때 초기화한다.** `int x; x = 5;` 처럼 나중에 넣은 변수는 무대에 보이지 않는다 (값이 확실히 정해졌는지 도구가 알 수 없다).
- 람다 안, 속성 접근자(`get`/`set` 본문) 안의 문장은 줄 단위로 기록하지 않는다. 그 안의 동작을 보여 줘야 하면 일반 메서드로 쓴다.
- `out` 매개변수는 메서드 안에서 보이지 않는다. 호출한 쪽 변수는 선언할 때 초기화해 두면 보인다 (`int result = 0; TryX(out result);`).
- 문자열은 힙 객체가 아니라 값처럼 상자 안에 그린다. 문자열 불변 표본을 만들 때 다시 본다 (plan.md 남은 일).
- 정적 필드는 기록할 때 리플렉션으로 읽으므로, 정적 생성자가 코드 순서보다 먼저 돌 수 있다. 정적 생성자의 실행 순서를 보여 주는 표본은 만들지 않는다.
- 기록은 1500칸, 20초에서 끊는다.

## 3. 단계와 효과 끄기

- 단계 n 은 원본의 코드 줄 끝 `// [n]` 표시다. 무대의 단계 보기는 **그 줄을 처음 실행한 직후**에 멈춘다 (그 줄이 →, 그 줄이 바꾼 값이 노랗게). `body` 는 "~한 직후다", "~했다" 로 쓴다.
- 주석만 있는 줄에 `// [n]` 를 두지 않는다. 표시 줄은 기본 입력의 실행이 실제로 지나가야 한다 (검사).
- 메서드를 **부르는 줄**의 단계는 부른 직후, 곧 새 프레임이 쌓이고 메서드 첫 줄 직전이다 (매개변수가 보인다). `return` 줄의 단계는 돌아온 직후다 (프레임이 걷히고 받은 값이 보인다). `array-alias` 의 3, 4단계.
- `#if GALLERY_MISTAKE` 구역 안의 줄에는 `// [n]` 를 두지 않는다. 효과 끄기 실행이 그 줄을 지나지 않아 단계 보기가 처음 칸으로 간다. 두 실행이 함께 지나는 줄에 둔다.
- `// @param` 과 단계를 한 줄에 두려면 `// @param key // [n]` 처럼 단계 표시를 줄 끝에 둔다.
- 효과 끄기는 `#if GALLERY_MISTAKE … #else … #endif` 로 원본 안에 둔다. 수강생이 실제로 하는 실수를 재현한다 (교안의 "흔한 실수", "❌ 상황"). Unity 에는 기호가 없어 그 구역이 사라진다.
- 컴파일 오류가 실수의 핵심인 개념(CS0165, 추상 클래스 new 등)은 실행 기록이 없어 효과 끄기가 안 된다. `mistakes` 글로만 다룬다.

## 4. 입력값 (`params`)

- `select` 와 `toggle` 만 쓴다. 기록 도구가 모든 조합을 미리 실행해 둔다 (최대 12조합, 각 조합마다 보통 실행과 GALLERY_MISTAKE 실행).
- 원본의 선언 줄 끝에 `// @param <key>` 를 붙인다: `bool makeNew = false; // @param makeNew`. 기록 도구가 그 초기값을 바꿔 실행하고, 무대와 AI 세트도 같은 자리를 바꿔 보여 준다.
- `select` 의 `value` 는 C# 식 그대로다 (`'3'`, `'Rarity.Rare'`, `'"슬라임"'`).

## 5. meta.ts

- `import type` 과 `../../stage/types.ts` 의 `EXEC_EVENTS` 만 import 한다 (Node 가 직접 읽는다. 확장자 `.ts` 필수).
- `events: EXEC_EVENTS` 그대로. 자동 데모(`demo`)는 두지 않는다 (무대가 처음부터 끝까지 반복 재생한다).
- `concept`: 카드 칩 이름 (예: 값 타입과 참조 타입). `lecture`: 원본 교안 장 주소 (`https://krkoohoo.github.io/01-csharp-basic/<파트>/<장>/`).
- `unity`: 교안 각 장의 "Unity에서는?" 을 옮긴다. setup 은 Unity 에서 같은 실험을 하는 순서, pitfalls 는 Unity 에서만 생기는 함정.
- `presets` 2~5개 (kit 규칙). 입력값이 없으면 입력값을 하나 만든다 (기본 동작과 대조할 수 있는 toggle).

## 6. 작업 순서와 검사

```bash
npm run trace -- <id>                 # 기록 (.NET SDK 10)
node tools/gallery.mjs check <id>     # 표본만 넣은 빌드: meta 규칙, 무대 동작, 도메인 검사 (원본, 기록 지문, 조합)
node tools/gallery.mjs live <id> --query="auto=0&step=2" wait:800 stage:step2
node tools/gallery.mjs live <id> --query="auto=0&off=1&t=4" wait:800 stage:off
node tools/gallery.mjs unity-compile <id>
```

- 원본을 고치면 기록을 다시 만든다. 지문이 다르면 검사가 실패한다 (기록 도구를 고쳐도 마찬가지).
- 썸네일은 무대 시간 4.3초(7칸째)다. 표본은 10칸 이상이 되게 쓴다 (짧으면 끝 화면이 썸네일이 되고 이벤트 검사가 경고한다).
- 완료 체크리스트는 kit-guide 7절. 여기에 더해: 콘솔 출력이 meta 글의 숫자와 같은지, 효과 끄기 실행의 출력과 메모리가 `offNote` 와 같은지 눈으로 본다.
