import type { CsMeta } from '../../stage/types.ts'
import { CONSOLE_UNITY, EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'operator-skill-check',
  title: '활용 예시: 스킬을 쓸 수 있는지 판정하기',
  titleEn: 'Skill Use Check',
  group: 'A',
  order: 35,
  concept: '03. 연산자 · 5',
  oneLiner: '교안 5절의 스킬 판정 코드를 한 줄씩 실행하며 비교 · 논리가 만든 bool 상자, 할당으로 깎이는 mana, 실수 나눗셈으로 환산한 manaPercent 를 본다',
  goals: [
    '비교 연산자가 isLevelEnough · hasEnoughMana 같은 bool 상자를 만들고, `&&` · `!` 가 그것을 조합한다는 것을 볼 수 있다.',
    '`mana -= skillCost;` 가 mana 상자의 값을 실제로 깎는다는 것을 볼 수 있다.',
    '`mana / (double)maxMana` 처럼 한쪽을 실수로 만들어야 비율이 살아난다는 것을 설명할 수 있다.',
    '판정을 bool 변수로 쪼개 두면 왜 못 쓰는지 메모리에서 바로 찾을 수 있다는 것을 안다.',
  ],
  tags: ['연산자', '비교', '논리', '정수 나눗셈', '삼항'],
  difficulty: 1,
  params: [
    {
      key: 'mana',
      label: 'mana 의 처음 값 (4번 줄)',
      type: 'select',
      default: '80',
      options: [
        { value: '80', label: '80 (교안 그대로)' },
        { value: '30', label: '30 (딱 스킬 비용)' },
        { value: '20', label: '20 (모자람)' },
      ],
      hint: '80 이면 스킬을 쓰고 mana 가 50 이 된다 (50.0% 넉넉함). 30 이면 `30 >= 30` 이 true 라 스킬을 쓰고 mana 가 0 이 된다 (0.0% 부족함). 20 이면 hasEnoughMana 가 false 라 쓰지 못하고 20 이 남는다 (20.0% 부족함)',
    },
    {
      key: 'isOnCooldown',
      label: 'isOnCooldown (6번 줄)',
      type: 'toggle',
      default: false,
      hint: '켜면 `!isOnCooldown` 이 false 라 canUseSkill 이 false 다. "사용 조건을 만족하지 않습니다" 가 찍히고 mana 는 깎이지 않는다',
    },
    {
      key: 'playerLevel',
      label: 'playerLevel 의 값 (2번 줄)',
      type: 'select',
      default: '25',
      options: [
        { value: '25', label: '25 (교안 그대로)' },
        { value: '15', label: '15 (레벨 모자람)' },
      ],
      hint: '15 면 `15 >= 20` 이 false 라 isLevelEnough 가 false 다. 마나가 넉넉해도 스킬을 쓰지 못하고 mana 가 그대로 남는다',
    },
  ],
  presets: [
    { id: 'lecture', name: '교안 그대로', values: {} },
    { id: 'low-mana', name: '마나 모자람', values: { mana: '20' } },
    { id: 'exact-cost', name: '마나가 딱 스킬 비용', values: { mana: '30' } },
    { id: 'cooldown', name: '쿨타임 중', values: { isOnCooldown: true } },
    { id: 'low-level', name: '레벨 모자람', values: { playerLevel: '15' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '비교', body: '`bool hasEnoughMana = mana >= skillCost;` 를 실행한 직후다. 비교 연산자 두 줄이 각각 bool 상자를 만들었다: isLevelEnough 는 `25 >= 20` 이라 **true**, hasEnoughMana 는 `80 >= 30` 이라 **true**. 숫자가 아니라 true / false 가 담긴다.' },
    { n: 2, label: '논리', body: '`bool canUseSkill = isLevelEnough && hasEnoughMana && !isOnCooldown;` 을 실행한 직후다. isOnCooldown 이 false 라 `!isOnCooldown` 은 true, 셋 다 true 라 canUseSkill 은 **true** 다. 입력값에서 쿨타임 중을 켜면 여기서 false 가 된다.' },
    { n: 3, label: 'if 로 판정', body: '`if (canUseSkill)` 로 판정한 직후다. canUseSkill 이 true 라 ▶ 가 중괄호 안 18번 줄 `mana -= skillCost;` 로 들어갔다. 다음 칸에서 mana 상자가 80 에서 **50** 으로 깎인다 (`mana = mana - skillCost` 와 같다). false 면 else 쪽 23번 줄로 가고 mana 는 그대로다.' },
    { n: 4, label: '산술', body: '`double manaPercent = mana / (double)maxMana * 100.0;` 을 실행한 직후다. 이 줄에 닿았을 때 mana 는 이미 50 이다. `(double)` 로 한쪽을 실수로 만들어 50 / 100.0 = 0.5, 여기에 100.0 을 곱해 manaPercent 에 **50** 이 들어갔다. 효과 끄기에서는 정수 나눗셈이라 0 이다.' },
    { n: 5, label: '삼항', body: '`string manaState = manaPercent >= 50.0 ? "넉넉함" : "부족함";` 을 실행한 직후다. `50 >= 50.0` 이 true 라 앞쪽 값 "넉넉함" 이 manaState 에 들어갔다. 마지막 줄이 `마나 50/100 (50.0%) - 넉넉함` 을 찍는다.' },
  ],
  offNote: '교안 5절 본문이 짚는 실수: 28번 줄처럼 `(double)` 없이 `mana / maxMana` 로 적었다 (나머지는 30번 줄과 같다). mana 50 과 maxMana 100 이 둘 다 int 라 `50 / 100` 이 **0** 이 되고, 100.0 을 곱해도 0 이다. 메모리의 manaPercent 는 0, manaState 는 "부족함" 이고 콘솔 마지막 줄은 `마나 50/100 (0.0%) - 부족함` 이다 (보통 실행은 50.0% 넉넉함). 레벨 모자람이나 쿨타임 중이라 mana 가 80 으로 남아도 0.0% 다. 마나가 얼마 남았든 늘 0% 로 찍힌다.',
  mistakes: [
    { title: '마나가 남아 있는데 게이지가 늘 0% 로 찍힌다', body: '`mana / maxMana` 는 양쪽이 int 라 정수 나눗셈이다. 50 / 100 은 0 이고, 거기에 100.0 을 곱해도 0 이다. `mana / (double)maxMana` 처럼 한쪽을 실수로 만든다.' },
    { title: '스킬을 못 쓰는데 이유를 모르겠다', body: '조건을 `if` 한 줄에 몰아넣으면 어느 것이 false 인지 보이지 않는다. isLevelEnough · hasEnoughMana 처럼 bool 변수로 쪼개 두고 하나씩 찍어 본다.' },
    { title: '`&&` 와 `||` 를 섞었더니 판정이 생각과 다르다', body: '`&&` 가 `||` 보다 먼저 묶인다. 묶이는 단위를 괄호로 드러낸다.' },
    { title: '`mana >= skillCost;` 만 적었더니 아무 일도 없다', body: '비교 연산자는 bool 을 돌려줄 뿐이다. 결과를 변수에 담거나, 출력에 넘기거나, 조건에 넣어야 쓸모가 생긴다.' },
  ],
  unity: CONSOLE_UNITY,
  prompt: {
    goal: '비교 · 논리 · 할당 · 산술 · 삼항 연산자가 스킬 사용 판정 한 화면에서 각각 무슨 일을 하는지 이해한다.',
    adaptIdeas: ['체력이 30% 아래면 스킬을 못 쓰는 조건을 bool 변수로 하나 더 넣어 보고 싶다.', '남은 마나 상태를 "넉넉함" · "부족함" 대신 다른 말로 바꿔 보고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 03장 5절 활용 예시 코드를 그대로 옮기고, 본문이 짚는 `mana / maxMana` 정수 나눗셈을 효과 끄기로 넣었다.',
  lecture: [{ title: '03. 연산자', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/03_operators/' }],
  references: [
    { label: 'Microsoft Learn: 산술 연산자 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/arithmetic-operators' },
    { label: 'Microsoft Learn: 부울 논리 연산자 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/boolean-logical-operators' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/03_operators/', title: '교안: 03. 연산자', why: '이 표본의 원본 교안. 5절 활용 예시, 8절 주의사항' },
    { id: 'operator-compare-logic', why: '비교가 bool 을 만들고 논리가 bool 을 조합하는 3.3 · 3.4' },
    { id: 'operator-increment-ternary', why: '`조건 ? 값1 : 값2` 삼항을 처음 보는 3.6' },
    { id: 'operator-before-after', why: '같은 장 4절: 정수 나눗셈으로 할인율이 0 이 되는 ❌ 코드와 ✅ 코드' },
  ],
}
