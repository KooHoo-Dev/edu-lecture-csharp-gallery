import type { CsMeta } from '../../stage/types.ts'
import { EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'if-chain-order',
  title: 'if-else if 는 처음 참인 갈래 하나만',
  titleEn: 'If-Else Chain Order',
  group: 'A',
  order: 5,
  concept: 'if-else if 사슬',
  oneLiner: 'if-else if 사슬은 위에서부터 조건을 검사하다 처음 참이 된 갈래 하나만 실행한다. 넓은 조건을 먼저 두면 아래 갈래에 닿지 못한다',
  goals: [
    'if-else if 사슬이 처음 참인 갈래 하나만 실행하고 나머지 갈래는 건너뛴다는 것을 코드 칸의 → 와 지나간 줄로 설명할 수 있다.',
    '`>=` 기준을 높은 점수부터(좁은 조건부터) 세워야 하는 이유를 85점이 D 등급이 되는 나쁜 예로 설명할 수 있다.',
    '조건 순서가 틀려도 어떤 입력에서는 결과가 같아 실수가 숨는다는 것을 45점 입력으로 확인할 수 있다.',
  ],
  tags: ['if', 'else if', '조건 순서', '분기'],
  difficulty: 1,
  params: [
    {
      key: 'score',
      label: '던전 클리어 점수',
      type: 'select',
      default: '85',
      options: [
        { value: '95', label: '95점 (A 갈래)' },
        { value: '85', label: '85점 (B 갈래)' },
        { value: '72', label: '72점 (C 갈래)' },
        { value: '45', label: '45점 (F 갈래)' },
      ],
      hint: '점수를 바꾸면 → 가 들어가는 갈래와 보상 골드가 바뀐다. 효과 끄기를 켜면 60점 이상은 모두 D 갈래로 들어간다',
    },
  ],
  presets: [
    { id: 'grade-a', name: '95점: 첫 조건에서 참', values: { score: '95' } },
    { id: 'grade-b', name: '85점: 두 번째 조건에서 참', values: { score: '85' } },
    { id: 'grade-c', name: '72점: 세 번째 조건에서 참', values: { score: '72' } },
    { id: 'grade-f', name: '45점: 모두 거짓이라 else', values: { score: '45' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '판정 직전', body: '점수를 찍은 직후다. grade 는 빈 글자, rewardGold 는 0 이고, → 가 if 사슬의 첫 줄에 와 있다. 사슬은 위에서부터 조건을 하나씩 검사한다. 85점이면 어느 갈래에 들어갈지 먼저 말해 본다.' },
    { n: 2, label: '갈래 하나만 실행', body: '사슬을 빠져나와 등급을 찍은 직후다. 사슬 안에서 지나간 줄(줄 번호 옆 점)은 `if (score >= 90)` 줄과 B 갈래 줄뿐이다. 90점 이상이 거짓이라 아래로 내려가 80점 이상에서 **처음 참**이 되었고, 그 갈래 하나만 실행한 뒤 C·D·F 갈래는 검사하지 않고 사슬을 나왔다.' },
    { n: 3, label: '갈래가 정한 보상', body: '`playerGold += rewardGold` 로 200 에 500 을 더한 직후다. playerGold 가 700 이 되었다. 입력값에서 점수를 바꿔 → 가 들어가는 갈래와 골드가 함께 바뀌는 것을 본다.' },
  ],
  offNote: '흔한 실수: 넓은 조건 `score >= 60` 을 맨 위에 두었다. 85점은 첫 조건에서 바로 참이 되어 D 갈래로 들어가고, 아래의 B 갈래는 검사조차 되지 않는다. 콘솔은 `등급 D, 보상 100 골드`, `Player 골드: 300` 이다. 95점, 72점도 모두 D 가 되고, 45점은 두 판이 똑같이 F 라 실수가 드러나지 않는다.',
  mistakes: [
    { title: '85점인데 D 등급이 나온다', body: 'if-else if 는 위에서부터 첫 참을 만나면 끝난다. `score >= 60` 처럼 넓은 조건을 먼저 두면 아래의 좁은 조건에 영원히 닿지 못한다. `>=` 로 세우면 높은 기준(좁은 조건)부터, `<` 로 세우면 낮은 기준부터, 한 방향으로만 세운다.' },
    { title: 'else 없이 if 를 나란히 썼더니 보상이 두 번 들어간다', body: '`if` 를 따로따로 쓰면 각각 검사해 참인 것이 모두 실행된다. 95점이 `>= 90` 과 `>= 80` 둘 다 참이라 1000 과 500 을 모두 받는다. 하나만 골라야 하면 `else if` 로 잇는다.' },
    { title: '`if (score = 90)` 이 컴파일되지 않는다', body: '`=` 는 대입이고 비교는 `==` 다. C# 은 int 를 bool 로 바꾸지 않아 CS0029 오류가 난다. 조건 자리에는 언제나 bool 하나가 와야 한다.' },
    { title: '중괄호 없는 if 에 줄을 더했더니 조건과 상관없이 실행된다', body: '중괄호가 없으면 if 바로 아래 한 문장만 조건에 묶인다. 들여쓰기는 상관없다. 한 줄짜리도 `{ }` 로 감싸 둔다.' },
  ],
  unity: {
    setup: [
      '`IfChainOrder.cs` 를 `Assets/CSharpGallery/if-chain-order/` 에 넣는다.',
      'MonoBehaviour 에 `[SerializeField] private int score = 85;` 를 두고, `Start()` 에 같은 if-else if 사슬을 옮긴다. `Console.WriteLine` 은 `Debug.Log` 로 바꾼다.',
      'Play 를 멈춘 상태에서 인스펙터의 score 를 95, 72, 45 로 바꿔 가며 Play 하고 Console 창의 등급을 비교한다.',
      '사슬의 순서를 `score >= 60` 이 맨 위로 오게 바꿔 같은 점수로 다시 Play 한다.',
    ],
    verify: 'score 가 85 이면 Console 에 `등급 B, 보상 500 골드` 가 찍히고, `score >= 60` 을 맨 위로 올리면 `등급 D, 보상 100 골드` 로 바뀐다.',
    pitfalls: [
      'Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.',
      '`[SerializeField]` 필드의 초기값(`= 85`)은 컴포넌트를 처음 붙일 때만 들어간다. 그 뒤로는 인스펙터 값이 이기므로, 코드의 숫자를 고쳐도 Play 결과가 그대로면 인스펙터를 본다.',
      '`Update()` 안의 if 사슬은 매 프레임 검사된다. 상태가 여럿으로 늘면 `enum` 으로 상태를 두고 `switch` 로 가르는 편이 흩어지지 않는다.',
    ],
  },
  prompt: {
    goal: 'if-else if 사슬이 처음 참인 갈래 하나만 실행한다는 것과, 그래서 조건을 좁은 것부터 세워야 한다는 것을 이해한다.',
    adaptIdeas: [
      'Health 로 정상·위험·쓰러짐 상태를 고르는 사슬로 바꾸고 싶다.',
      '같은 등급 판정을 switch 식으로 바꿔 보고 싶다.',
      '보상을 등급마다 다른 아이템 이름으로 주고 싶다.',
    ],
  },
  inspiredBy: [],
  original: '교안 05장의 점수 → 학점 사슬(3.1 흐름도, 7절 3번)과 4.3 의 요금 예시(넓은 조건을 먼저 둔 실수)를 던전 클리어 점수와 골드 보상으로 옮겨 새로 썼다.',
  lecture: [{ title: '05. 조건문', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/05_conditional_statement/' }],
  references: [
    { label: 'Microsoft Learn: 선택 문 (if, if-else, switch)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/statements/selection-statements' },
    { label: 'Microsoft Learn: 비교 연산자', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/comparison-operators' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/05_conditional_statement/', title: '교안: 05. 조건문', why: '이 표본의 원본 교안. §3.1 조건 순서, §4.3 흔한 실수, §8 주의사항' },
    { id: 'loop-accumulator', why: '다음 장(반복문)에서 같은 골드 보상을 바퀴마다 쌓는다' },
  ],
}
