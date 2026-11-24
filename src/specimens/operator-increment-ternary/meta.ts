import type { CsMeta } from '../../stage/types.ts'
import { CONSOLE_UNITY, EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'operator-increment-ternary',
  title: '증감 · 삼항 연산자와 우선순위',
  titleEn: 'Increment, Ternary and Precedence',
  group: 'A',
  order: 33,
  concept: '03. 연산자 · 3.5 · 3.6 · 3.7',
  oneLiner: '교안 3.5 ~ 3.7 을 한 줄씩 실행하며 전위 ++ 와 후위 ++ 가 넘기는 값의 차이, 삼항이 고르는 값, 괄호가 바꾸는 결과를 본다',
  goals: [
    '`++count;` 와 `count++;` 를 한 줄에 홀로 쓰면 둘 다 1 씩 올린다는 것을 볼 수 있다.',
    '값을 다른 곳에 넘길 때 전위는 올린 값을, 후위는 올리기 전 값을 넘긴다는 것을 메모리 상자로 설명할 수 있다.',
    '`score >= 90 ? "A" : "B"` 가 조건 하나로 두 값 중 하나를 고른다는 것을 안다.',
    '`&&` 가 `||` 보다 먼저 묶이므로, 의도한 묶음은 괄호로 드러내야 한다는 것을 안다.',
  ],
  tags: ['증감 연산자', '전위 후위', '삼항 연산자', '우선순위', '괄호'],
  difficulty: 1,
  params: [
    {
      key: 'score',
      label: 'score 의 값 (14번 줄)',
      type: 'select',
      default: '85',
      options: [
        { value: '85', label: '85 (교안 4절의 점수)' },
        { value: '90', label: '90 (경계값)' },
      ],
      hint: '3.6 의 grade 상자와 셋째 출력이 바뀐다. `>=` 라서 경계값 90 도 "A" 다',
    },
  ],
  presets: [
    { id: 'lecture', name: '교안 그대로', values: {} },
    { id: 'boundary', name: '경계값 90', values: { score: '90' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '3.5 전위 홀로', body: '`++count;` 를 실행한 직후다. count 상자가 0 에서 1 이 됐다. 다음 줄 `count++;` 도 홀로 쓰여서 똑같이 1 을 올린다 (콘솔 첫 줄 2). **한 줄에 홀로 쓰면 둘은 완전히 같다.**' },
    { n: 2, label: '3.5 전위로 넘기기', body: '`int prefix = ++count;` 를 실행한 직후다. 전위는 **먼저 1 올리고** 그 값을 쓴다. count 가 2 → 3 이 된 다음 그 3 이 prefix 상자에 들어갔다.' },
    { n: 3, label: '3.5 후위로 넘기기', body: '`int postfix = count++;` 를 실행한 직후다. 후위는 **지금 값을 먼저 쓰고** 그 다음 1 올린다. postfix 상자에는 올리기 전 값 3 이 들어갔고, count 는 그 뒤에 4 가 됐다. 같은 "1 올리기" 인데 넘긴 값이 다르다.' },
    { n: 4, label: '3.6 삼항', body: '`string grade = score >= 90 ? "A" : "B";` 를 실행한 직후다. score 가 85 라 `score >= 90` 이 거짓이어서 뒤쪽 값 "B" 가 골라져 grade 상자에 들어갔다. 입력값에서 score 를 90 으로 바꾸면 "A" 가 된다.' },
    { n: 5, label: '3.7 괄호', body: '`bool result = a && (b || c);` 를 실행한 직후다. 괄호 안 `b || c` 가 먼저 계산돼 true, 그다음 `a && true` 는 a 가 false 라 result 는 **false** 다. "a 이면서" 라는 의도대로다. 괄호를 빼면 어떻게 되는지는 효과 끄기에서 본다.' },
  ],
  offNote: '교안 3.7 과 8절의 "`&&` 와 `||` 를 괄호 없이 섞음" 이다. 효과 끄기는 `a && (b || c)` 대신 `a && b || c` 를 쓴다. `&&` 가 `||` 보다 먼저라 `(a && b) || c` 로 묶여, `false || true` 가 되어 result 상자가 **true** 가 되고 마지막 출력도 `True` 로 바뀐다. 의도는 "a 이면서" 인데 a 가 false 여도 c 하나로 통과해 버린다. 오류 없이 결과만 뒤집힌다.',
  mistakes: [
    { title: '`count++` 를 넘겼는데 올린 값이 아니라 이전 값이 들어갔다', body: '후위는 지금 값을 먼저 쓰고 그 다음 올린다. 올린 값을 넘기려면 전위 `++count` 를 쓰거나, 올리는 줄과 쓰는 줄을 나눈다.' },
    { title: '`A && B || C` 가 생각과 다른 결과를 낸다', body: '`&&` 가 `||` 보다 먼저 묶여 `(A && B) || C` 로 해석된다. 우선순위를 외우지 말고 묶이는 단위를 괄호로 드러낸다.' },
    { title: '삼항을 여러 번 겹쳤더니 어디서 갈라지는지 읽히지 않는다', body: '중첩 삼항은 눈으로 따라가기 어렵다. 삼항은 1단계까지만 쓰고, 갈래가 셋을 넘으면 `if-else if` 로 푼다.' },
    { title: '`score > 90` 으로 썼더니 90점이 A 가 되지 않는다', body: '경계값을 넣으려면 `>=` 를 쓴다. 판정식을 쓸 때는 경계를 넣을지 뺄지를 먼저 정한다.' },
  ],
  unity: CONSOLE_UNITY,
  prompt: {
    goal: '전위 · 후위 증감 연산자가 넘기는 값의 차이, 삼항 연산자, 우선순위와 괄호를 이해한다.',
    adaptIdeas: ['`--count` 와 `count--` 로도 넘기는 값의 차이를 보고 싶다.', '체력이 30 이하면 "위험", 아니면 "안전" 을 삼항으로 골라 보고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 03장 3.5 증감 연산자 블록을 그대로 두고, 본문 "차이는 그 값을 다른 곳에 넘길 때 드러납니다" 를 prefix · postfix 두 줄로 덧붙였다. 3.6 삼항 한 줄에는 4절의 score 85 를, 3.7 본문의 `A && B || C` 에는 bool 값 세 개를 덧붙이고 괄호 생략을 효과 끄기로 넣었다.',
  lecture: [{ title: '03. 연산자', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/03_operators/' }],
  references: [
    { label: 'Microsoft Learn: 산술 연산자 - 증가 및 감소 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/arithmetic-operators' },
    { label: 'Microsoft Learn: 조건 연산자 ?: (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/conditional-operator' },
    { label: 'Microsoft Learn: 연산자 우선 순위 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/03_operators/', title: '교안: 03. 연산자', why: '이 표본의 원본 교안. 3.5 증감, 3.6 삼항, 3.7 우선순위, 8절 괄호 생략과 중첩 삼항' },
    { id: 'operator-compare-logic', why: '앞 절. 삼항과 && · || 에 들어가는 bool 이 만들어지는 3.3 · 3.4' },
    { id: 'operator-before-after', why: '괄호 생략과 중첩 삼항이 한 코드에 모인 4절 ❌ / ✅' },
  ],
}
