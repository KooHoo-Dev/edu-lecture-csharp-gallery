import type { CsMeta } from '../../stage/types.ts'
import { CONSOLE_UNITY, EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'operator-arithmetic-assign',
  title: '산술 연산자와 할당 연산자',
  titleEn: 'Arithmetic and Assignment Operators',
  group: 'A',
  order: 31,
  concept: '03. 연산자 · 3.1 · 3.2',
  oneLiner: '교안 3.1 · 3.2 코드를 한 줄씩 실행하며 산술 연산은 결과만 만들고, 할당은 오른쪽을 먼저 계산해 왼쪽 상자에 덮어쓰는 것을 본다',
  goals: [
    '`number + 50` 같은 산술 연산은 결과만 만들어 넘기고 `number` 상자는 바꾸지 않는다는 것을 볼 수 있다.',
    '정수끼리의 `/` 는 몫, `%` 는 나머지를 내고, `10 / 3` 이 `3` 이 되는 이유를 설명할 수 있다.',
    '`number = number + 50;` 이 오른쪽을 먼저 계산한 뒤 그 결과를 왼쪽 상자에 덮어쓴다는 것을 설명할 수 있다.',
    '`+=` `-=` `*=` `/=` `%=` 가 `변수 = 변수 연산 값` 의 짧은 표기라는 것을 안다.',
  ],
  tags: ['산술 연산자', '할당 연산자', '복합 할당', '정수 나눗셈', '나머지'],
  difficulty: 1,
  params: [
    {
      key: 'number',
      label: 'number 의 처음 값 (2번 줄)',
      type: 'select',
      default: '100',
      options: [
        { value: '100', label: '100 (교안 그대로)' },
        { value: '101', label: '101' },
        { value: '99', label: '99' },
      ],
      hint: '3.1 의 다섯 출력과 3.2 의 세 출력이 바뀐다. 101 은 몫이 20 그대로지만 나머지가 2, 99 는 몫이 19 이고 나머지가 0 (3의 배수) 이다',
    },
  ],
  presets: [
    { id: 'lecture', name: '교안 그대로', values: {} },
    { id: 'remainder2', name: '나머지가 2 인 수', values: { number: '101' } },
    { id: 'multiple3', name: '3의 배수', values: { number: '99' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '3.1 덧셈', body: '`Console.WriteLine(number + 50);` 을 실행한 직후다. 콘솔에 150 이 찍혔지만 메모리의 number 상자는 **그대로 100** 이다. 산술 연산은 결과만 만들어 화면에 넘겼을 뿐이다.' },
    { n: 2, label: '3.1 몫과 나머지', body: '`number % 3` 까지 실행한 직후다. 콘솔에 150, 75, 200, 20, 1 이 찍혔다. 정수끼리의 `/` 는 **몫** (100 / 5 = 20), `%` 는 **나머지** (100 = 3 × 33 + 1) 다. 다섯 줄을 지나는 동안 number 는 한 번도 바뀌지 않았다.' },
    { n: 3, label: '3.2 할당', body: '`number = number + 50;` 을 처음 실행한 직후다. 오른쪽 `100 + 50` 을 **먼저 계산**하고, 그 결과 150 을 왼쪽 number 상자에 덮어썼다. 이번에는 상자가 바뀐다.' },
    { n: 4, label: '3.2 세 번째', body: '같은 줄을 세 번째로 실행한 직후다. 오른쪽이 매번 지금 값을 읽으므로 100 → 150 → 200 → **250** 으로 불어났다. 수학의 등호라면 성립할 수 없는 식이지만, `=` 는 "넣어라" 라서 몇 번이든 돈다.' },
    { n: 5, label: '3.2 복합 할당', body: '`health -= damage;` 를 실행한 직후다. `health = health - damage` 와 같아서 health 는 100 - 30 = **70** 이 됐고, 오른쪽에서 읽기만 한 damage 는 30 그대로다. 앞 줄의 `score += 10` 으로 score 는 50 → 60 이 됐다. 나머지 세 줄까지 마치면 덧붙인 마지막 출력이 `60 70 200 5 0` 을 찍는다 (index 는 4 % 4 = 0 으로 돌아간다).' },
  ],
  offNote: '교안 3.1 표의 "정수 나눗셈이 첫 번째 함정" 이다. 효과 끄기는 `Console.WriteLine(10.0 / 3);` 대신 `Console.WriteLine(10 / 3);` 을 실행한다. 양쪽이 int 라 결과도 int 가 되어 콘솔 여섯째 줄이 `3.3333333333333335` 가 아니라 **3** 으로 찍힌다. 오류 없이 소수점 아래가 사라지므로 비율을 계산할 때 할인이 통째로 0 이 되는 버그 (교안 4절) 로 이어진다.',
  mistakes: [
    { title: '`10 / 3` 이 3.33 이 아니라 3 으로 나온다', body: '양쪽이 int 면 결과도 int 라 소수점 아래가 버려진다. 한쪽을 실수로 만든다: `10.0 / 3` 이나, 변수라면 `(double)a / b`.' },
    { title: '`20 / 100` 으로 할인율을 구했더니 할인이 되지 않는다', body: '정수 나눗셈이라 `20 / 100` 은 0 이다. 비율을 계산할 때는 `20 / 100.0` 처럼 나누는 쪽 어딘가에 실수를 섞는다.' },
    { title: '`number + 50;` 을 했는데 number 가 그대로다', body: '산술 연산은 결과를 만들 뿐 변수를 바꾸지 않는다. 바꾸려면 `number = number + 50;` 이나 `number += 50;` 처럼 할당해야 한다.' },
    { title: '`=` 를 "같다" 로 읽어 `number = number + 50` 이 이해되지 않는다', body: '`=` 는 오른쪽을 계산해서 왼쪽에 넣으라는 명령이다. "같다" 를 묻는 것은 `==` 다.' },
  ],
  unity: CONSOLE_UNITY,
  prompt: {
    goal: '산술 연산자가 결과만 만들고, 할당 연산자가 오른쪽을 먼저 계산해 왼쪽 변수에 덮어쓴다는 것을 이해한다.',
    adaptIdeas: ['거스름돈 6500원에서 500원 동전 개수와 남는 금액을 `/` 와 `%` 로 구해 보고 싶다.', '`count /= 2` 를 홀수 count 로 해서 정수 나눗셈이 어떻게 되는지 보고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 03장 3.1 산술 연산자와 3.2 할당 연산자 코드 블록을 이어서 옮기고, 3.1 표의 정수 나눗셈 함정을 효과 끄기로 넣었다. 3.2 의 `int number = 100;` 은 3.1 에서 이미 선언해 빼고, 복합 할당 블록의 변수 여섯 개는 시작값을, 끝에는 결과를 보는 출력 한 줄을 덧붙였다.',
  lecture: [{ title: '03. 연산자', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/03_operators/' }],
  references: [
    { label: 'Microsoft Learn: 산술 연산자 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/arithmetic-operators' },
    { label: 'Microsoft Learn: 대입 연산자 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/assignment-operator' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/03_operators/', title: '교안: 03. 연산자', why: '이 표본의 원본 교안. 3.1 산술 연산자, 3.2 할당 연산자, 8절 정수 나눗셈' },
    { id: 'operator-compare-logic', why: '3.2 에서 250 이 된 number 로 3.3 비교 연산자가 이어진다' },
    { id: 'operator-before-after', why: '정수 나눗셈으로 할인율이 0 이 되는 4절 ❌ 상황' },
  ],
}
