import type { CsMeta } from '../../stage/types.ts'
import { CONSOLE_UNITY, EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'variable-four-stages',
  title: '변수의 네 단계: 선언 · 할당 · 초기화 · 재할당',
  titleEn: 'Four Stages of a Variable',
  group: 'A',
  order: 11,
  concept: '01. 변수 · 3.2 · 4.2 · 4.3',
  oneLiner: '교안 4.2 코드를 한 줄씩 실행하며 변수 상자가 빈 공간으로 생기고, 값이 들어가고, 덮어써지는 것을 본다',
  goals: [
    '`int playerGold;` 직후에는 이름이 붙은 공간만 있고 값은 없다는 것을 "값 없음" 상자로 설명할 수 있다.',
    '할당 · 초기화 · 재할당이 같은 상자의 내용물을 바꾸는 일이고, 재할당하면 이전 값이 사라진다는 것을 볼 수 있다.',
    '값을 넣지 않은 변수를 읽으면 실행 전에 컴파일 오류(CS0165)로 막힌다는 것을 안다.',
  ],
  tags: ['변수', '선언', '초기화', '재할당', 'CS0165'],
  difficulty: 1,
  params: [
    {
      key: 'playerLevel',
      label: 'playerLevel 의 처음 값 (9번 줄)',
      type: 'select',
      default: '1',
      options: [
        { value: '1', label: '1 (교안 그대로)' },
        { value: '30', label: '30' },
      ],
      hint: '초기화할 때 넣는 값만 바뀐다. 9번 줄 직후의 playerLevel 상자와 10번 줄의 출력이 바뀌지만, 13~14번 줄의 재할당 뒤에는 어느 쪽이든 5 다',
    },
  ],
  presets: [
    { id: 'lecture', name: '교안 그대로', values: {} },
    { id: 'level30', name: '처음 레벨 30', values: { playerLevel: '30' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '1. 선언', body: '`int playerGold;` 를 실행한 직후다. 메모리에 **playerGold 라는 이름의 int 공간**이 생겼지만 값은 아직 없다 (점선 상자, 값 없음). 이 상태에서 읽으면 컴파일 오류다 (효과 끄기).' },
    { n: 2, label: '2. 할당', body: '`playerGold = 10000;` 을 실행한 직후다. 빈 상자에 10000 이 들어갔다. 여기서 `=` 는 "같다" 가 아니라 **"넣어라"** 다.' },
    { n: 3, label: '3. 초기화', body: '`int playerLevel = 1;` 을 실행한 직후다. 공간을 만들면서 값까지 한 번에 넣어, playerLevel 상자는 처음부터 값 1 을 가진 채 생겼다.' },
    { n: 4, label: '4. 재할당', body: '`playerGold = 5000;` 을 실행한 직후다. 10000 이 들어 있던 상자에 5000 을 **덮어썼다**. 이전 값 10000 은 남지 않는다 (15000 이 아니다).' },
  ],
  offNote: '교안 4.3 의 ❌ 상황: `int experience;` 로 선언만 하고 바로 `Console.WriteLine(experience);` 로 읽었다. C# 은 값을 한 번도 넣지 않은 지역 변수를 읽는 코드를 **컴파일 단계에서 막는다**. 효과 끄기 화면은 읽는 줄(22번)이 빨갛게 표시되고 콘솔에 `CS0165: Use of unassigned local variable \'experience\'` 가 찍힌다. 프로그램이 한 줄도 실행되지 않아 앞의 1~16번 줄 출력도 없다.',
  mistakes: [
    { title: '값을 넣지 않은 변수를 읽었더니 CS0165 오류가 난다', body: '선언만 한 지역 변수는 값이 정해지지 않은 공간이라 읽을 수 없다. 선언할 때 `int experience = 0;` 처럼 그 상황에서 뜻이 통하는 시작값을 넣어 둔다.' },
    { title: '재할당했는데 CS0128 오류가 난다', body: '`int playerGold = 5000;` 처럼 자료형을 또 적으면 같은 이름의 변수를 하나 더 만드는 것이다. 재할당은 자료형 없이 `playerGold = 5000;` 으로 쓴다.' },
    { title: '`gold = 5000;` 을 했더니 더해지지 않고 5000 이 됐다', body: '재할당은 누적이 아니라 갈아 끼우기다. 더하려면 `gold = gold + 5000;` 처럼 지금 값을 오른쪽에서 읽어 계산한다.' },
    { title: '`playerGold` 와 `playergold` 가 다른 변수로 취급된다', body: 'C# 은 대소문자를 구별한다. 이름이 한 글자만 달라도 "존재하지 않는다" 는 오류가 난다. 지역 변수는 camelCase 로 통일한다.' },
  ],
  unity: CONSOLE_UNITY,
  prompt: {
    goal: '변수의 선언 · 할당 · 초기화 · 재할당이 메모리의 같은 공간에 무엇을 하는지 이해한다.',
    adaptIdeas: ['체력(health)과 소지금(gold)으로 네 단계를 다시 써 보고 싶다.', '값을 넣지 않은 변수를 읽는 다른 경우(if 안에서만 넣기)도 보고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 01장 4.2 의 코드를 줄 번호까지 그대로 옮기고, 4.3 의 ❌ 상황과 ✅ 적용을 효과 끄기로 이었다.',
  lecture: [{ title: '01. 변수', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/01_variable/' }],
  references: [
    { label: 'Microsoft Learn: 선언문 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/statements/declarations' },
    { label: 'Microsoft Learn: 컴파일러 오류 CS0165', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/misc/cs0165' },
  ],
  related: [{ url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/01_variable/', title: '교안: 01. 변수', why: '이 표본의 원본 교안. 3.2 네 단계, 4.2 코드, 4.3 흔한 실수' }],
}
