import type { CsMeta } from '../../stage/types.ts'
import { EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'array-alias',
  title: '배열 대입은 주소 복사',
  titleEn: 'Arrays Are References',
  group: 'A',
  order: 1,
  concept: '배열은 참조 타입',
  oneLiner: '`copy = original` 도, 메서드에 배열을 넘기는 것도 본체를 복사하지 않는다. 두 변수가 배열 하나를 함께 가리킨다',
  goals: [
    '`copy = original` 뒤 `copy[0]` 을 고치면 `original[0]` 도 바뀌는 이유를 화살표 두 개가 모인 배열 하나로 설명할 수 있다.',
    '배열을 메서드에 넘기면 매개변수도 같은 본체를 가리켜, 메서드 안에서 고친 칸이 부른 쪽 배열에 남는다는 것을 프레임 두 개로 볼 수 있다.',
    '내용이 따로 놀아야 하면 `new` 로 본체를 새로 만들고 값을 옮겨 담아야 한다는 것을 안다 (`new` 만 하면 빈 칸이다).',
  ],
  tags: ['배열', '참조 타입', '대입', '매개변수', 'Clone'],
  difficulty: 1,
  params: [
    {
      key: 'copyHow',
      label: 'copy 를 만드는 방법',
      type: 'select',
      default: 'original',
      options: [
        { value: 'original', label: '= original (주소 복사)' },
        { value: 'new int[original.Length]', label: 'new int[original.Length] (빈 본체)' },
        { value: '(int[])original.Clone()', label: '(int[])original.Clone() (본체 복사)' },
      ],
      hint: '대입은 화살표만 하나 더 만든다. new 는 본체를 새로 만들지만 칸이 비어 있고, Clone() 은 본체를 내용째 복사한다',
    },
  ],
  presets: [
    { id: 'alias', name: '대입 (흔한 경우)', values: { copyHow: 'original' } },
    { id: 'empty', name: 'new 로 빈 본체', values: { copyHow: 'new int[original.Length]' } },
    { id: 'clone', name: 'Clone() 으로 본체 복사', values: { copyHow: '(int[])original.Clone()' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '배열 대입', body: '`copy = original` 을 실행한 직후다. 힙의 배열은 하나 그대로이고, **주소만 복사**되어 original 과 copy 의 화살표가 같은 배열로 모였다. 입력값에서 `Clone()` 을 고르면 힙에 배열이 둘이 된다.' },
    { n: 2, label: '한쪽 칸 고치기', body: '`copy[0] = 999` 는 둘이 함께 가리키는 배열의 0번 칸을 고쳤다. 그래서 다음 줄은 `original[0] = 999` 를 찍는다. 대입(`=`)은 복사가 아니다.' },
    { n: 3, label: '메서드에 넘기기', body: '`Clamped(enemyHealths)` 를 부른 직후다. 스택에 Clamped 프레임이 새로 쌓였고, 매개변수 healths 에는 **주소가 복사**되어 Main 의 enemyHealths 와 같은 배열을 가리킨다.' },
    { n: 4, label: '돌려받기', body: '`return result` 로 돌아온 직후다. Clamped 프레임이 걷히고 clamped 가 메서드 안에서 `new` 로 만든 새 배열을 가리킨다. enemyHealths 의 -12, -5 는 그대로라 보정 전과 후가 다르게 찍힌다.' },
  ],
  offNote: '흔한 실수: 메서드 안에서 `int[] result = healths;` 로 받은 배열을 그대로 결과로 썼다. healths 는 부른 쪽 배열의 주소라 for 문이 enemyHealths 의 칸을 직접 0 으로 바꾼다. 힙에 체력 배열이 하나뿐이고 enemyHealths, healths, result, clamped 의 화살표가 모두 그 배열로 모인다. 콘솔의 보정 전과 후가 똑같이 `[40, 0, 90, 0]` 이다.',
  mistakes: [
    { title: '배열을 대입하고 한쪽만 고친 줄 알았다', body: '배열 변수에는 본체의 주소가 들어 있어 `=` 는 주소만 복사한다. 내용을 따로 두려면 `(int[])original.Clone()` 이나 `Array.Copy` 로 본체를 복사한다.' },
    { title: '메서드에 넘긴 배열이 바뀌어 돌아왔다', body: '매개변수도 주소를 받는다. 메서드 안에서 인덱스로 칸을 고치면 부른 쪽 배열이 바뀐다. 원본을 남겨야 하면 메서드 안에서 새 배열을 만들어 결과를 담거나, 복사본을 만들어 넘긴다.' },
    { title: '`new int[n]` 으로 복사했다고 생각했다', body: '`new` 는 같은 크기의 **빈** 본체(모두 0)를 만들 뿐이다. 내용은 `for` 나 `Array.Copy` 로 옮겨 담아야 한다.' },
    { title: '`for (int i = 0; i <= arr.Length; i++)`', body: '마지막 바퀴에서 `arr[Length]` 에 손대 `IndexOutOfRangeException` 이 난다. 조건은 항상 `i < arr.Length` 다.' },
  ],
  unity: {
    setup: [
      '`ArrayAlias.cs` 를 `Assets/CSharpGallery/array-alias/` 에 넣는다.',
      'MonoBehaviour 에 `[SerializeField] private int[] enemyHealths;` 를 두고 인스펙터에서 40, -12, 90, -5 를 채운다.',
      '`Start()` 에서 `CSharpGallery.ArrayAlias.Program` 의 `Clamped` 와 같은 메서드를 불러, 보정 전·후를 `Debug.Log(string.Join(", ", ...))` 로 찍는다. Play 중 인스펙터의 enemyHealths 가 바뀌는지도 본다.',
    ],
    verify: '올바른 Clamped 는 인스펙터의 enemyHealths 를 그대로 두고, `result = healths` 로 쓰면 Play 하자마자 인스펙터의 -12, -5 가 0 으로 바뀐다.',
    pitfalls: [
      'Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.',
      '`mesh.vertices` 처럼 배열을 돌려주는 Unity 속성은 부를 때마다 **새 사본**을 준다. `mesh.vertices[0] = ...` 은 사본만 고친다. 꺼내서 고친 뒤 `mesh.vertices = verts;` 로 다시 넣는다.',
      '인스펙터에 노출한 배열을 스크립트에서 고치면 Play 중에는 인스펙터 값도 바뀐다 (같은 배열이다).',
    ],
  },
  prompt: {
    goal: '배열이 참조 타입이라 대입과 메서드 전달에서 주소만 복사된다는 것과, 내용을 따로 두는 방법을 이해한다.',
    adaptIdeas: ['인벤토리 아이템 이름 배열(string[])로 같은 실험을 하고 싶다.', '배열 대신 List<int> 를 넘기면 어떻게 되는지 보고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 08장의 original/copy 예시와 part6 04번 A6 해설(메서드에 넘긴 배열)을 한 프로그램에 이어, 대입과 매개변수 전달이 같은 원리임을 보이도록 새로 썼다.',
  lecture: [
    { title: '08. 배열', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/08_array/' },
    { title: '04. 반복문 퀴즈 (A6 해설)', url: 'https://krkoohoo.github.io/01-csharp-basic/part6-projects/04_quiz_loop/' },
  ],
  references: [
    { label: 'Microsoft Learn: 배열 (C# 프로그래밍 가이드)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/builtin-types/arrays' },
    { label: 'Microsoft Learn: Array.Clone 메서드', url: 'https://learn.microsoft.com/ko-kr/dotnet/api/system.array.clone' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/08_array/', title: '교안: 08. 배열', why: '이 표본의 원본 교안. §3.4 배열은 참조 타입, §8 흔한 실수' },
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/11_reference/', title: '교안: 11. 참조', why: '매개변수로 넘긴 참조 타입이 어떻게 움직이는지 이어서 본다' },
  ],
}
