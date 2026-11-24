import type { CsMeta } from '../../stage/types.ts'
import { CONSOLE_UNITY, EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'operator-compare-logic',
  title: '비교 연산자와 논리 연산자: "구간 안인가?"',
  titleEn: 'Comparison and Logical Operators',
  group: 'A',
  order: 32,
  concept: '03. 연산자 · 3.3 · 3.4',
  oneLiner: '교안 3.3 · 3.4 코드를 한 줄씩 실행하며 비교와 논리의 결과가 숫자가 아니라 true / false 로 bool 상자에 담기는 것을 본다',
  goals: [
    '`number > 100` 같은 비교의 결과가 숫자가 아니라 `true` / `false` 이고, 그래서 `bool` 변수에 담을 수 있다는 것을 볼 수 있다.',
    '`(a < c) && (c < b)` 를 "c 가 a 와 b 사이에 있는가?" 로, `(c < a) || (b < c)` 를 "구간 밖에 있는가?" 로 읽을 수 있다.',
    '경계값 `c = 10` 에서는 "사이" 와 "밖" 이 둘 다 `false` 가 된다는 것을 확인할 수 있다.',
    '"같은가?" 를 물을 자리에 `=` 를 쓰면 bool 이 아니라 int 가 나와 컴파일 오류가 난다는 것을 안다.',
  ],
  tags: ['비교 연산자', '논리 연산자', 'bool', '경계값', 'CS0029'],
  difficulty: 1,
  params: [
    {
      key: 'c',
      label: 'c 의 처음 값 (22번 줄)',
      type: 'select',
      default: '15',
      options: [
        { value: '15', label: '15 (교안 그대로)' },
        { value: '10', label: '10 (경계값)' },
        { value: '25', label: '25' },
      ],
      hint: '첫 && · || 결과 두 줄만 바뀐다. 10 은 경계값이라 둘 다 False, 25 는 && 가 False 이고 || 가 True 다. 그 뒤 `c = 5;` · `c = 25;` 로 덮어쓴 다음은 어느 쪽이든 같다',
    },
  ],
  presets: [
    { id: 'lecture', name: '교안 그대로', values: {} },
    { id: 'boundary', name: '경계값 10', values: { c: '10' } },
    { id: 'outside', name: '구간 밖에서 시작', values: { c: '25' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '3.3 비교', body: '`bool isBigger = number > 100;` 을 실행한 직후다. 250 > 100 을 판정한 결과는 숫자가 아니라 **true** 이고, 그 값이 bool 상자 isBigger 에 담겼다. 콘솔에는 아직 아무것도 찍히지 않았다. 비교는 값을 돌려줄 뿐이다.' },
    { n: 2, label: '3.3 다시 비교', body: '`isBigger = number > 1000;` 을 실행한 직후다. 250 > 1000 은 거짓이라 isBigger 상자가 true 에서 **false** 로 바뀌었다. 위 줄의 `Console.WriteLine` 이 찍은 것은 `True` 다 (콘솔에는 .NET 표기로 대문자로 찍힌다).' },
    { n: 3, label: '3.3 같은가?', body: '`isBigger = number == 250;` 을 실행한 직후다. `==` 는 "같은가?" 를 묻고 true 를 돌려준다. number 상자는 250 그대로다. 같은 자리에 `=` 를 쓰면 어떻게 되는지는 효과 끄기에서 본다.' },
    { n: 4, label: '3.4 사이 · 밖', body: '`bool isOutside = (c < a) || (b < c);` 까지 실행한 직후다. c 가 15 라 `(10 < 15) && (15 < 20)` 은 양쪽이 모두 참이어서 isBetween 은 **true**, `(15 < 10) || (20 < 15)` 는 둘 다 거짓이어서 isOutside 는 **false** 다. 입력값을 경계값 10 으로 바꾸면 여기서 두 상자가 **둘 다 false** 가 된다 (교안 3.4 표 마지막 줄).' },
    { n: 5, label: '3.4 c 만 바꾸기', body: '`c = 5;` 다음 `isOutside = (c < a) || (b < c);` 를 실행한 직후다. a 와 b 는 그대로 두고 c 만 바꿨더니 왼쪽 `(5 < 10)` 이 참이라 isOutside 가 **true** 가 됐다. isBetween 은 다시 계산하지 않았으므로 true 그대로 남아 있다.' },
  ],
  offNote: '교안 8절 "`=` 와 `==` 혼동" 이다. 효과 끄기는 `isBigger = number == 250;` 대신 `isBigger = number = 250;` 을 쓴다. `number = 250` 은 "같은가?" 가 아니라 "넣어라" 라서 결과가 int 250 이 되고, int 는 bool 상자에 담을 수 없다. 컴파일 단계에서 10번 줄이 빨갛게 표시되고 콘솔에 `CS0029: Cannot implicitly convert type \'int\' to \'bool\'` 가 찍힌다. 프로그램이 한 줄도 실행되지 않아 앞의 출력도 없다.',
  mistakes: [
    { title: '`if (score = 90)` 에서 bool 로 바꿀 수 없다는 컴파일 오류가 난다', body: '`=` 는 넣기, `==` 는 비교다. 같은가를 물을 때는 `score == 90` 으로 쓴다. bool 변수라면 `if (isReady = true)` 가 오류 없이 늘 참이 되어 더 찾기 어렵다.' },
    { title: '`number > 100;` 을 적었는데 아무 일도 일어나지 않는다', body: '비교 연산자는 값을 돌려줄 뿐 화면에 찍지 않는다. 결과를 `bool` 변수에 담거나, `Console.WriteLine` 에 넘기거나, 조건에 넣어야 쓸모가 생긴다.' },
    { title: '`!isBetween` 과 `(c < a) || (b < c)` 가 c = 10 에서 다른 답을 낸다', body: '경계값에서는 "사이" 도 "밖" 도 아니라서 두 식이 갈린다. 경계를 안으로 칠지 밖으로 칠지 먼저 정하고, 넣으려면 `<` 를 `<=` 로 바꾼다.' },
    { title: '`&&` 와 `||` 를 섞었더니 생각과 다른 결과가 나온다', body: '`&&` 가 `||` 보다 먼저 묶인다. `A && B || C` 는 `(A && B) || C` 다. 묶이는 단위를 괄호로 드러낸다.' },
  ],
  unity: CONSOLE_UNITY,
  prompt: {
    goal: '비교와 논리 연산의 결과가 bool 이라는 것과, 논리식을 한국어 질문 한 문장으로 읽는 방법을 이해한다.',
    adaptIdeas: ['레벨이 10 이상 20 이하인지 묻는 식을 && 로 써 보고 싶다.', '경계값을 포함하도록 `<` 를 `<=` 로 바꿔 c = 10 의 결과를 보고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 03장 3.3 비교 연산자와 3.4 논리 연산자의 코드 블록 세 개를 이어서 옮겼다. number 는 3.2 끝 값 250 으로 선언을 덧붙였고, 8절의 `=` 와 `==` 혼동을 `isBigger = number = 250;` 컴파일 오류로 효과 끄기에 넣었다.',
  lecture: [{ title: '03. 연산자', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/03_operators/' }],
  references: [
    { label: 'Microsoft Learn: 비교 연산자 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/comparison-operators' },
    { label: 'Microsoft Learn: 부울 논리 연산자 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/boolean-logical-operators' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/03_operators/', title: '교안: 03. 연산자', why: '이 표본의 원본 교안. 3.3 비교 연산자, 3.4 논리 연산자 표, 8절 = 와 == 혼동' },
    { id: 'operator-arithmetic-assign', why: '앞 절. number 가 100 에서 250 이 되는 3.2 할당' },
    { id: 'operator-increment-ternary', why: '다음 절. 비교 결과로 두 값 중 하나를 고르는 3.6 삼항' },
  ],
}
