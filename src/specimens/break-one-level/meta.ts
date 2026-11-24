import type { CsMeta } from '../../stage/types.ts'
import { EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'break-one-level',
  title: 'break 는 한 겹만 끝낸다',
  titleEn: 'break Exits One Loop',
  group: 'A',
  order: 7,
  concept: 'break 와 return',
  oneLiner: '두 겹 for 에서 `break` 는 안쪽 반복문 하나만 끝낸다. 찾자마자 두 겹을 한 번에 나오려면 메서드로 빼고 `return` 한다',
  goals: [
    '`break` 가 가장 가까운 반복문 하나만 끝내고, 바깥 반복문은 다음 바퀴로 간다는 것을 실행 줄의 움직임으로 볼 수 있다.',
    '`return` 은 반복문이 몇 겹이든 메서드를 통째로 끝내고 부른 쪽으로 돌아간다는 것을 프레임이 걷히는 모습으로 설명할 수 있다.',
    '중첩 반복문에서 "찾으면 멈춘다" 는 코드를 찾기 메서드 + `return` 으로 쓸 수 있다.',
  ],
  tags: ['break', 'return', '중첩 반복문', '흐름 제어'],
  difficulty: 1,
  params: [
    {
      key: 'map',
      label: '맵',
      type: 'select',
      default: '{ "....", "..S.", "S..." }',
      options: [
        { value: '{ "....", "..S.", "S..." }', label: '슬라임 둘 (가운데 줄, 아랫줄)' },
        { value: '{ "...S", "....", "...." }', label: '슬라임 하나 (윗줄 끝)' },
        { value: '{ "....", "....", "...." }', label: '슬라임 없음' },
      ],
      hint: '슬라임이 둘이면 효과 끄기(break)에서 결과가 갈린다. 슬라임이 없으면 반복을 다 돈 뒤 마지막 return 이 "없음" 을 돌려준다',
    },
  ],
  presets: [
    { id: 'two', name: '슬라임 둘', values: {} },
    { id: 'one', name: '윗줄 끝에서 바로 찾기', values: { map: '{ "...S", "....", "...." }' } },
    { id: 'none', name: '못 찾는 경우', values: { map: '{ "....", "....", "...." }' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '찾기 메서드 부르기', body: '`FindFirstSlime(map)` 을 부른 직후다. 스택에 FindFirstSlime 프레임이 새로 쌓였고, 매개변수 map 은 Main 의 map 과 같은 배열을 가리킨다. 이제 y(줄)와 x(칸) 두 겹 for 로 방을 하나씩 살핀다.' },
    { n: 2, label: '첫 슬라임 발견', body: '`(1, 2)` 칸에서 슬라임을 찾아 found 에 넣은 직후다. looked 가 7 이니 방 7개를 살폈다. 다음 줄이 `슬라임 발견` 을 찍고, 그 뒤 `return found` 가 안쪽 for, 바깥 for, 메서드를 한 번에 끝낸다.' },
    { n: 3, label: '돌아와서 찍기', body: '돌아와 `첫 슬라임: (1, 2)` 를 찍은 직후다. FindFirstSlime 프레임이 걷혔고 Main 의 first 에 `"(1, 2)"` 가 들어 있다. 아랫줄의 두 번째 슬라임은 살피지도 않았다.' },
  ],
  offNote: '흔한 실수: 찾은 자리에서 `return` 대신 `break` 를 썼다. `break` 는 안쪽 for(x) 만 끝내서 바깥 for(y) 가 다음 줄로 넘어가 아랫줄의 슬라임을 또 찾는다. 콘솔에 `슬라임 발견` 이 두 번 찍히고, found 가 덮어써져 `첫 슬라임: (2, 0)` 이 나온다. 전사도 `(2, 0)` 칸으로 간다. 찾은 첫 슬라임은 `(1, 2)` 인데 마지막으로 찾은 것을 돌려준 것이다.',
  mistakes: [
    { title: '`break` 를 했는데 바깥 반복문이 계속 돈다', body: '`break` 는 가장 가까운 반복문 **하나**만 끝낸다. 두 겹을 한 번에 나오려면 찾기를 메서드로 빼고 `return` 한다.' },
    { title: '"첫 번째" 를 찾았는데 마지막 것이 나온다', body: '안쪽 `break` 뒤에도 바깥 반복이 계속 돌아, 결과 변수를 뒤에 찾은 것으로 덮어썼다. 찾자마자 `return` 하거나, 결과가 이미 있으면 바깥 반복도 멈추게 한다.' },
    { title: '`break` 를 두 번 썼는데 두 번째가 실행되지 않는다', body: '첫 `break` 를 만나는 순간 그 반복문을 나가므로 바로 아래 줄은 실행되지 않는다. 바깥 반복문까지 멈추려면 `return` 이나 플래그(`bool done`)를 바깥 조건에서 검사한다.' },
    { title: '`while` 안의 `continue` 뒤로 증감이 실행되지 않아 무한 루프다', body: '`continue` 는 이번 바퀴의 남은 줄을 건너뛴다. `while` 에서는 증감을 `continue` 보다 위에 둔다.' },
  ],
  unity: {
    setup: [
      '`BreakOneLevel.cs` 를 `Assets/CSharpGallery/break-one-level/` 에 넣는다.',
      'MonoBehaviour 에 `[SerializeField] private string[] map = { "....", "..S.", "S..." };` 를 두고, `Start()` 에서 `FindFirstSlime` 과 같은 메서드를 불러 `Debug.Log` 로 찍는다.',
      '`return found;` 를 `break;` 로 바꿔 Play 해 보고, Console 에 찍히는 줄 수와 결과를 비교한다.',
    ],
    verify: 'Console 에 `슬라임 발견: (1, 2)` 와 `첫 슬라임: (1, 2)` 가 찍히고, `break` 로 바꾸면 `슬라임 발견` 이 두 번 찍힌 뒤 `첫 슬라임: (2, 0)` 이 나온다.',
    pitfalls: [
      'Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.',
      '`Update()` 안의 `return` 은 이번 프레임의 `Update` 호출 하나만 끝낸다. 다음 프레임에 Unity 가 `Update()` 를 다시 부른다.',
      '코루틴(`IEnumerator`)을 중간에 끝낼 때는 `return` 이 아니라 `yield break` 를 쓴다.',
    ],
  },
  prompt: {
    goal: '중첩 반복문에서 `break` 는 한 겹만 끝내고, 두 겹을 한 번에 나오려면 메서드와 `return` 을 쓴다는 것을 이해한다.',
    adaptIdeas: ['인벤토리 칸(2중 배열)에서 처음 나오는 빈 칸을 찾는 코드로 바꾸고 싶다.', '메서드 대신 bool 플래그로 바깥 반복문을 멈추는 방법도 보고 싶다.', 'Unity 타일맵에서 플레이어와 가장 가까운 적을 찾는 반복문에 적용하고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 07장 3.2절의 HasBannedItem(두 겹 foreach + return) 원리를 슬라임 찾기 맵으로 옮기고, 8절 흔한 실수의 "break 가 두 겹을 다 빠져나온다고 생각" 을 효과 끄기로 새로 썼다.',
  lecture: [
    { title: '07. 프로그램 흐름 제어', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/07_controlling_program_flow/' },
    { title: '06. 반복문', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/06_loop/' },
  ],
  references: [
    { label: 'Microsoft Learn: 점프 문 - break, continue, return, goto', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/statements/jump-statements' },
    { label: 'Microsoft Learn: 반복 문 - for, foreach, do, while', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/statements/iteration-statements' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/07_controlling_program_flow/', title: '교안: 07. 프로그램 흐름 제어', why: '이 표본의 원본 교안. §3.2 break 는 가장 가까운 반복문 하나만, §8 흔한 실수' },
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/06_loop/', title: '교안: 06. 반복문', why: 'for 와 while 이 한 바퀴씩 도는 순서를 먼저 본다' },
    { id: 'return-value', why: 'return 이 메서드를 끝내고 값을 부른 쪽에 돌려주는 것을 이어서 본다' },
  ],
}
