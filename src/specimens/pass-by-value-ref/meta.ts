import type { CsMeta } from '../../stage/types.ts'
import { EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'pass-by-value-ref',
  title: '사본을 넘기나 변수를 넘기나: 값 전달과 ref',
  titleEn: 'Pass by Value vs ref',
  group: 'A',
  order: 11,
  concept: '값에 의한 전달과 ref',
  oneLiner: '보통 매개변수는 값의 사본이라 메서드가 고쳐도 원본이 그대로이고, `ref` 로 넘기면 메서드가 부른 쪽 변수 자체를 고친다',
  goals: [
    '`Heal(playerHp, …)` 안에서 health 를 바꿔도 playerHp 가 그대로인 이유를 프레임 두 개의 따로 된 상자로 설명할 수 있다.',
    '`ref` 매개변수는 값을 따로 갖지 않고 부른 쪽 변수를 가리킨다는 것을 점선 화살표로 볼 수 있다.',
    '`ref` 는 선언과 호출 양쪽에 붙여야 하고, 호출 전에 변수가 초기화되어 있어야 한다는 것을 안다.',
    '결과를 받을 그릇만 넘길 때는 `out` 을 쓴다는 것을 `ref` 와 비교해 말할 수 있다.',
  ],
  tags: ['매개변수', 'ref', 'out', '값 복사', '메서드'],
  difficulty: 1,
  params: [
    {
      key: 'healAmount',
      label: '회복량',
      type: 'select',
      default: '30',
      options: [
        { value: '10', label: '10' },
        { value: '30', label: '30' },
        { value: '60', label: '60 (최대 100 에서 멈춤)' },
      ],
      hint: '회복량만큼 health 가 오른다. 60 이면 120 이 되어 100 으로 잘린다. 어떤 값이든 Heal 뒤의 playerHp 는 60 그대로다',
    },
  ],
  presets: [
    { id: 'normal', name: '30 회복 (기본)', values: {} },
    { id: 'small', name: '10 회복', values: { healAmount: '10' } },
    { id: 'overflow', name: '60 회복 (최대에서 멈춤)', values: { healAmount: '60' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '값으로 넘기기', body: '`Heal(playerHp, healAmount)` 를 부른 직후다. 스택에 Heal 프레임이 쌓였고, 매개변수 health 에는 playerHp 의 값 60 이 **복사**되어 들어 있다. 두 상자는 남남이다.' },
    { n: 2, label: '사본만 바뀐다', body: '`health += amount` 를 실행한 직후다. Heal 프레임의 health 만 90 이 되었고 Main 의 playerHp 는 60 그대로다. 그래서 콘솔에 `Heal 뒤: playerHp = 60` 이 찍힌다.' },
    { n: 3, label: 'ref 로 넘기면', body: '`ref playerHp` 로 넘긴 HealRef 에서 `health += amount` 를 실행한 직후다. health 칸은 값을 따로 갖지 않고 초록 점선 화살표로 Main 의 playerHp 를 가리킨다. 그래서 playerHp 가 바로 90 이 되었고, 돌아온 뒤에도 `HealRef 뒤: playerHp = 90` 이 찍힌다.' },
  ],
  offNote: '흔한 실수: 원본을 바꾸려고 HealRef 를 만들었는데 선언과 호출에서 `ref` 를 빼먹었다. health 는 다시 사본이라 점선 화살표가 없고, HealRef 안에서 health 가 90 이 되어도 playerHp 는 60 이다. 콘솔에 `HealRef 뒤: playerHp = 60` 이 찍힌다.',
  mistakes: [
    { title: '메서드에서 체력을 올렸는데 원본이 그대로다', body: '값 타입 매개변수는 부른 쪽 값의 사본이다. 원본을 바꾸려면 `ref` 로 넘기거나, 결과를 `return` 으로 돌려받아 `playerHp = Heal(playerHp, 30);` 처럼 다시 넣는다.' },
    { title: '`ref` 를 선언에만 붙였더니 컴파일되지 않는다', body: '`ref` 는 메서드 선언과 호출 양쪽에 붙인다: `HealRef(ref playerHp, 30)`. 호출에서 빼먹으면 CS1620, 선언에서 빼먹으면 CS1615 오류가 난다.' },
    { title: '초기화하지 않은 변수를 `ref` 로 넘겼더니 오류다', body: '`ref` 는 이미 있는 값을 읽고 쓰는 통로라 호출 전에 값이 있어야 한다 (CS0165). 결과만 받을 그릇이면 `out` 을 쓴다. `int.TryParse(text, out int hp)` 가 그 예다.' },
    { title: '`out` 매개변수에 값을 넣지 않았더니 컴파일되지 않는다', body: '`out` 은 메서드가 끝나기 전에 반드시 값을 채워야 한다 (CS0177). 실패하는 갈래에서도 `hp = 0;` 처럼 넣는다.' },
  ],
  unity: {
    setup: [
      '`PassByValueRef.cs` 를 `Assets/CSharpGallery/pass-by-value-ref/` 에 넣는다.',
      'MonoBehaviour 에 `public int health = 60;` 을 두고, `Start()` 에서 `Heal(health, 30)` 과 `HealRef(ref health, 30)` 같은 메서드를 차례로 불러 `Debug.Log` 로 찍는다.',
      '같은 실험을 `Vector3` 로 해 본다: `void Push(Vector3 pos) { pos.x += 1f; }` 는 원본 위치를 바꾸지 못한다.',
    ],
    verify: '`Heal(health, 30)` 뒤에는 health 가 60 그대로이고, `HealRef(ref health, 30)` 뒤에는 Console 과 인스펙터 모두 90 이 된다.',
    pitfalls: [
      'Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.',
      '`Vector3`, `Quaternion`, `Color` 는 값 타입이라 매개변수로 넘기면 사본이다. 메서드에서 `.x` 를 바꿔도 오브젝트는 움직이지 않는다.',
      '`transform.position` 같은 속성은 `ref` 로 넘길 수 없다 (CS0206). 지역 변수에 꺼내 넘긴 뒤 다시 넣는다.',
    ],
  },
  prompt: {
    goal: '매개변수가 기본으로 값의 사본을 받는다는 것과, `ref` 로 부른 쪽 변수를 직접 바꾸는 방법을 이해한다.',
    adaptIdeas: ['두 변수를 바꾸는 `Swap(ref int a, ref int b)` 로 같은 실험을 하고 싶다.', '`out` 으로 몬스터의 체력과 공격력을 한 번에 돌려받는 메서드를 보고 싶다.', 'Vector3 위치를 메서드로 옮기는 Unity 스크립트로 바꾸고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 11장의 AddTen 흔한 실수와 Heal(ref health) 활용 예시를 한 프로그램에 이어, 같은 회복 코드가 ref 하나로 결과가 갈리는 것을 보이도록 새로 썼다.',
  lecture: [
    { title: '11. 참조', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/11_reference/' },
    { title: '10. 메서드', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/10_method/' },
  ],
  references: [
    { label: 'Microsoft Learn: 메서드 매개 변수 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/keywords/method-parameters' },
    { label: 'Microsoft Learn: ref 키워드', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/keywords/ref' },
  ],
  related: [
    { id: 'ref-param-reassign', why: '참조 타입을 넘기면 무엇이 복사되는지, 매개변수에 new 를 넣으면 어떻게 되는지 이어서 본다' },
    { id: 'return-value', why: 'ref 대신 결과를 return 으로 돌려받는 방법' },
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/11_reference/', title: '교안: 11. 참조', why: '이 표본의 원본 교안. §3.1 값에 의한 전달, §3.2 ref, §4.3 흔한 실수' },
  ],
}
