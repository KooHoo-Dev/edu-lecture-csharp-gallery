import type { CsMeta } from '../../stage/types.ts'
import { CONSOLE_UNITY, EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'datatype-shop-detail',
  title: '활용 예시: 상품 상세를 자료형으로',
  titleEn: 'Product Detail with Data Types',
  group: 'A',
  order: 23,
  concept: '02. 자료형 · 5 · 8',
  oneLiner: '교안 5절 상품 상세 코드를 한 줄씩 실행하며 long · string · int · decimal · double · bool 상자 여섯 개가 생기고 상품 상세 일곱 줄이 출력되는 것을 본다',
  goals: [
    '상품 정보 여섯 가지를 데이터의 성격(큰 숫자, 글자, 정수, 비율, 소수점, 참거짓)에 맞는 자료형으로 고른 이유를 말할 수 있다.',
    '`L` · `m` 접미사가 붙은 리터럴이 long · decimal 상자에 들어가는 것을 볼 수 있다.',
    '문자열 보간 `{ }` 자리에 각 상자의 값이 들어가 출력되는 것을 콘솔과 메모리를 맞대어 확인할 수 있다.',
    'decimal 에 m 없이 소수를 넣으면 컴파일 오류(CS0664)로 막힌다는 것을 안다.',
  ],
  tags: ['자료형', 'long', 'decimal', '접미사', 'CS0664'],
  difficulty: 1,
  params: [
    {
      key: 'price',
      label: 'price 의 값 (4번 줄)',
      type: 'select',
      default: '159000',
      options: [
        { value: '159000', label: '159000 (교안 그대로)' },
        { value: '89000', label: '89000' },
      ],
      hint: 'int 상자 price 의 값과 `가격:` 줄 출력이 바뀐다',
    },
    {
      key: 'onSale',
      label: 'onSale 의 값 (7번 줄)',
      type: 'toggle',
      default: true,
      hint: 'bool 상자는 true / false 둘 중 하나다. 메모리에는 `true` 로, 콘솔의 `할인 여부:` 줄에는 `True` 로 보인다',
    },
  ],
  presets: [
    { id: 'lecture', name: '교안 그대로', values: {} },
    { id: 'not-on-sale', name: '할인 안 함', values: { onSale: false } },
    { id: 'cheaper', name: '가격 89000원', values: { price: '89000' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '큰 숫자 → long', body: '`long productCode = 123456789012L;` 을 실행한 직후다. 1234억이 넘는 수는 int (약 ±21억) 에 들어가지 않아 **long** 상자에 담았다. 리터럴 끝의 `L` 이 long 이라는 표시다.' },
    { n: 2, label: '비율 → decimal', body: '`decimal discountRate = 0.15m;` 을 실행한 직후다. 할인율처럼 오차가 있으면 안 되는 값은 **decimal** 에 담는다. 소수점 리터럴은 기본이 double 이라 `m` 을 붙여야 decimal 이 된다.' },
    { n: 3, label: '상자 여섯 개', body: '`bool onSale = true;` 를 실행한 직후다. 메모리에 **long · string · int · decimal · double · bool** 상자 여섯 개가 모두 생겼다. 아직 출력한 것은 없다 (콘솔이 비어 있다).' },
    { n: 4, label: '할인율 출력', body: '`Console.WriteLine($"할인율: {discountRate * 100}%");` 를 실행한 직후다. decimal 0.15 에 100 을 곱한 값이 `{ }` 자리에 들어가 `할인율: 15.00%` 가 찍혔다. discountRate 상자는 0.15 그대로다.' },
  ],
  offNote: '교안 8절의 흔한 실수 `decimal p = 100.5;` 다. 100.5 처럼 소수점이 있는 리터럴은 기본이 double 이라 decimal 상자에 그대로 넣을 수 없다. 효과 끄기 화면은 그 줄(20번)이 빨갛게 표시되고 콘솔에 `CS0664: Literal of type double cannot be implicitly converted to type \'decimal\'; use an \'M\' suffix …` 가 찍힌다. 프로그램이 한 줄도 실행되지 않아 위의 상품 상세 일곱 줄도 출력되지 않는다. 효과를 켜면 `100.5m` 으로 고쳐 p 상자에 100.5 가 들어가고, 덧붙인 마지막 줄이 `100.5` 를 찍는다.',
  mistakes: [
    { title: '`decimal p = 100.5;` 에서 CS0664 오류가 난다', body: '소수점 리터럴은 기본이 double 이다. decimal 에 넣으려면 `100.5m` 처럼 m 을 붙인다.' },
    { title: '`float x = 1.5;` 에서 오류가 난다', body: '같은 이유로 float 에는 `1.5f` 처럼 f 를 붙인다.' },
    { title: '`int productCode = 123456789012;` 가 컴파일되지 않는다', body: 'int 는 약 ±21억까지만 담는다. 그보다 큰 수는 long 에 담고 리터럴 끝에 `L` 을 붙인다.' },
    { title: '`5 / 2` 가 2.5 가 아니라 2 로 나온다', body: '정수끼리 나누면 결과도 정수라 소수점 아래가 버려진다 (교안 8절 정수 나눗셈 함정). 소수점이 필요하면 실수형으로 계산한다.' },
  ],
  unity: CONSOLE_UNITY,
  prompt: {
    goal: '데이터의 성격에 맞는 자료형을 골라 변수를 만들고, 그 값을 문자열 보간으로 출력한다.',
    adaptIdeas: ['게임 아이템(이름, 가격, 무게, 장착 여부)으로 같은 방식의 상세 정보를 만들어 보고 싶다.', '할인된 가격을 계산해 한 줄 더 출력해 보고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 02장 5절 활용 예시 코드를 그대로 옮기고, 8절의 "decimal 리터럴 뒤 m 누락" 을 효과 끄기로 이었다. p 의 값을 보려고 `Console.WriteLine(p);` 한 줄을 덧붙였다.',
  lecture: [{ title: '02. 자료형', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/02_datatype/' }],
  references: [
    { label: 'Microsoft Learn: 정수 숫자 형식 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/builtin-types/integral-numeric-types' },
    { label: 'Microsoft Learn: 부동 소수점 숫자 형식 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/builtin-types/floating-point-numeric-types' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/02_datatype/', title: '교안: 02. 자료형', why: '이 표본의 원본 교안. 5 활용 예시, 8 주의사항' },
    { id: 'datatype-basic-types', why: '같은 장 3.2 · 4.1 · 4.3. float 의 7자리, 여덟 가지 자료형과 접미사' },
    { id: 'datatype-value-vs-reference', why: '같은 장 3.3 · 3.4 · 4.2. 값 형식과 참조 형식' },
  ],
}
