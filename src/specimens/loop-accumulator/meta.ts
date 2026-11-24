import type { CsMeta } from '../../stage/types.ts'
import { EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'loop-accumulator',
  title: '누적 변수는 반복문 밖에서',
  titleEn: 'Loop Accumulator',
  group: 'A',
  order: 6,
  concept: '반복문과 누적 변수',
  oneLiner: '반복문 밖에서 한 번 만든 totalGold 에 바퀴마다 보상을 더해 쌓는다. 안에서 0 으로 되돌리면 마지막 보상 하나만 남는다',
  goals: [
    'foreach 가 바퀴마다 reward 에 새 값을 넣는 동안 totalGold 는 같은 변수라 값이 쌓이는 것을 메모리 칸으로 볼 수 있다.',
    '누적 변수를 반복문 밖에서 한 번만 0 으로 시작해야 하는 이유를 "마지막 보상만 남는" 나쁜 예로 설명할 수 있다.',
    '반복문 안에서 만든 reward 는 반복문이 끝나면 사라지고, 밖에서 만든 totalGold 는 남는다는 것을 안다.',
  ],
  tags: ['foreach', '누적', '반복문', '스코프'],
  difficulty: 1,
  params: [
    {
      key: 'rewards',
      label: '쓰러뜨린 몬스터의 처치 보상',
      type: 'select',
      default: '{ 30, 50, 25, 40 }',
      options: [
        { value: '{ 30, 50, 25, 40 }', label: '4마리 (30, 50, 25, 40)' },
        { value: '{ 10, 20, 30 }', label: '3마리 (10, 20, 30)' },
        { value: '{ 70 }', label: '1마리 (70)' },
      ],
      hint: '배열의 칸 수만큼 반복문이 돈다. 1마리면 한 바퀴뿐이라 효과 끄기를 켜도 결과가 같다',
    },
  ],
  presets: [
    { id: 'four', name: '4마리 사냥 (흔한 경우)', values: { rewards: '{ 30, 50, 25, 40 }' } },
    { id: 'three', name: '3마리 사냥', values: { rewards: '{ 10, 20, 30 }' } },
    { id: 'one', name: '1마리뿐이면 실수가 숨는다', values: { rewards: '{ 70 }' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '밖에서 한 번 만들기', body: '반복문에 들어가기 전에 누적 변수를 만든 직후다. 스택에 totalGold 가 0 으로 생겼고, rewards 는 힙의 배열을 가리킨다. 이 0 은 이 줄에서 **한 번만** 넣는다.' },
    { n: 2, label: '첫 바퀴에 더하기', body: '첫 바퀴에서 `totalGold += reward` 를 실행한 직후다. reward 는 30, totalGold 는 0 + 30 = 30 이 되었다. 다음 바퀴에는 reward 에 50 이 새로 들어오지만 totalGold 는 같은 변수라 30 위에 더해진다.' },
    { n: 3, label: '반복문이 끝난 뒤', body: '반복문이 끝나고 총 보상을 찍은 직후다. 누적이 30, 80, 105, 145 로 커져 `총 보상: 145 골드` 가 찍혔다. 반복문 안에서 만든 reward 는 스택에서 사라졌고, 밖에서 만든 totalGold 는 145 로 남아 있다.' },
  ],
  offNote: '흔한 실수: 반복문 안 첫 줄에 `totalGold = 0;` 을 넣었다. 바퀴마다 0 으로 되돌아가 `+=` 가 쌓지 못하고, 콘솔의 누적이 30, 50, 25, 40 으로 그 바퀴의 보상만 보인다. 총 보상은 마지막 몬스터의 40 골드, 평균은 10 골드다. 1마리를 고르면 한 바퀴뿐이라 두 판이 똑같이 70 이다.',
  mistakes: [
    { title: '총 보상이 마지막 몬스터의 보상뿐이다', body: '누적 변수를 반복문 안에서 0 으로 되돌리면 바퀴마다 처음부터 다시 센다. 1부터 10까지 더했는데 55 가 아니라 10 이 나오면 거의 이 실수다. 0 으로 시작하는 줄은 반복문 밖, 반복문 바로 위에 한 번만 둔다.' },
    { title: '반복문 뒤에서 누적 변수를 찾지 못한다 (CS0103)', body: '`int totalGold = 0;` 선언 자체를 반복문 블록 안에 두면 그 변수는 블록 안에서만 산다. 반복문이 끝난 뒤의 줄은 이름을 찾지 못해 컴파일이 실패한다. 반복문이 끝나도 써야 하는 변수는 밖에서 선언한다.' },
    { title: '평균의 소수점 아래가 사라진다', body: '`totalGold / rewards.Length` 는 int 끼리 나눠 몫만 남는다 (145 / 4 = 36). 한쪽을 `(double)` 로 바꿔야 36.25 가 나온다.' },
    { title: '`n % 2 == 1` 로 홀수를 골랐더니 음수 홀수가 빠진다', body: 'C# 의 `%` 는 왼쪽 값의 부호를 따라가 `-3 % 2` 가 -1 이다. 홀수 판별은 `n % 2 != 0` 으로 쓴다.' },
  ],
  unity: {
    setup: [
      '`LoopAccumulator.cs` 를 `Assets/CSharpGallery/loop-accumulator/` 에 넣는다.',
      'MonoBehaviour 에 `[SerializeField] private int[] rewards = { 30, 50, 25, 40 };` 를 두고, `Start()` 에 같은 foreach 누적을 옮긴다. `Console.WriteLine` 은 `Debug.Log` 로 바꾼다.',
      'Play 해 Console 창의 누적 줄과 총 보상을 본다. 인스펙터에서 rewards 의 칸을 바꿔 다시 Play 한다.',
    ],
    verify: 'Console 에 누적이 30, 80, 105, 145 로 찍히고 마지막에 `총 보상: 145 골드` 가 나온다.',
    pitfalls: [
      'Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.',
      '여러 프레임에 걸쳐 쌓을 값(총 골드, 점수)은 `Update()` 안의 지역 변수로 두면 매 프레임 0 에서 다시 시작한다. 이 표본의 실수와 같은 모양이다. 필드로 둔다.',
      '`Update()` 안에서 `while (true)` 를 쓰면 한 프레임이 끝나지 않아 에디터가 멈춘다. 여러 프레임에 걸친 반복은 `Update()` 자체나 코루틴으로 한다.',
    ],
  },
  prompt: {
    goal: '반복문에서 누적 변수를 밖에서 한 번 만들어야 바퀴마다 값이 쌓인다는 것을 이해한다.',
    adaptIdeas: [
      '보상 대신 인벤토리 아이템 가격을 더해 총 가격을 구하고 싶다.',
      'foreach 대신 for 와 인덱스로 같은 합을 구해 보고 싶다.',
      '합 말고 가장 큰 보상(최댓값)을 찾는 누적으로 바꾸고 싶다.',
    ],
  },
  inspiredBy: [],
  original: '교안 06장의 합계 누적 예시(§1, §7 4번)와 part6 01장 점검 문제 1번(반복문 안에서 sum = 0 을 하면 10 이 나온다)을 몬스터 처치 보상 합계로 옮겨 새로 썼다.',
  lecture: [
    { title: '06. 반복문', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/06_loop/' },
    { title: '01. 숫자 출력기 (코드 해설 5, 점검 문제 1)', url: 'https://krkoohoo.github.io/01-csharp-basic/part6-projects/01_number_printer/' },
  ],
  references: [
    { label: 'Microsoft Learn: 반복 문 (for, foreach, do, while)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/statements/iteration-statements' },
    { label: 'Microsoft Learn: 산술 연산자 (+=, %, 정수 나누기)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/arithmetic-operators' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/06_loop/', title: '교안: 06. 반복문', why: '이 표본의 원본 교안. §3.5 foreach, §7 4번 합계와 평균' },
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/12_scope_static_const/', title: '교안: 12. 스코프 · 정적 · 상수', why: '반복문 안에서 선언한 변수가 왜 밖에서 사라지는지 이어서 본다' },
    { id: 'if-chain-order', why: '앞 장(조건문)에서 점수에 따라 골드 보상 하나를 고른다' },
    { id: 'array-alias', why: '여기서 도는 rewards 배열이 힙에 있는 참조 타입이라는 것을 이어서 본다' },
  ],
}
