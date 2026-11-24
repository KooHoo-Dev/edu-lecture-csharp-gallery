import type { CsMeta } from '../../stage/types.ts'
import { CONSOLE_UNITY, EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'variable-game-character',
  title: '활용 예시: 캐릭터 상태를 변수로 두고 재할당하기',
  titleEn: 'Character State and Reassignment',
  group: 'A',
  order: 12,
  concept: '01. 변수 · 3.2 · 5 · 8',
  oneLiner: '교안 5절 활용 예시를 한 줄씩 실행하며 캐릭터 상태 변수 넷이 초기화되고, 공격과 전리품으로 재할당되는 것을 본다',
  goals: [
    '`string` · `int` · `bool` 변수 넷을 초기화하면 이름이 붙은 상자 넷이 처음부터 값을 가진 채 생긴다는 것을 볼 수 있다.',
    '`health = health - 30;` 은 오른쪽을 먼저 계산해 왼쪽에 넣는 재할당이라 `health` 가 양쪽에 나와도 모순이 아니라는 것을 설명할 수 있다.',
    '`isAlive = health > 0;` 처럼 다른 값이 바뀐 뒤 판정을 다시 해 재할당해야 상태가 맞는다는 것을 볼 수 있다.',
    '`gold = 5000;` 은 더하기가 아니라 갈아 끼우기이고, 더하려면 `gold = gold + 5000;` 이라는 것을 안다.',
  ],
  tags: ['변수', '재할당', '초기화', '활용 예시'],
  difficulty: 1,
  params: [
    {
      key: 'health',
      label: 'health 의 처음 값 (3번 줄)',
      type: 'select',
      default: '100',
      options: [
        { value: '100', label: '100 (교안 그대로)' },
        { value: '30', label: '30' },
        { value: '20', label: '20' },
      ],
      hint: '초기화할 때 넣는 체력만 바뀐다. 30 이면 공격 뒤 체력이 0, 20 이면 -10 이 되어 16번 줄의 재판정에서 isAlive 가 false 로 바뀐다',
    },
  ],
  presets: [
    { id: 'lecture', name: '교안 그대로', values: {} },
    { id: 'health30', name: '처음 체력 30', values: { health: '30' } },
    { id: 'health20', name: '처음 체력 20', values: { health: '20' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '초기화', body: '2~5번 줄의 초기화를 마친 직후다. characterName · health · gold · isAlive 상자 넷이 **처음부터 값을 가진 채** 생겼다 ("광전사", 100, 10000, true). 값 없음 상자는 하나도 없다.' },
    { n: 2, label: '체력 재할당', body: '`health = health - 30;` 을 실행한 직후다. 오른쪽 `health - 30` 을 먼저 계산(100 - 30)하고 그 결과 70 을 **같은 health 상자에 덮어썼다**. 새 상자가 생기지 않았다.' },
    { n: 3, label: '소지금 재할당', body: '`gold = gold + 250;` 을 실행한 직후다. 지금 값 10000 을 읽어 250 을 더한 10250 을 gold 상자에 넣었다. 이때 isAlive 는 아직 처음 값 true 그대로다.' },
    { n: 4, label: '생존 여부 재판정', body: '`isAlive = health > 0;` 을 실행한 직후다. 바뀐 체력 70 으로 다시 판정한 결과 true 를 isAlive 에 재할당했다. 처음 체력을 30 이나 20 으로 바꾸면 여기서 **false** 로 바뀐다.' },
  ],
  offNote: '교안 8절의 흔한 실수 "재할당을 누적으로 착각하기": 전리품 5000 을 더하려고 `gold = 5000;` 이라고 썼다. 재할당은 갈아 끼우기라 10250 이 들어 있던 gold 상자에 5000 이 그대로 덮어써진다. 효과 끄기 화면은 콘솔의 세 번째 줄(26번 줄의 출력)이 **5000** 이다 (✅ `gold = gold + 5000;` 이면 15250). 앞의 두 줄 출력은 같다. 22번 줄을 실행한 직후 gold 상자가 10250 에서 5000 으로 바뀌는 것도 한 줄씩 넘겨 볼 수 있다.',
  mistakes: [
    { title: '`gold = 5000;` 을 했더니 더해지지 않고 5000 이 됐다', body: '재할당은 누적이 아니라 갈아 끼우기다. 더하려면 `gold = gold + 5000;` 처럼 지금 값을 오른쪽에서 읽어 계산한다.' },
    { title: '체력이 0 이하인데 생존이 True 로 찍힌다', body: '`isAlive` 는 처음 넣은 true 를 그대로 들고 있다. 체력이 바뀐 뒤 `isAlive = health > 0;` 처럼 다시 판정해 재할당해야 한다.' },
    { title: '재할당했는데 CS0128 오류가 난다', body: '`int health = health - 30;` 처럼 자료형을 또 적으면 같은 이름의 변수를 하나 더 만드는 것이다. 재할당은 자료형 없이 `health = health - 30;` 으로 쓴다.' },
    { title: '`health = health - 30;` 이 수학적으로 말이 안 되어 보인다', body: '`=` 는 "같다" 가 아니라 "넣어라" 다. 오른쪽을 먼저 계산해 그 결과를 왼쪽 변수에 넣으라는 명령이라 health 가 양쪽에 나와도 모순이 아니다.' },
  ],
  unity: CONSOLE_UNITY,
  prompt: {
    goal: '게임 캐릭터의 상태를 변수로 두고, 게임 진행을 재할당으로 표현하는 법을 이해한다.',
    adaptIdeas: ['레벨과 경험치를 더해 레벨업까지 재할당으로 써 보고 싶다.', '몬스터에게 세 번 맞는 동안 체력을 한 변수로 재할당해 보고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 01장 5절 활용 예시 코드를 줄 번호까지 그대로 옮기고, 8절의 "재할당을 누적으로 착각하기" 를 효과 끄기로 이었다.',
  lecture: [{ title: '01. 변수', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/01_variable/' }],
  references: [
    { label: 'Microsoft Learn: 할당 연산자 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/assignment-operator' },
    { label: 'Microsoft Learn: 문자열 보간 $ (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/tokens/interpolated' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/01_variable/', title: '교안: 01. 변수', why: '이 표본의 원본 교안. 5절 활용 예시, 8절 주의사항' },
    { id: 'variable-four-stages', why: '같은 장의 앞 표본. 선언 · 할당 · 초기화 · 재할당 네 단계를 먼저 본다' },
  ],
}
