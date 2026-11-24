# C# 기초 갤러리 표본 선정

- 작성: 2026-11-23. 근거: 교안 `krKooHoo/krKooHoo.github.io` 의 `docs/01-csharp-basic` (마크다운 56개: 개념 장 40, part6 과제 9, index 7) 를 읽고 정리했다.
- **상태: 폐기 (2026-11-24).** Jay 결정으로 갤러리는 교안 목차를 그대로 따르는 보조 교안이 되었다 (specimen-guide 0절, plan.md 4절). 이 문서처럼 개념을 골라 새 예시로 만드는 방식은 쓰지 않는다. 아래는 기록으로만 남긴다. 교안 근거·뺀 후보(5절)는 05장 이후 작업에서 참고할 수 있다.
- 상태(옛): 초안. 순서와 범위는 Jay 확인 전이다.
- 2026-11-24: 교안 Part 1(그룹 A) 모든 장에 표본을 만들었다. 위 카드의 A 묶음 4개에 더해 장마다 하나씩 `variable-reassign`, `float-precision`, `integer-division`, `tryparse-guard`, `if-chain-order`, `loop-accumulator`, `break-one-level`, `jagged-array`, `return-value` (plan.md 4절). 7절의 연산·조건·반복 쟁점은 "실행 결과가 갈리는 실수가 있는 개념만" 으로 넣었다.

## 0. 요약

- 실행 무대(줄 재생 + 스택·힙 그림)가 가장 큰 차이를 만드는 것은 **메모리 그림이 답이 되는 개념**이다: 값/참조, 배열 대입, 매개변수와 ref, static, 문자열 불변, 박싱, 스택 프레임, 예외 전파, 람다 캡처.
- part6 과제 약 126문항의 70% 는 연산·조건·반복이다. 하지만 메모리 개념은 문제 해설의 **함정**으로 반복해 나온다: 배열이 참조라 원본이 바뀜(04, 07 Q8, 09), 정수 나눗셈, break 한 겹, 누적 변수 위치.
- 그래서 1순위는 `value-vs-reference`(완료, 기준 샘플)와 `array-alias`, 그다음이 매개변수 묶음(A)과 구조체 묶음(B)이다.

## 1. 공통 요구

- 원본 교안의 예시와 소재(Player, Monster, 슬라임, 전사, Health)를 따른다. 용어는 교안이 많이 쓰는 값 타입·참조 타입, 메서드, 매개변수·인자, 속성, 델리게이트, 캡처.
- 효과 끄기는 교안의 "흔한 실수", "❌ 상황 (Before)" 에서 고른다. 실행해서 결과가 갈리는 실수여야 한다 (컴파일 오류는 안 된다).
- 표본은 교안 장의 `lecture` 링크를 단다.

## 2. 그룹별 카드

| id | 제목 | 그룹 | 근거 장 | 무대에서 보일 것 | 효과 끄기 | 예측 질문 후보 |
|---|---|---|---|---|---|---|
| `value-vs-reference` ✅ | 복사인가 공유인가 | B | P2-05 §4.2, P2-02 | p1·p2 상자가 따로, player1·player2 화살표가 객체 하나로 | Point 를 class 로 | `p2.X=100` 뒤 p1.X? |
| `array-alias` ✅ | 배열 대입은 주소 복사 | A | P1-08 §3.4, part6 04 A6 | 화살표 둘이 배열 하나로, 매개변수도 같은 배열로 | 메서드가 받은 배열을 그대로 고쳐 돌려줌 (대입·Clone 은 입력값으로) | `copy[0]=999` 뒤 `original[0]`? |
| `pass-by-value-ref` ✅ | 값 전달과 ref | A | P1-11 §4 | `AddTen` 프레임의 x 가 사본 / ref | ref 제거 | 호출 뒤 n 은? |
| `ref-param-reassign` ✅ | 매개변수에 new 를 넣으면 | A | P1-11 §3.1, §8 | 매개변수 화살표만 새 객체로 | 필드 수정과 new 재할당 비교 | 원본 Hp 는? |
| `static-shared-counter` ✅ | static 은 하나뿐 | A | P1-12 §5 | 정적 영역 상자와 인스턴스들 | `_nextId` 를 인스턴스 필드로 | `potion.Id`, `CreatedCount`? |
| `boxing-unboxing` ✅ | 박싱과 언박싱 | A | P1-13 §3.5 | 힙에 int 상자 | `(long)boxed` | 어느 줄에서 예외가 나나 |
| `struct-out-of-array` | 꺼낸 구조체는 사본 | B | P2-02 §3.4 | 배열 칸과 지역 사본 | 되돌려 쓰기 누락 | `students[0].KoreanScore`? |
| `struct-field-vs-class-field` | 위치는 복사, 무기는 공유 | B | P2-05 §5 | 객체 안 Vector2 값과 Weapon 화살표 | 위치 사본만 고치기 | `hero.Position`, 무기 공격력? |
| `stack-frames` | 호출과 복귀 | B | P2-03 §4.2 | 프레임이 쌓였다 걷힘, 재귀 | `Factorial(13)` int 오버플로 | 가장 깊을 때 프레임 수 |
| `heap-reachability` | 참조가 끊긴 객체 | B | P2-04 §3.3, §4.3 | 아무도 안 가리키는 객체, 정적 목록 | Kill 에서 Remove 누락 | 처치 뒤 살아 있는 객체 수 |
| `string-immutable` | 문자열은 새로 만든다 | C | P3-01 §3.4, §4.3 | s 의 화살표가 새 문자열로 | `s.ToUpper();` 대입 누락 | 출력은 World? WORLD? |
| `exception-propagation` | 예외는 프레임을 거슬러 | C | P3-07 §3.1, §3.4 | 남은 줄을 건너뛰며 프레임이 걷힘, finally | Main 의 catch 제거 | "끝" 이 찍히나? |
| `polymorphism-new-vs-override` | override 와 new 가리기 | D | P4-04 | 힙 객체의 실제 타입, 부른 메서드 프레임 | override 대신 new | "I am Parent"? |
| `list-removeat-skip` | 지우면서 앞으로 돌면 | E | P5-02 §5 | 리스트 칸이 당겨지고 i 는 증가 | 정방향 vs 역방향 | 남는 칸은? |
| `lambda-loop-capture` | 람다가 잡은 for 의 i | E | P5-07 §3.6 | 람다 셋이 같은 변수를 봄 | `int index = i` 제거 | 0 1 2? 3 3 3? |
| `multicast-event` | 델리게이트의 호출 목록 | E | P5-06 | 호출 목록 | `=` 로 구독자 전멸 | 몇 번 찍히나 |

