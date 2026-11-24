import type { CsMeta } from '../../stage/types.ts'
import { EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'return-value',
  title: '반환값은 받아야 남는다',
  titleEn: 'Return Values',
  group: 'A',
  order: 10,
  concept: '메서드와 반환값',
  oneLiner: '메서드를 부르면 프레임이 쌓이고, `return` 하면 값 하나만 들고 돌아오며 프레임이 걷힌다. 그 값은 변수에 받아야 남는다',
  goals: [
    '메서드를 부르면 스택에 새 프레임이 쌓이고, 인자가 매개변수로 복사되는 것을 볼 수 있다.',
    '`return` 하면 프레임의 지역 변수와 매개변수가 사라지고 값 하나만 부른 자리로 돌아온다는 것을 설명할 수 있다.',
    '`Heal(hp, 30);` 처럼 반환값을 받지 않으면 계산한 값이 버려져 hp 가 그대로라는 것을 안다.',
  ],
  tags: ['메서드', '반환값', 'return', '매개변수', '스택 프레임'],
  difficulty: 1,
  params: [
    {
      key: 'attack',
      label: '공격력 (attack)',
      type: 'select',
      default: '50',
      options: [
        { value: '50', label: '50 (데미지 35)' },
        { value: '80', label: '80 (데미지 65)' },
        { value: '10', label: '10 (방어력보다 약함)' },
      ],
      hint: 'CalculateDamage 가 돌려주는 값이 바뀐다. 10 이면 `if (dmg < 0) dmg = 0;` 이 데미지를 0 으로 막고, 회복은 최대 체력 100 에서 멈춘다. 이때는 hp 가 처음부터 100 이라 효과 끄기를 켜도 결과가 같다',
    },
  ],
  presets: [
    { id: 'normal', name: '보통 공격 (50)', values: {} },
    { id: 'strong', name: '강한 공격 (80)', values: { attack: '80' } },
    { id: 'weak', name: '약한 공격 (10, 데미지 0)', values: { attack: '10' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '메서드 부르기', body: '`CalculateDamage(attack, 15)` 를 부른 직후다. 스택에 CalculateDamage 프레임이 새로 쌓였고, 인자 50 과 15 가 매개변수 attackPower, monsterDefense 에 **복사**되었다. Main 에는 아직 damage 가 없다. 메서드가 값을 돌려줘야 그 값으로 damage 가 만들어진다.' },
    { n: 2, label: '값 들고 돌아오기', body: '`return dmg` 로 돌아온 직후다. CalculateDamage 프레임이 통째로 걷혀 dmg, attackPower, monsterDefense 가 사라졌다. 남은 것은 돌려받은 값 35 하나이고, 그 값이 Main 의 damage 에 들어갔다.' },
    { n: 3, label: '회복 계산', body: '`Heal` 안에서 `healed = currentHp + amount` 를 계산한 직후다. Heal 프레임의 healed 는 95 지만 Main 의 hp 는 아직 65 다. 메서드 안의 값은 돌려주기 전까지 바깥에서 보이지 않는다.' },
    { n: 4, label: '돌려받아 넣기', body: '`return healed` 로 돌아온 직후다. Heal 프레임이 걷히고 돌려받은 95 가 `hp = Heal(hp, 30)` 의 `=` 로 hp 에 들어갔다. 다음 줄이 `포션 사용 후 체력: 95` 를 찍는다.' },
  ],
  offNote: '흔한 실수: `Heal(hp, 30);` 으로 반환값을 받지 않았다. Heal 프레임 안에서 healed 는 95 가 되지만, 돌아온 값을 담을 자리가 없어 프레임과 함께 사라진다. hp 는 65 그대로라 콘솔에 `포션 사용 후 체력: 65` 가 찍힌다. 컴파일 오류도 경고도 나지 않는다.',
  mistakes: [
    { title: '회복 메서드를 불렀는데 체력이 그대로다', body: '`Heal(hp, 30);` 은 계산만 하고 결과를 버린다. 반환값이 있는 메서드는 `hp = Heal(hp, 30);` 처럼 받아서 쓴다. 매개변수 currentHp 는 hp 의 사본이라, 메서드 안에서 고쳐도 hp 는 바뀌지 않는다.' },
    { title: '`int` 메서드인데 "not all code paths return a value" (CS0161) 가 난다', body: '반환 타입이 있는 메서드는 모든 경로에서 `return 값;` 을 해야 한다. `if` 안에서만 return 하고 끝에 return 이 없으면 컴파일되지 않는다.' },
    { title: '`void` 메서드에서 `return msg;` 가 컴파일되지 않는다', body: '`void` 는 돌려줄 값이 없다는 뜻이다. 값을 돌려주려면 반환 타입을 `string` 등으로 바꾸고, 일찍 끝내기만 하려면 빈 `return;` 을 쓴다.' },
    { title: '메서드 안에서 만든 변수를 Main 에서 쓰려니 이름이 없다고 한다', body: '지역 변수(dmg, healed)는 그 메서드의 프레임에만 있고, return 하면 프레임과 함께 사라진다. 바깥에서 필요한 값은 `return` 으로 돌려받는다.' },
  ],
  unity: {
    setup: [
      '`ReturnValue.cs` 를 `Assets/CSharpGallery/return-value/` 에 넣는다.',
      'MonoBehaviour 를 만들고 `[SerializeField] private int hp = 100;` 를 둔다.',
      '`CalculateDamage`, `Heal` 과 같은 메서드를 그 MonoBehaviour 에 옮기고, `Start()` 에서 `hp = hp - CalculateDamage(50, 15);` 와 `hp = Heal(hp, 30);` 을 차례로 부른다.',
      'Play 하고 인스펙터의 hp 와 `Debug.Log(hp)` 를 본다.',
    ],
    verify: '`hp = Heal(hp, 30);` 이면 인스펙터의 hp 가 95 가 되고, `Heal(hp, 30);` 만 쓰면 65 에 머문다.',
    pitfalls: [
      'Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.',
      '`Start`, `Update`, `OnCollisionEnter` 도 메서드다. Unity 가 알맞은 때에 불러 주는 라이프사이클 메서드라 직접 부르지 않는다.',
      '`Mathf.Max(0, dmg)`, `Mathf.Min(100, healed)` 도 반환값이 있는 메서드다. `Mathf.Max(0, dmg);` 만 쓰면 dmg 는 그대로다.',
    ],
  },
  prompt: {
    goal: '메서드를 부르면 프레임이 쌓이고, return 하면 값 하나만 들고 돌아오며, 그 값을 받아야 남는다는 것을 이해한다.',
    adaptIdeas: ['크리티컬이면 데미지를 두 배로 돌려주는 bool 매개변수를 더하고 싶다.', '골드를 쓰고 남은 골드를 돌려주는 메서드로 같은 실험을 하고 싶다.', 'Unity 의 Mathf.Clamp 로 Heal 을 한 줄로 줄이고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 10장의 CalculateFinalDamage 예시에 체력 회복 메서드를 붙여, 프레임이 쌓이고 걷히는 것과 반환값을 받지 않는 실수를 한 프로그램에서 보이도록 새로 썼다.',
  lecture: [
    { title: '10. 메서드', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/10_method/' },
  ],
  references: [
    { label: 'Microsoft Learn: 메서드 (C# 프로그래밍 가이드)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/programming-guide/classes-and-structs/methods' },
    { label: 'Microsoft Learn: return 문 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/statements/jump-statements' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/10_method/', title: '교안: 10. 메서드', why: '이 표본의 원본 교안. §3.2 매개변수 vs 인자, §3.4 호출도 값입니다, §4.2 데미지 계산 예시' },
    { id: 'array-alias', why: '배열을 돌려주는 메서드에서도 프레임이 쌓이고 걷히는 것을 본다' },
    { id: 'pass-by-value-ref', why: '매개변수는 사본이라 메서드 안에서 고쳐도 부른 쪽 변수가 그대로인 것과, ref 로 직접 고치는 것을 이어서 본다' },
  ],
}
