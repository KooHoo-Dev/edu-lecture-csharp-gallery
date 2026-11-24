import type { CsMeta } from '../../stage/types.ts'
import { CONSOLE_UNITY, EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'datatype-value-vs-reference',
  title: '값 형식과 참조 형식: 값 복사 · 주소 복사',
  titleEn: 'Value Types and Reference Types',
  group: 'A',
  order: 22,
  concept: '02. 자료형 · 3.3 · 3.4 · 4.2',
  oneLiner: '교안 4.2 코드를 한 줄씩 실행하며 int 는 값이 통째로 복사되고, 배열은 주소만 복사되어 두 변수가 힙의 배열 하나를 함께 가리키는 것을 본다',
  goals: [
    '`int b = a;` 직후 a 와 b 가 따로 떨어진 두 상자이고, b 를 바꿔도 a 는 그대로라는 것(값 형식)을 메모리에서 설명할 수 있다.',
    '`int[] arrB = arrA;` 직후 arrA 와 arrB 가 힙의 배열 하나를 함께 가리키고, 그래서 arrB 로 바꾼 값이 arrA 에도 보인다는 것(참조 형식)을 설명할 수 있다.',
    '값 형식은 값을 스택에, 참조 형식은 본체를 힙에 두고 주소를 변수에 둔다는 것을 화면에서 가리킬 수 있다.',
  ],
  tags: ['값 형식', '참조 형식', '스택', '힙', '배열'],
  difficulty: 1,
  params: [
    {
      key: 'a',
      label: 'a 의 처음 값 (2번 줄)',
      type: 'select',
      default: '10',
      options: [
        { value: '10', label: '10 (교안 그대로)' },
        { value: '7', label: '7' },
      ],
      hint: '3번 줄에서 b 가 받는 값이 바뀐다 (값이 통째로 복사된다). 4번 줄에서 b 만 20 이 되고 a 는 처음 값 그대로 출력된다',
    },
  ],
  presets: [
    { id: 'lecture', name: '교안 그대로', values: {} },
    { id: 'a7', name: '처음 a 가 7', values: { a: '7' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '값이 통째로 복사', body: '`int b = a;` 를 실행한 직후다. a 의 값 10 이 **복사되어** 새 상자 b 에 들어갔다. a 와 b 는 값이 같을 뿐 **따로 떨어진 두 상자**다 (3.3 값 형식).' },
    { n: 2, label: 'b만 바뀜', body: '`b = 20;` 을 실행한 직후다. b 상자만 20 이 되었고 a 상자는 10 그대로다. 복사본을 바꿔도 원본은 영향이 없다. 다음 줄이 `a: 10, b: 20` 을 찍는다.' },
    { n: 3, label: '본체는 힙에', body: '`int[] arrA = { 1, 2, 3 };` 을 실행한 직후다. 값 1, 2, 3 을 담은 **배열 본체는 힙**(오른쪽)에 생기고, arrA 상자에는 값이 아니라 **그 본체를 가리키는 주소**(화살표)가 들어갔다 (3.4 참조 형식).' },
    { n: 4, label: '주소만 복사', body: '`int[] arrB = arrA;` 를 실행한 직후다. 힙에 배열이 하나 더 생기지 **않았다**. arrA 의 주소가 arrB 에 복사되어 **두 화살표가 같은 배열 하나**를 가리킨다.' },
    { n: 5, label: 'arrA에도 반영', body: '`arrB[0] = 99;` 를 실행한 직후다. arrB 로 따라가 배열의 첫 칸을 99 로 바꿨는데, arrA 도 같은 배열을 가리키므로 arrA[0] 도 99 다. 다음 줄이 `arrA[0]: 99, arrB[0]: 99` 를 찍는다.' },
  ],
  offNote: '교안 3.4 의 "대입하면 주소만 복사" 를 모르고, `int[] arrC = arrA;` 로 arrA 의 복사본을 만들었다고 생각한 상황이다. 효과 끄기 화면에서는 힙의 배열이 여전히 **하나**이고 arrA · arrB · arrC 세 화살표가 모두 그 배열을 가리킨다. 그래서 `arrC[0] = 50;` 이 arrA 까지 바꿔 마지막 줄이 `arrA[0]: 50, arrC[0]: 50` 을 찍는다. 효과를 켜면 `{ 1, 2, 3 }` 으로 따로 만든 배열이 힙에 하나 더 생겨 `arrA[0]: 99, arrC[0]: 50` 이다.',
  mistakes: [
    { title: '배열을 다른 변수에 대입하고 고쳤더니 원래 배열도 바뀌었다', body: '배열은 참조 형식이라 `arrB = arrA` 는 본체가 아니라 주소만 복사한다. 두 변수가 같은 배열을 가리키므로 한쪽으로 바꾸면 다른 쪽에서도 보인다. 따로 쓸 배열이 필요하면 따로 만든다.' },
    { title: '`int b = a;` 뒤에 b 를 바꿨는데 a 가 그대로라 헷갈린다', body: 'int 는 값 형식이라 대입하면 값이 통째로 복사된다. a 와 b 는 처음부터 다른 상자이고, 이것이 정상 동작이다.' },
    { title: '`string` 은 참조 형식이라는데 대입한 뒤 한쪽을 바꿔도 다른 쪽이 그대로다', body: '교안 3.4 의 예외다. string 은 불변이라 내용을 그 자리에서 고치지 못하고, 다른 문자열을 넣으면 새 문자열이 만들어진다. 그래서 `string s2 = s1;` 뒤에 s2 에 다른 문자열을 넣어도 s1 은 그대로다. 이 갤러리도 문자열은 힙 화살표 없이 상자 안에 값처럼 그린다.' },
  ],
  unity: CONSOLE_UNITY,
  prompt: {
    goal: '값 형식(int)과 참조 형식(배열)을 대입했을 때 메모리에서 무엇이 복사되는지 이해한다.',
    adaptIdeas: ['bool 이나 double 로도 값 복사를 확인해 보고 싶다.', 'arrA 로 바꾼 값이 arrB 에서도 보이는지 반대 방향으로 확인해 보고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 02장 4.2 의 코드를 줄 번호까지 그대로 옮기고, 3.4 의 "대입하면 주소만 복사" 를 모른 상황을 효과 끄기로 이었다.',
  lecture: [{ title: '02. 자료형', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/02_datatype/' }],
  references: [
    { label: 'Microsoft Learn: 값 형식 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/builtin-types/value-types' },
    { label: 'Microsoft Learn: 참조 형식 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/keywords/reference-types' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/02_datatype/', title: '교안: 02. 자료형', why: '이 표본의 원본 교안. 3.3 값 형식, 3.4 참조 형식, 4.2 코드' },
    { id: 'datatype-basic-types', why: '같은 장 3.2 · 4.1 · 4.3. float 의 7자리와 여덟 가지 자료형' },
    { id: 'datatype-shop-detail', why: '같은 장 5 활용 예시. 자료형을 골라 상품 정보를 표현한다' },
  ],
}