## 3. 우선순위

1. `value-vs-reference` (완료, 기준 샘플 1)
2. `array-alias` (완료, 기준 샘플 2), `pass-by-value-ref` (기록 도구의 ref 화살표가 먼저)
3. A 묶음 나머지: `ref-param-reassign`, `static-shared-counter`, `boxing-unboxing`
4. B 묶음: `struct-out-of-array`, `struct-field-vs-class-field`, `stack-frames`, `heap-reachability`
5. C·D·E: `string-immutable`, `exception-propagation`, `list-removeat-skip`, `lambda-loop-capture`, `polymorphism-new-vs-override`, `multicast-event`

## 4. 제작 묶음 (안)

- 묶음 1 (구독 세션): 기준 샘플 2 + 예측 질문 기능 + 문자열을 힙 객체로 그리는 선택 (`string-immutable` 준비)
- 묶음 2 (워커): A 묶음 4개
- 묶음 3 (워커): B 묶음 4개
- 묶음 4 (워커): C·D·E 6개

## 5. 뺀 후보와 사유

| 장 | 사유 |
|---|---|
| P3-05 키 입력·커서 제어 | 커서 좌표와 잔상은 화면 버퍼 문제라 줄 단위 콘솔 기록으로 보이지 않는다. 실시간 루프다 |
| P3-06 중단점 | IDE 기능이다. 다만 "중단점은 그 줄 실행 직전에 멈춘다" 는 무대의 '실행 직전' 표시와 같아 about 이나 가이드 글로 잇는다 |
| P3-04 Random | 결과가 실행마다 다르다. 교안의 "루프 안 new Random() 이면 52 52 52" 는 .NET Core 이후 재현되지 않는다 (인스턴스마다 다른 시드) |
| 무한 루프, StackOverflow | 끝나지 않거나 프로세스가 죽는다. 기록 도구는 1500칸에서 끊는다 |
| GC 시점, 매 프레임 new, StringBuilder 성능 | 비결정적이거나 성능 문제라 그림에 차이가 없다. 도달 가능성만 `heap-reachability` 로 |
| 컴파일 오류가 핵심인 실수 | CS0165, CS0128, 추상 클래스 new, 인터페이스 필드, `transform.position.x`, const DateTime 은 실행 기록이 없다. 해당 표본의 `mistakes` 글로 |
| 각 장의 "Unity에서는?" 코드 | UnityEngine 이 있어야 한다. 표본의 `unity` 글과 'Unity 로 옮기기' 프롬프트로 |

## 6. 근거가 약한 항목

- `lambda-loop-capture`: 교안 원문은 Unity 코드(`buttons[i].onClick`)다. 콘솔용 `List<Action>` 으로 바꿔 쓴다. 기록 도구는 람다 안 문장을 줄 단위로 기록하지 않으므로, 람다가 부르는 일반 메서드를 두어 프레임이 보이게 한다.
- `boxing-unboxing`: 박싱된 int 가 힙 객체로 그려지는지 기록 도구를 확인해야 한다 (지금은 `object o = 5` 를 런타임 형식 int 로 보고 값으로 그린다). 기록 도구 수정이 먼저다.
- `string-immutable`: 지금 무대는 문자열을 값처럼 상자 안에 그린다. 이 표본에서만 힙 객체로 그리는 선택이 필요하다.

## 7. 쟁점과 결정

- (결정) 그룹 = 교안 파트. part6 과제는 그룹으로 두지 않고 우선순위 근거로만 쓴다.
- (결정) 효과 끄기는 원본 안 `#if GALLERY_MISTAKE`. 컴파일 오류형 실수는 글로만.
- (Jay 확인) 예측 질문(`steps[].ask`)을 묶음 1 에 넣을지.
- (Jay 확인) 연산·조건·반복(과제의 70%)용 표본을 따로 둘지. 메모리 그림의 차이가 작아, 넣는다면 '정수 나눗셈', 'break 는 한 겹' 처럼 실행 결과가 갈리는 것만.
