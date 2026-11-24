import type { CsMeta } from '../../stage/types.ts'
import { EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'integer-division',
  title: '정수끼리 나누면 소수점이 사라진다',
  titleEn: 'Integer Division',
  group: 'A',
  order: 3,
  concept: '정수 나눗셈',
  oneLiner: '`hp / maxHp` 는 int 끼리의 나눗셈이라 0.692 가 아니라 0 이다. float 변수에 담아도 늦고, 캐스트는 나누기 전에 걸어야 한다',
  goals: [
    '`173 / 250` 이 `0` 이 되는 이유를 "양쪽이 int 면 결과도 int, 소수점 아래는 버린다" 로 설명할 수 있다.',
    '`float lateRatio = hp / maxHp;` 처럼 실수 변수에 담아도 나눗셈은 이미 int 로 끝났다는 것을 메모리의 0 으로 확인할 수 있다.',
    '`(float)hp / maxHp` 와 `(float)(hp / maxHp)` 의 차이를 캐스트가 걸리는 순서로 설명할 수 있다.',
    '체력 바 칸 수처럼 몫만 필요한 자리에서는 정수 나눗셈의 버림을 일부러 쓴다는 것을 안다.',
  ],
  tags: ['정수 나눗셈', '캐스트', 'int', 'float', '체력 바'],
  difficulty: 1,
  params: [
    {
      key: 'hp',
      label: '현재 체력 hp (최대 250)',
      type: 'select',
      default: '173',
      options: [
        { value: '173', label: '173' },
        { value: '249', label: '249 (거의 가득)' },
        { value: '25', label: '25 (빈사)' },
        { value: '250', label: '250 (가득 참)' },
      ],
      hint: '가득 찬 250 일 때만 `hp / maxHp` 가 1 이 되어 정수 나눗셈도 맞는 답을 낸다. 249 는 99% 인데 정수 나눗셈은 0 이다',
    },
  ],
  presets: [
    { id: 'normal', name: '체력 173', values: { hp: '173' } },
    { id: 'almost-full', name: '거의 가득 (249)', values: { hp: '249' } },
    { id: 'low', name: '빈사 (25)', values: { hp: '25' } },
    { id: 'full', name: '가득 참이라 버그가 숨는다 (250)', values: { hp: '250' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '정수 나눗셈', body: '`hp / maxHp * 100` 을 계산한 직후다. `173 / 250` 은 int 끼리라 몫 **0** 만 남고, 0 에 100 을 곱해도 0 이다. wrongPercent 가 0 이다.' },
    { n: 2, label: 'float 에 담아도 늦다', body: '`float lateRatio = hp / maxHp;` 를 실행한 직후다. 변수는 float 이지만 오른쪽 나눗셈이 int 로 먼저 끝나 0 이 들어갔다. 담는 그릇이 아니라 **나누는 순간의 타입**이 결과를 정한다.' },
    { n: 3, label: '나누기 전에 캐스트', body: '`(int)(ratio * 100)` 을 계산한 직후다. 바로 위의 `(float)hp / maxHp` 는 hp 를 먼저 float 으로 올려 실수 나눗셈이 되었다. ratio 는 0.692, `(int)(ratio * 100)` 은 소수점을 버려 percent 가 69 다.' },
    { n: 4, label: '몫이 필요한 자리', body: '`percent / 10` 을 계산한 직후다. 69 / 10 은 6 이라 체력 바는 10칸 중 6칸을 채운다. 여기서는 정수 나눗셈의 버림이 원하는 답이다.' },
  ],
  offNote: '흔한 실수: `float ratio = (float)(hp / maxHp);` 로 캐스트를 나눗셈 괄호 밖에 걸었다. 괄호 안 `173 / 250` 이 int 로 먼저 끝나 0 이 되고, 캐스트는 그 0 을 float 으로 바꿀 뿐이다. ratio 와 percent 가 0, 체력 바가 `[□□□□□□□□□□] 0%` 로 비어 버린다.',
  mistakes: [
    { title: '체력이 남았는데 체력 비율이 늘 0% 다', body: '`hp / maxHp * 100` 은 int 끼리 나눠 몫 0 이 먼저 나온다. `(float)hp / maxHp * 100` 처럼 한쪽을 실수로 올리거나, `hp * 100 / maxHp` 처럼 곱하기를 먼저 한다.' },
    { title: '`float ratio = hp / maxHp;` 로 실수 변수에 담았는데 0 이다', body: '오른쪽 나눗셈이 int 로 끝난 뒤에 float 으로 바뀐다. 변수의 타입은 계산이 끝난 결과를 담을 뿐이다. 나누는 식 안에 float 을 넣는다.' },
    { title: '`(float)(a / b)` 로 캐스트를 했는데도 0 이다', body: '괄호 안이 먼저 계산된다. 캐스트는 나누기 **전에** 피연산자에 건다: `(float)a / b`.' },
    { title: '체력이 가득 찼을 때만 체력 바가 맞다', body: '`hp == maxHp` 이면 `hp / maxHp` 가 1 이라 정수 나눗셈도 맞는 답을 낸다. 가득 찬 상태로만 시험하면 버그가 숨는다. 체력을 깎은 상태로도 확인한다.' },
    { title: '`(int)(ratio * 100)` 이 반올림되지 않는다', body: '캐스트는 반올림이 아니라 소수점 버림이다. 99.6 은 99 가 된다. 반올림이 필요하면 `Math.Round` 나 Unity 의 `Mathf.RoundToInt` 를 쓴다.' },
  ],
  unity: {
    setup: [
      '`IntegerDivision.cs` 를 `Assets/CSharpGallery/integer-division/` 에 넣는다.',
      'MonoBehaviour 에 `[SerializeField] private int hp = 173;` 과 `[SerializeField] private int maxHp = 250;` 을 둔다.',
      'Canvas 에 UI 이미지(Image Type 을 Filled 로)를 놓고, `Update()` 에서 `image.fillAmount = hp / maxHp;` 와 `image.fillAmount = (float)hp / maxHp;` 를 차례로 넣어 Play 해 본다.',
      'Play 중 인스펙터에서 hp 를 바꾸며 체력 바가 따라오는지 본다.',
    ],
    verify: '`(float)hp / maxHp` 로 쓰면 hp 173 에서 체력 바가 69% 쯤 차고, `hp / maxHp` 로 쓰면 hp 를 250 으로 올리기 전까지 바가 비어 있다.',
    pitfalls: [
      'Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.',
      '`fillAmount`, `Slider.value` 는 float 이라 `hp / maxHp` 를 넣어도 컴파일 오류가 나지 않는다. 0 이나 1 만 들어가 바가 비었다가 가득 차기만 한다.',
      '`Mathf.FloorToInt`, `Mathf.RoundToInt` 는 버림과 반올림을 이름으로 드러낸다. `(int)` 캐스트는 0 쪽으로 자른다.',
      '매 프레임 `(int)(regenPerSecond * Time.deltaTime)` 처럼 작은 실수를 정수로 바꾸면 늘 0 이 된다. 소수점을 float 필드에 모았다가 1 이 넘을 때 꺼낸다.',
    ],
  },
  prompt: {
    goal: 'int 끼리 나누면 소수점 아래가 버려진다는 것과, 비율을 구할 때 캐스트를 나누기 전에 거는 방법을 이해한다.',
    adaptIdeas: [
      'Unity 의 체력 바 Image.fillAmount 에 체력 비율을 넣는 스크립트로 바꾸고 싶다.',
      '마나 게이지와 경험치 바처럼 비율을 쓰는 곳을 여러 개 만들어 보고 싶다.',
      '평균 점수(총점 / 과목 수)를 소수점 둘째 자리까지 찍는 예로 바꾸고 싶다.',
    ],
  },
  inspiredBy: [],
  original: '교안 03장의 정수 나눗셈 함정과 13장의 체력 바 비율, "캐스트는 나누기 전에" 를 한 프로그램에 이어, 틀린 식 셋과 맞는 식을 차례로 보도록 새로 썼다.',
  lecture: [
    { title: '03. 연산자', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/03_operators/' },
    { title: '13. 형 변환', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/13_type_casting/' },
  ],
  references: [
    { label: 'Microsoft Learn: 산술 연산자 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/arithmetic-operators' },
    { label: 'Microsoft Learn: 캐스팅 및 형식 변환', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/programming-guide/types/casting-and-type-conversions' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/03_operators/', title: '교안: 03. 연산자', why: '이 표본의 원본 교안. §3.1 정수 나눗셈, §8 흔한 실수' },
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/13_type_casting/', title: '교안: 13. 형 변환', why: '체력 바 비율과 "캐스트는 나누기 전에" 를 이어서 본다' },
    { id: 'float-precision', why: 'float 으로 바꾼 뒤에 생기는 실수 오차를 이어서 본다' },
  ],
}
