import type { CsMeta } from '../../stage/types.ts'
import { CONSOLE_UNITY, EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'datatype-basic-types',
  title: '기본 자료형: float 의 7자리와 여덟 가지 자료형',
  titleEn: 'Basic Data Types',
  group: 'A',
  order: 21,
  concept: '02. 자료형 · 3.2 · 4.1 · 4.3',
  oneLiner: '교안 3.2 의 float 정밀도 코드와 4.1 문법 구조를 실행해 자료형마다 상자에 어떤 값이 들어가는지 보고, 4.3 의 형식 불일치를 컴파일 오류로 본다',
  goals: [
    '`float` 은 유효 숫자 약 7자리(정수부까지 합쳐서)만 믿을 수 있어 `1234567.8f` 의 .8 이 정확히 담기지 않는다는 것을 출력으로 확인할 수 있다.',
    '정수형 · 실수형 · 문자/문자열 · 논리 네 갈래의 여덟 자료형을 초기화하고, 리터럴의 `L` · `f` · `m` 접미사와 작은따옴표 · 큰따옴표의 차이를 설명할 수 있다.',
    '형식이 맞지 않는 값을 넣으면 실행 전에 컴파일 오류(CS0029 · CS0266 · CS0664)로 막히고, `(int)pi` 처럼 명시적 형변환을 쓰면 소수점이 잘린다는 것을 안다.',
  ],
  tags: ['자료형', 'float', '접미사', '형변환', '컴파일 오류'],
  difficulty: 1,
  params: [
    {
      key: 'big',
      label: 'big 의 처음 값 (2번 줄)',
      type: 'select',
      default: '1234567.8f',
      options: [
        { value: '1234567.8f', label: '1234567.8f (교안 그대로)' },
        { value: '12345.8f', label: '12345.8f' },
        { value: '1.8f', label: '1.8f' },
      ],
      hint: '정수부 자릿수가 바뀐다. 정수부가 짧으면 소수점 아래에 자리가 남아 0.01 을 더한 값이 달라지고 세 번째 출력이 False 가 된다. 두 번째 출력은 어느 쪽이든 실제로 담긴 값이 찍힌다',
    },
  ],
  presets: [
    { id: 'lecture', name: '교안 그대로', values: {} },
    { id: 'five-digit', name: '정수부 5자리', values: { big: '12345.8f' } },
    { id: 'one-digit', name: '정수부 1자리', values: { big: '1.8f' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: 'float 초기화', body: '`float big = 1234567.8f;` 를 실행한 직후다. big 상자에 **1234567.8** 로 보인다. 다시 읽으면 같은 값이 되는 가장 짧은 표기로 보여 주기 때문에 오차가 숨어 있다.' },
    { n: 2, label: '실제로 담긴 값', body: '`Console.WriteLine((double)big);` 을 실행한 직후다. double 로 넓혀 찍으니 콘솔에 **1234567.75** 가 나왔다. 정수부 7자리로 이미 한도라 .8 을 정확히 담지 못했다. 다음 줄은 0.01 을 더해도 그대로라 True 를 찍는다.' },
    { n: 3, label: '4.1 네 갈래', body: '4.1 문법 구조의 여덟 줄을 마친 직후다. 3.1 의 네 갈래대로 정수형 level · population, 실수형 speed · pi · price, 문자 grade 와 문자열 name, 논리 isAlive 가 생겼다. char 는 작은따옴표(\'A\'), string 은 큰따옴표("홍길동")로 보인다.' },
    { n: 4, label: '명시적 형변환', body: '4.3 ✅ 의 `int piInt = (int)pi;` 를 실행한 직후다. double 3.14159265 를 `(int)` 로 바꿔 넣어 piInt 상자에 **3** 이 들어갔다. 소수점 아래는 잘려 사라졌다.' },
  ],
  offNote: '교안 4.3 의 ❌ 상황: `int number = "Hello";` (string 을 int 에), `int piInt = pi;` (double 을 int 에 그대로), `speed = 1.5;` (f 없는 1.5 는 double) 을 썼다. C# 은 형식이 맞지 않는 대입을 **컴파일 단계에서 막는다**. 효과 끄기 화면은 세 줄(27 · 28 · 29번)이 빨갛게 표시되고 콘솔에 CS0029 · CS0266 · CS0664 가 찍힌다. 프로그램이 한 줄도 실행되지 않아 3.2 의 출력도 없다.',
  mistakes: [
    { title: '`float speed = 1.5;` 에서 CS0664 오류가 난다', body: '소수점 숫자 리터럴 `1.5` 는 기본이 double 이다. float 에 넣으려면 `1.5f` 처럼 f 를 붙인다.' },
    { title: '`decimal p = 100.5;` 가 컴파일되지 않는다', body: '`100.5` 는 double 리터럴이라 decimal 에 그대로 들어가지 않는다. `100.5m` 처럼 m 을 붙인다.' },
    { title: '`int piInt = pi;` 에서 CS0266 오류가 난다', body: 'double 을 int 에 그대로 넣으면 소수점이 사라지므로 C# 이 막는다. 손실을 감수한다면 `(int)pi` 로 명시적 형변환을 쓴다. 이때 값은 반올림이 아니라 잘린다.' },
    { title: 'float 에 넣은 큰 수에 작은 값을 더해도 바뀌지 않는다', body: 'float 은 정수부까지 합쳐 유효 숫자 약 7자리만 믿을 수 있다. 더 정밀해야 하면 double, 1원도 어긋나면 안 되는 계산이면 decimal 을 쓴다.' },
  ],
  unity: CONSOLE_UNITY,
  prompt: {
    goal: 'C# 의 기본 자료형을 담을 값의 갈래로 고르고, float 의 정밀도와 형식 불일치 오류를 이해한다.',
    adaptIdeas: ['내 이름 · 나이 · 시력 · 프로그래밍이 처음인지를 네 갈래 자료형으로 선언해 출력해 보고 싶다.', 'float 과 double 에 같은 값을 넣어 출력을 비교해 보고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 02장 3.2 의 float 정밀도 코드와 4.1 문법 구조를 이어 붙이고, 4.3 의 ❌ 상황과 ✅ 적용을 효과 끄기로 이었다. 4.1 과 이름이 겹치는 pi · speed 는 4.3 에서 다시 선언하지 않는다.',
  lecture: [{ title: '02. 자료형', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/02_datatype/' }],
  references: [
    { label: 'Microsoft Learn: 기본 제공 형식 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/builtin-types/built-in-types' },
    { label: 'Microsoft Learn: 부동 소수점 숫자 형식 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/builtin-types/floating-point-numeric-types' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/02_datatype/', title: '교안: 02. 자료형', why: '이 표본의 원본 교안. 3.2 기본 자료형 표, 4.1 문법 구조, 4.3 흔한 실수' },
    { id: 'datatype-value-vs-reference', why: '같은 장의 다음 표본. 값 형식과 참조 형식이 대입할 때 어떻게 다른지 본다' },
    { id: 'datatype-shop-detail', why: '같은 장의 활용 예시. 상품 정보마다 자료형을 고른다' },
  ],
}
