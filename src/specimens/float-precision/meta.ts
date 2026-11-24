import type { CsMeta } from '../../stage/types.ts'
import { EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'float-precision',
  title: '실수는 근삿값',
  titleEn: 'Floating-Point Is an Approximation',
  group: 'A',
  order: 2,
  concept: '실수 자료형',
  oneLiner: '0.1 을 열 번 더해도 float 는 1 에서 조금 어긋나고 decimal 은 정확히 1.0 이 된다. 그래서 실수는 `==` 로 비교하지 않는다',
  goals: [
    'float 에 0.1 을 열 번 더한 값이 1.0000001 이 되는 것을 상자 값으로 보고, 실수 자료형이 근삿값을 담는다는 것을 설명할 수 있다.',
    '돈처럼 오차가 없어야 하는 계산에는 `decimal`(`m` 접미사)을 고를 수 있다.',
    '실수는 `==` 로 비교하지 않고 `>=` 나 차이의 크기로 판정할 수 있다.',
    '`float` 리터럴에 `f`, `decimal` 리터럴에 `m` 을 붙이는 이유를 안다.',
  ],
  tags: ['float', 'decimal', '자료형', '실수 비교'],
  difficulty: 1,
  params: [
    {
      key: 'potionCount',
      label: '넣는 물약 수 (하나에 0.1)',
      type: 'select',
      default: '10',
      options: [
        { value: '9', label: '9개' },
        { value: '10', label: '10개 (한도에 딱)' },
        { value: '11', label: '11개' },
      ],
      hint: '물약 하나의 무게는 0.1, 가방 한도는 1 이다. float 무게는 0.9000001 · 1.0000001 · 1.1000001 로 늘 조금 어긋나고, decimal 무게는 0.9 · 1.0 · 1.1 로 정확하다',
    },
  ],
  presets: [
    { id: 'exact-limit', name: '물약 10개 (한도에 딱)', values: {} },
    { id: 'under-limit', name: '물약 9개 (한도 아래)', values: { potionCount: '9' } },
    { id: 'over-limit', name: '물약 11개 (한도 넘음)', values: { potionCount: '11' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '첫 번째 더하기', body: '첫 바퀴에서 floatWeight 에 `0.1f` 를 더한 직후다. floatWeight 가 0.1 로 보인다 (decimalWeight 는 다음 줄에서 더한다). `0.1f` 는 2진수로 딱 떨어지지 않아 아주 조금 어긋난 근삿값이 들어 있지만, 찍을 때 짧게 줄여 보여 준다. 재생해 보면 일곱 번째 더하기에서 **0.70000005** 처럼 오차가 드러난다.' },
    { n: 2, label: 'float 와 decimal', body: '열 번 더하고 float 무게를 찍은 직후다. floatWeight 는 **1.0000001**, decimalWeight 는 **1.0** 이다. decimal 은 0.1 을 10진수 그대로 담아 오차가 없다. 그래서 1 도 어긋나면 안 되는 돈 계산은 decimal 이다.' },
    { n: 3, label: '실수 판정', body: '판정을 찍은 직후다. `floatWeight >= bagLimit` 는 1.0000001 이 1 이상이라 isFull 이 true 이고, 콘솔에 `가방이 가득 찼나? True` 가 찍혔다. 효과 끄기에서 `==` 로 바꾸면 1.0000001 과 1 이 같지 않아 False 가 된다.' },
  ],
  offNote: '흔한 실수: 실수를 `==` 로 비교해 `bool isFull = floatWeight == bagLimit;` 로 썼다. 물약 10개를 넣어 floatWeight 가 1.0000001 이라 1 과 같지 않고, isFull 이 false 가 된다. 콘솔이 `가방이 가득 찼나? False` 와 `아직 자리가 있다. 물약을 더 넣는다` 를 찍는다. 11개를 넣어도 같다.',
  mistakes: [
    { title: '물약을 10개 넣었는데 가득 찼다는 판정이 안 나온다', body: '실수는 근삿값이라 0.1 을 열 번 더해도 정확히 1 이 아니다. `==` 대신 `>=` 를 쓰거나, 차이가 아주 작은지 본다: `Math.Abs(a - b) < 0.0001f`. Unity 에서는 `Mathf.Approximately(a, b)`.' },
    { title: '`0.1f + 0.2f == 0.3f` 는 참인데 `0.3f + 0.6f == 0.9f` 는 거짓이다', body: '오차가 우연히 같은 값으로 반올림되는 조합만 맞는다. 어느 값에서 깨지는지 외우지 말고, 실수는 `==` 로 비교하지 않는다고 정해 둔다.' },
    { title: '골드 합계가 조금씩 어긋난다', body: '돈을 `float` 나 `double` 로 계산했다. 오차가 쌓인다. `decimal`(`100.5m`) 로 계산하거나, `int` 로 최소 단위(골드 개수)를 센다.' },
    { title: '`float speed = 1.5;` 가 CS0664 오류다', body: '`1.5` 는 `double` 리터럴이다. `float` 에는 `1.5f`, `decimal` 에는 `1.5m` 처럼 접미사를 붙인다.' },
    { title: '`16777216f + 1f` 를 찍었더니 그대로 `16777216` 이다', body: 'float 는 정수부와 소수부를 합쳐 유효 숫자 약 7자리만 믿을 수 있다. 큰 값에 작은 값을 더하면 자릿수가 모자라 더한 몫이 사라진다. 큰 값을 정확히 세야 하면 `double` 이나 정수 형식을 쓴다.' },
  ],
  unity: {
    setup: [
      '`FloatPrecision.cs` 를 `Assets/CSharpGallery/float-precision/` 에 넣는다.',
      'MonoBehaviour 의 `Start()` 에서 `float` 에 `0.1f` 를 열 번 더하고, `Debug.Log(floatWeight.ToString("F7"));` 와 `Debug.Log(floatWeight == 1f);` 를 찍는다.',
      '같은 비교를 `Mathf.Approximately(floatWeight, 1f)` 로 바꿔 찍어 본다.',
      '`Update()` 에서 `timer += Time.deltaTime;` 로 시간을 쌓고, `timer == 3f` 와 `timer >= 3f` 중 어느 쪽이 실제로 걸리는지 `Debug.Log` 로 본다.',
    ],
    verify: 'Console 에 `1.0000001` 과 `False` 가 찍히고, `Mathf.Approximately` 판정은 `True` 다.',
    pitfalls: [
      'Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.',
      '`Debug.Log(floatWeight)` 는 런타임에 따라 float 를 짧게 반올림해 `1` 로 찍기도 한다. 보이는 값이 같아도 `==` 는 거짓일 수 있다. 숨은 자리는 `ToString("F7")` 로 본다.',
      'Unity 의 좌표 · 속도 · 시간(`transform.position`, `Time.deltaTime`)은 모두 `float` 다. 실수는 `float`, 리터럴에는 `f` 로 통일한다.',
      '`decimal` 은 Unity 가 직렬화하지 않아 `[SerializeField]` 를 붙여도 인스펙터에 보이지 않는다. 금액은 `int` 로 최소 단위를 센다.',
      '`timer == 3f` 로 멈추는 타이머는 프레임 시간이 쌓인 근삿값이라 영영 멈추지 않을 수 있다. `>=` 를 쓴다.',
    ],
  },
  prompt: {
    goal: '실수 자료형(float)이 근삿값을 담는다는 것과, 오차 없는 계산에 decimal 을 쓰고 실수를 == 로 비교하지 않아야 하는 이유를 이해한다.',
    adaptIdeas: ['Time.deltaTime 을 쌓는 스킬 쿨타임 타이머가 == 로는 멈추지 않는 것을 Unity 스크립트로 보고 싶다.', '상점 할인가를 float 와 decimal 로 각각 계산해 차이를 보고 싶다.', 'double 로도 0.1 을 열 번 더해 float 와 비교하고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 02장 §3.2 의 정밀도와 §8 "금융 계산엔 decimal", 03장 §8 의 "실수를 == 로 비교" 를 가방 무게 판정 하나로 이어 새로 썼다.',
  lecture: [
    { title: '02. 자료형', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/02_datatype/' },
    { title: '03. 연산자', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/03_operators/' },
  ],
  references: [
    { label: 'Microsoft Learn: 부동 소수점 숫자 형식 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/builtin-types/floating-point-numeric-types' },
    { label: 'Microsoft Learn: 비교 연산자 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/comparison-operators' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/02_datatype/', title: '교안: 02. 자료형', why: '이 표본의 원본 교안. §3.2 정밀도, §8 금융 계산엔 decimal' },
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/03_operators/', title: '교안: 03. 연산자', why: '§6 의 "실수 비교는 == 로 하지 않습니다" 와 Mathf.Approximately' },
    { id: 'variable-reassign', why: '`floatWeight = floatWeight + 0.1f` 는 앞 장의 재할당이다' },
    { id: 'integer-division', why: '`5 / 2` 가 2 가 되는, 자료형이 계산 결과를 바꾸는 또 다른 함정' },
  ],
}
