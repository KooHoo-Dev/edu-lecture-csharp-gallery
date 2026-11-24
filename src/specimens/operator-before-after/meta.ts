import type { CsMeta } from '../../stage/types.ts'
import { CONSOLE_UNITY, EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'operator-before-after',
  title: '코드로 보기: 등급과 할인가 Before / After',
  titleEn: 'Operators Before and After',
  group: 'A',
  order: 34,
  concept: '03. 연산자 · 4',
  oneLiner: '교안 4절의 ✅ 코드를 한 줄씩 실행하고, 효과 끄기로 ❌ 코드를 실행해 할인율 0 과 0.2, 최종 가격 10000 과 8000 이 갈리는 것을 본다',
  goals: [
    '`20 / 100` 은 0 이고 `20 / 100.0` 은 0.2 라는 것을 메모리의 discountRate 상자(int 0 대 double 0.2)로 설명할 수 있다.',
    '비교는 `==` 로 적고, `if` 가 그 bool 결과로 실행할 줄을 고른다는 것을 볼 수 있다.',
    '`&&` 와 `||` 가 섞인 식에서 묶이는 단위를 괄호로 드러내 쓸 수 있다.',
    '`string grade;` 로 선언만 한 상자가 if-else if 를 지나며 값을 받는 것을 볼 수 있다.',
  ],
  tags: ['연산자', '정수 나눗셈', '비교', '괄호', 'if-else if'],
  difficulty: 1,
  params: [
    {
      key: 'score',
      label: 'score 의 값 (2번 줄)',
      type: 'select',
      default: '85',
      options: [
        { value: '85', label: '85 (교안 그대로)' },
        { value: '90', label: '90' },
        { value: '72', label: '72' },
        { value: '50', label: '50' },
      ],
      hint: '등급(grade)과 isPass 가 바뀐다. 90 이면 "정확히 90점입니다" 가 찍히고, 효과 끄기의 중첩 삼항은 `score > 90` 이라 A 가 아니라 B 를 고른다. 할인가는 어느 점수든 같다',
    },
  ],
  presets: [
    { id: 'lecture', name: '교안 그대로 (85점)', values: {} },
    { id: 'score90', name: '정확히 90점', values: { score: '90' } },
    { id: 'score72', name: '72점 (C 등급)', values: { score: '72' } },
    { id: 'score50', name: '50점 (불합격)', values: { score: '50' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '1. 비율을 살린다', body: '`int finalPrice = (int)(price - price * discountRate);` 를 실행한 직후다. 바로 앞 줄 `20 / 100.0` 이 한쪽을 실수로 만들어 discountRate 상자는 **double 0.2** 이고, 10000 - 10000 × 0.2 를 `(int)` 로 정수로 바꿔 finalPrice 에 **8000** 이 들어갔다. 효과 끄기(❌)에서는 discountRate 가 int 0, finalPrice 가 10000 이다.' },
    { n: 2, label: '2. 비교는 ==', body: '`if (score == 90)` 으로 비교한 직후다. `==` 는 score 가 90 과 같은지 묻고 bool 을 내놓는다. 85 는 90 이 아니라 false 이므로 31번 줄을 건너뛰고 ▶ 가 34번 줄로 갔다. 메모리는 바뀌지 않는다. 입력값 90 이면 31번 줄로 들어가 `정확히 90점입니다` 가 찍힌다.' },
    { n: 3, label: '3. 괄호로 드러낸다', body: '`bool isPass = (score >= 60 && score <= 100) || (score == 999);` 를 실행한 직후다. 괄호 안 `85 >= 60 && 85 <= 100` 이 true 라 isPass 상자에 **true** 가 들어갔다. ❌ 코드의 괄호 없는 식도 `&&` 가 먼저 묶여 결과는 같다. 괄호는 컴파일러가 아니라 다음에 읽을 사람을 위한 것이다.' },
    { n: 4, label: '4. if-else if', body: '`string grade;` 를 실행한 직후다. grade 상자는 이름만 있고 **값 없음** (점선 상자)이다. 다음 줄부터 if-else if 가 위에서부터 score 85 를 견주어 `score >= 80` 인 39번 줄에서 grade 에 "B" 를 넣는다. 최종 화면에서 grade 는 "B", 콘솔은 `B 등급 - 최종 가격은 8000원입니다` 다.' },
  ],
  offNote: '교안 4절의 ❌ 상황(Before) 코드를 실행한다. `20 / 100` 은 양쪽이 int 라 discountRate 상자가 **int 0** 이 되고, finalPrice 는 10000 - 10000 × 0 = **10000** 그대로다. 콘솔에는 `최종 가격은 : 10000` 이 찍힌다 (보통 실행은 8000). `//if (score = 90) { }` 는 주석이라 실행되지 않는다. 괄호 없는 isPass 와 중첩 삼항 grade 는 85점에서 보통 실행과 같은 true, "B" 지만 읽기 어렵다. 입력값 90 이면 중첩 삼항은 `score > 90` 이라 grade 가 A 가 아니라 B 다.',
  mistakes: [
    { title: '할인율이 0 이 되어 할인이 통째로 사라진다', body: '`20 / 100` 은 양쪽이 int 라 결과도 int 인 0 이다. 비율을 계산할 때는 `20 / 100.0` 처럼 나누는 쪽 어딘가에 실수를 하나 섞고, 받는 변수도 double 로 둔다.' },
    { title: '`if (score = 90)` 이 컴파일되지 않는다', body: '`=` 는 넣기, `==` 는 비교다. `score = 90` 은 int 를 내놓아 if 가 받지 않는다. bool 변수에 `if (isReady = true)` 라고 쓰면 오류 없이 늘 참이 되어 더 찾기 어렵다.' },
    { title: '`&&` 와 `||` 를 섞은 식이 생각과 다르게 판정된다', body: '`&&` 가 `||` 보다 먼저 묶인다. `A && B || C` 는 `(A && B) || C` 다. 우선순위를 외우지 말고 괄호로 묶이는 단위를 드러낸다.' },
    { title: '중첩 삼항이 어디서 갈라지는지 읽히지 않는다', body: '갈래가 셋을 넘으면 삼항을 겹치지 말고 if-else if 로 푼다. 삼항은 1단계까지만 쓴다.' },
  ],
  unity: CONSOLE_UNITY,
  prompt: {
    goal: '같은 요구를 ❌ 코드와 ✅ 코드로 써 보고 정수 나눗셈, = 와 ==, 괄호, 중첩 삼항이 결과와 읽기에 무엇을 바꾸는지 이해한다.',
    adaptIdeas: ['할인율을 15% 로 바꿔 ❌ 와 ✅ 의 최종 가격을 비교해 보고 싶다.', '등급 기준을 바꿔 if-else if 사슬을 다시 써 보고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 03장 4절의 ❌ 상황(Before)과 ✅ 적용(After) 코드를 그대로 옮겨 ✅ 를 보통 실행, ❌ 를 효과 끄기로 이었다. 두 코드에 같은 score · price 두 줄은 한 번만 두었다.',
  lecture: [{ title: '03. 연산자', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/03_operators/' }],
  references: [
    { label: 'Microsoft Learn: 산술 연산자 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/arithmetic-operators' },
    { label: 'Microsoft Learn: C# 연산자와 식 (우선순위)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/03_operators/', title: '교안: 03. 연산자', why: '이 표본의 원본 교안. 4절 코드로 보기, 8절 주의사항' },
    { id: 'operator-arithmetic-assign', why: '정수 나눗셈(10 / 3 이 3)을 처음 보는 3.1 산술 연산자' },
    { id: 'operator-compare-logic', why: '`&&` · `||` 로 구간 안과 밖을 판정하는 3.3 · 3.4' },
    { id: 'operator-skill-check', why: '같은 장 5절: 비교 · 논리 · 할당 · 산술 · 삼항을 한 화면에서 쓰는 활용 예시' },
  ],
}
