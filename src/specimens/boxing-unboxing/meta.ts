import type { CsMeta } from '../../stage/types.ts'
import { EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'boxing-unboxing',
  title: 'object 에 넣으면 상자가 생긴다: 박싱과 언박싱',
  titleEn: 'Boxing and Unboxing',
  group: 'A',
  order: 14,
  concept: '박싱과 언박싱',
  oneLiner: 'int 를 object 자리에 넣으면 힙에 값을 복사한 상자가 생기고, 꺼낼 때는 넣을 때와 같은 타입으로만 꺼낼 수 있다',
  goals: [
    '`object savedGold = gold;` 뒤 힙에 int 상자가 새로 생기고 savedGold 가 그 상자를 가리키는 것을 볼 수 있다.',
    '상자에는 값이 **복사**되어 들어가므로 뒤에 gold 를 바꿔도 상자 속 값은 그대로라는 것을 설명할 수 있다.',
    '`object o = 10;` 을 `(long)o` 로 꺼내면 숫자끼리라도 `InvalidCastException` 이 나는 이유를 "넣은 타입과 같아야 한다" 로 설명할 수 있다.',
    '꺼내기 전에 `is` 로 상자 속 타입을 묻고, 그 타입 그대로 꺼낸 뒤 넓히는 코드를 쓸 수 있다.',
  ],
  tags: ['박싱', '언박싱', 'object', 'is', '형 변환'],
  difficulty: 2,
  params: [
    {
      key: 'savedGold',
      label: 'savedGold 에 넣는 값',
      type: 'select',
      default: 'gold',
      options: [
        { value: 'gold', label: 'gold (int 상자)' },
        { value: '(long)gold', label: '(long)gold (long 상자)' },
        { value: 'gold.ToString()', label: 'gold.ToString() (문자열)' },
      ],
      hint: '무엇을 넣었느냐에 따라 힙의 상자 이름(int, long)이 바뀌고, ReadGold 가 다른 갈래로 꺼낸다. 문자열은 값 타입이 아니라 박싱되지 않는다',
    },
  ],
  presets: [
    { id: 'int-box', name: 'int 로 넣기 (흔한 경우)', values: { savedGold: 'gold' } },
    { id: 'long-box', name: 'long 으로 넣기', values: { savedGold: '(long)gold' } },
    { id: 'text', name: '문자열로 넣기', values: { savedGold: 'gold.ToString()' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '박싱', body: '`object savedGold = gold` 를 실행한 직후다. 힙에 **int 상자**가 새로 생겼고 8750 이 복사되어 들어갔다. savedGold 에는 값이 아니라 그 상자의 주소가 들어 있어 화살표가 상자로 간다.' },
    { n: 2, label: '원래 변수 바꾸기', body: '`gold = 0` 은 스택의 gold 칸만 바꿨다. 상자에는 사본이 들어 있어 8750 그대로다. 다음 줄은 `gold = 0, savedGold = 8750` 을 찍는다.' },
    { n: 3, label: 'object 배열', body: '`saveData` 를 만든 직후다. 레벨 42 는 새 int 상자에 들어갔고, 2번 칸은 savedGold 의 주소를 복사해 **같은 상자**를 가리킨다. object 끼리의 대입은 상자를 새로 만들지 않는다.' },
    { n: 4, label: '꺼내러 가기', body: '`ReadGold(saveData[2])` 를 부른 직후다. 매개변수 field 도 같은 int 상자를 가리킨다. ReadGold 는 `is int` 로 먼저 묻고 `(int)` 로 꺼낸 뒤 long 으로 넓혀 돌려준다.' },
  ],
  offNote: '흔한 실수: 골드를 long 으로 쓰려고 `return (long)field;` 처럼 묻지 않고 바로 꺼냈다. 상자 속은 int 라 숫자끼리라도 `InvalidCastException` 이 나고 프로그램이 ReadGold 에서 멈춘다. 콘솔에는 첫 줄만 찍히고 마지막 줄은 나오지 않는다. 입력값에서 `(long)gold` 를 고르면 long 상자라 같은 코드가 무사히 꺼낸다.',
  mistakes: [
    { title: '`(long)o` 에서 InvalidCastException 이 난다', body: '언박싱은 **넣을 때와 정확히 같은 타입**으로만 된다. int 로 넣은 상자는 `(int)o` 로 꺼낸 뒤 long 에 담는다 (`long n = (int)o;`).' },
    { title: 'object 에 넣은 뒤 원래 변수를 바꿨는데 상자 값이 그대로다', body: '박싱은 값을 상자에 **복사**한다. 상자와 원래 변수는 남남이다. 바뀐 값이 필요하면 다시 넣는다.' },
    { title: '`as int` 가 컴파일되지 않는다', body: '`as` 는 참조 타입과 널 허용 값 타입에만 쓴다. 값 타입은 `is int` 로 물은 뒤 `(int)` 로 꺼내거나 `if (o is int n)` 패턴을 쓴다.' },
    { title: '`as` 로 꺼낸 값에서 NullReferenceException 이 난다', body: '`as` 는 실패하면 예외 대신 `null` 을 준다. 문제가 다음 줄로 미뤄질 뿐이니 `null` 인지 꼭 검사한다.' },
  ],
  unity: {
    setup: [
      '`BoxingUnboxing.cs` 를 `Assets/CSharpGallery/boxing-unboxing/` 에 넣는다.',
      '빈 MonoBehaviour 의 `Start()` 에서 `CSharpGallery.BoxingUnboxing.Program` 의 내용을 옮겨 실행하고, `Console.WriteLine` 을 `Debug.Log` 로 바꿔 Console 창에서 본다.',
      'ReadGold 를 `return (long)field;` 한 줄로 바꿔 Play 해 Console 의 빨간 `InvalidCastException` 을 본다.',
    ],
    verify: 'Console 에 `gold = 0, savedGold = 8750`, `int 상자다. (int) 로 꺼낸 뒤 long 으로 넓힌다`, `전사 Lv.42, 골드 8750` 이 차례로 찍힌다.',
    pitfalls: [
      'Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.',
      '`Debug.Log` 의 매개변수는 `object` 라 `Debug.Log(score)` 처럼 숫자를 넘기면 박싱되어 힙에 상자가 하나 생긴다.',
      'Unity 6 은 C# 9 라 `$"점수 {score}"` 도 `string.Format` 을 거쳐 박싱한다. `Update` 안에서 매 프레임 찍는 로그는 지우거나 조건으로 감싼다.',
    ],
  },
  prompt: {
    goal: '값 타입을 object 자리에 넣을 때 힙에 상자가 생기는 박싱과, 넣은 타입 그대로 꺼내야 하는 언박싱을 이해한다.',
    adaptIdeas: [
      '세이브 데이터를 `Dictionary<string, object>` 로 바꿔 같은 실험을 하고 싶다.',
      '`if (field is int n)` 타입 패턴으로 ReadGold 를 줄여 보고 싶다.',
      'object 대신 제네릭 `List<int>` 를 쓰면 상자가 사라지는지 보고 싶다.',
    ],
  },
  inspiredBy: [],
  original: '교안 13장 §3.5 의 `(long)boxed` 예외와 §5 시나리오 2 의 타입이 섞인 저장 데이터를 한 프로그램에 이어, 박싱 상자가 생기고 공유되고 꺼내지는 과정을 보이도록 새로 썼다.',
  lecture: [
    { title: '13. 형 변환', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/13_type_casting/' },
  ],
  references: [
    { label: 'Microsoft Learn: boxing 및 unboxing (C# 프로그래밍 가이드)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/programming-guide/types/boxing-and-unboxing' },
    { label: 'Microsoft Learn: 형식 테스트 연산자 및 캐스트 식 (is, as, 캐스트)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/type-testing-and-cast' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/13_type_casting/', title: '교안: 13. 형 변환', why: '이 표본의 원본 교안. §3.5 박싱과 언박싱, §3.6 is 와 as, §8 흔한 실수' },
    { id: 'value-vs-reference', why: '값 타입은 복사, 참조 타입은 주소 공유. 박싱 상자는 값 타입을 참조 타입 자리에 넣을 때 생긴다' },
  ],
}
