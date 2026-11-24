import type { CsMeta } from '../../stage/types.ts'
import { CONSOLE_UNITY, EXEC_EVENTS, STDIN } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'console-tryparse',
  title: 'TryParse: 잘못된 입력에도 죽지 않는 파싱',
  titleEn: 'Safe Parsing with TryParse',
  group: 'A',
  order: 42,
  concept: '04. 콘솔 입출력 · 3.3 · 4.3',
  oneLiner: '교안 4.3 ✅ 코드를 여러 입력으로 실행하며 TryParse 가 성공 여부(bool)와 값(out)을 따로 돌려주고, 실패하면 number 가 0 이 되는 것을 본다',
  goals: [
    '`int.TryParse` 가 변환 성공 여부를 `bool` 로 돌려주고, 실제 값은 `out int number` 상자에 넣는다는 것을 메모리에서 볼 수 있다.',
    '숫자가 아닌 입력이면 TryParse 가 false 를 돌려주고 number 는 0 이 되며, if/else 의 else 쪽으로 간다는 것을 설명할 수 있다.',
    '`int.Parse` 는 숫자가 아닌 문자열에서 FormatException 으로 프로그램을 멈추게 한다는 것을 안다.',
    'Parse · TryParse · Convert.ToInt32 가 실패할 때 어떻게 다른지 말할 수 있다.',
  ],
  tags: ['int.TryParse', 'out', '파싱', 'FormatException'],
  difficulty: 1,
  params: [
    {
      key: STDIN,
      label: '키보드 입력 (숫자를 입력하세요)',
      type: 'select',
      default: '25',
      options: [
        { value: '25', label: '25 (숫자)' },
        { value: 'abc', label: 'abc (숫자가 아님)' },
        { value: ' 25 ', label: '" 25 " (앞뒤 공백)' },
        { value: '3.5', label: '3.5 (소수)' },
      ],
      hint: 'ReadLine 이 읽는 한 줄이다. 25 와 " 25 " 는 성공해 number 가 25 가 되고 35 를 찍는다 (정수 파싱은 앞뒤 공백을 넘어간다). abc 와 3.5 는 실패해 number 가 0 인 채로 else 쪽 안내 문구를 찍는다',
    },
  ],
  presets: [
    { id: 'number', name: '숫자 입력', values: {} },
    { id: 'text', name: '숫자가 아닌 입력', values: { stdin: 'abc' } },
    { id: 'spaces', name: '앞뒤 공백', values: { stdin: ' 25 ' } },
    { id: 'decimal', name: '소수 입력', values: { stdin: '3.5' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '입력은 string', body: '`string input = Console.ReadLine();` 을 실행한 직후다. 25 를 쳤지만 input 상자에는 **문자열 `"25"`** 가 들어갔다. 계산하려면 int 로 파싱해야 한다.' },
    { n: 2, label: 'TryParse', body: '`if (int.TryParse(input, out int number))` 를 실행한 직후다. TryParse 는 성공 여부를 **bool** 로 돌려주고(여기서는 true), 바꾼 값 25 는 `out` 으로 number 상자에 넣었다. 실패하면 false 를 돌려주고 number 는 **0** 이 된다 (입력값 "숫자가 아닌 입력"). 같은 일을 `int.Parse` 는 실패하면 예외로 프로그램을 멈추고, `Convert.ToInt32` 는 null 이면 0, 형식이 틀리면 예외다 (3.3).' },
  ],
  offNote: '교안 4.3 실수 2: `int n = int.Parse("abc");` 는 빌드는 되지만 실행 중에 멈춘다. 효과 끄기 화면은 질문과 입력까지 찍힌 뒤 7번 줄에서 **FormatException** 이 나 프로그램이 강제 종료되고, 그 뒤의 출력은 없다. 교안 그대로 친 값이 아니라 글자 `"abc"` 를 파싱하므로 무엇을 입력해도 같은 자리에서 멈춘다 (메모리에는 input 상자만 남는다). TryParse 를 쓴 보통 실행은 같은 "숫자가 아닌 입력" 에도 안내 문구를 찍고 정상으로 끝난다.',
  mistakes: [
    { title: '숫자가 아닌 입력 한 번에 프로그램이 꺼진다 (FormatException)', body: '`int.Parse` 는 변환에 실패하면 예외를 던진다. 사용자 입력은 항상 잘못될 수 있으므로 `int.TryParse` 로 성공 여부를 먼저 확인한다.' },
    { title: '숫자가 아닌 것을 쳤는데 오류 없이 엉뚱한 결과가 나온다', body: '`int.TryParse` 의 반환값을 버리고 out 변수만 쓰면, 실패한 입력이 조용히 0 이 되어 계산에 흘러 들어간다. 반환값을 `if` 로 확인한다.' },
    { title: '`int price = Console.ReadLine();` 에서 컴파일 오류가 난다', body: '`ReadLine` 은 항상 string 을 돌려준다 (파싱 누락). `int.TryParse(Console.ReadLine(), out int price)` 처럼 파싱해서 받는다.' },
    { title: '3.5 를 입력했는데 "숫자가 아닙니다" 가 나온다', body: '`int.TryParse` 는 정수 형식만 int 로 바꾼다. 소수점이 있는 입력은 실패해 false 가 된다. 소수가 필요하면 `float.TryParse` 나 `double.TryParse` 를 쓴다.' },
  ],
  unity: CONSOLE_UNITY,
  prompt: {
    goal: '사용자 입력을 int.TryParse 로 안전하게 숫자로 바꾸고, 실패한 경우를 따로 처리하는 방법을 이해한다.',
    adaptIdeas: ['상품 가격을 입력받아 숫자가 아니면 안내하고, 숫자면 할인 가격을 보여 주고 싶다.', '할인율처럼 소수가 들어오는 입력을 float.TryParse 로 받아 보고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 04장 4.3 의 ✅ 적용 코드를 보통 실행으로, ❌ 실수 2 를 효과 끄기로 옮기고, 숫자 · 숫자가 아닌 입력 · 앞뒤 공백 · 소수 입력을 기록했다.',
  lecture: [{ title: '04. 콘솔 입출력', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/04_console_input_output/' }],
  references: [
    { label: 'Microsoft Learn: Int32.TryParse 메서드', url: 'https://learn.microsoft.com/ko-kr/dotnet/api/system.int32.tryparse' },
    { label: 'Microsoft Learn: Int32.Parse 메서드', url: 'https://learn.microsoft.com/ko-kr/dotnet/api/system.int32.parse' },
    { label: 'Microsoft Learn: 문자열을 숫자로 변환하는 방법', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/programming-guide/types/how-to-convert-a-string-to-a-number' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/04_console_input_output/', title: '교안: 04. 콘솔 입출력', why: '이 표본의 원본 교안. 3.3 파싱, 4.3 ❌ 실수 2 와 ✅ 적용' },
    { id: 'console-read-parse', why: '같은 장 4.2 기본 예시. ReadLine 과 int.Parse 로 입력 → 처리 → 출력' },
  ],
}
