import type { CsMeta } from '../../stage/types.ts'
import { CONSOLE_UNITY, EXEC_EVENTS, STDIN } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'console-read-parse',
  title: '입력 → 처리 → 출력: ReadLine 과 int.Parse',
  titleEn: 'Read, Parse, Print',
  group: 'A',
  order: 41,
  concept: '04. 콘솔 입출력 · 3.1~3.4 · 4.2 · 4.3',
  oneLiner: '교안 4.2 코드를 한 줄씩 실행하며 입력이 string 상자로 들어오고, 파싱으로 int 상자가 생기고, 보간으로 다시 출력되는 것을 본다',
  goals: [
    '`Console.Write` 로 물으면 입력이 질문 바로 옆, 같은 줄에 찍힌다는 것을 콘솔 칸에서 볼 수 있다.',
    '`Console.ReadLine()` 은 숫자를 쳐도 무조건 `string` 을 돌려준다는 것을 메모리의 `"2000"` 상자로 설명할 수 있다.',
    '`int.Parse` 로 파싱해야 계산할 수 있는 int 값이 생기고, 문자열에 숫자를 `+` 하면 컴파일 오류(CS0029)가 난다는 것을 안다.',
    '`$"…{변수}…"` 문자열 보간으로 변수 값을 문장 안에 넣어 출력할 수 있다.',
  ],
  tags: ['Console.ReadLine', 'int.Parse', '파싱', '문자열 보간', 'CS0029'],
  difficulty: 1,
  params: [
    {
      key: STDIN,
      label: '키보드 입력 (이름 · 출생 연도 · 숫자)',
      type: 'select',
      default: '홍길동|2000|10',
      options: [
        { value: '홍길동|2000|10', label: '홍길동 · 2000 · 10 (교안 예)' },
        { value: '김민준|1990|25', label: '김민준 · 1990 · 25' },
        { value: '박서연|2010|100', label: '박서연 · 2010 · 100' },
      ],
      hint: 'ReadLine 이 차례로 읽는 세 줄이다. 이름은 그대로 출력되고, 출생 연도는 파싱되어 나이 계산에 쓰이고, 마지막 숫자에는 5 가 더해진다',
    },
  ],
  presets: [
    { id: 'lecture', name: '교안 그대로', values: {} },
    { id: 'born1990', name: '1990년생', values: { stdin: '김민준|1990|25' } },
    { id: 'born2010', name: '2010년생', values: { stdin: '박서연|2010|100' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '입력은 같은 줄에', body: '`string userName = Console.ReadLine();` 을 실행한 직후다. 2번 줄이 `Write` 라 줄바꿈 없이 커서가 질문 옆에 머물렀고, 친 이름이 콘솔에 **`당신의 이름은? 홍길동`** 처럼 같은 줄에 붙었다 (3.1). 메모리에 userName 상자가 생겨 `"홍길동"` 이 들어갔다.' },
    { n: 2, label: '입력은 항상 string', body: '`string birthYearStr = Console.ReadLine();` 을 실행한 직후다. 숫자 2000 을 쳤지만 birthYearStr 상자에는 **문자열 `"2000"`** 이 들어갔다 (3.2). `ReadLine` 은 무엇을 치든 string 을 돌려준다. 이대로는 계산할 수 없다.' },
    { n: 3, label: '형 변환 (파싱)', body: '`int birthYear = int.Parse(birthYearStr);` 를 실행한 직후다. 문자열 `"2000"` 을 읽어 **int 2000** 을 만들어 새 상자 birthYear 에 넣었다 (3.3). birthYearStr 상자는 그대로 `"2000"` 이다. 파싱은 원래 상자를 바꾸지 않고 새 값을 만든다.' },
    { n: 4, label: '처리', body: '`int age = 2026 - birthYear;` 를 실행한 직후다. 이제 birthYear 가 int 라 뺄셈이 된다. 2026 - 2000 = **26** 이 age 상자에 들어갔다.' },
    { n: 5, label: '문자열 보간', body: '`Console.WriteLine($"안녕하세요, {userName}님!");` 을 실행한 직후다. `$` 가 붙은 문자열의 `{userName}` 자리에 상자의 값이 들어가 **`안녕하세요, 홍길동님!`** 이 찍혔다 (3.4). `WriteLine` 이라 출력 뒤에 줄이 바뀐다.' },
  ],
  offNote: '교안 4.3 실수 1: `string s = Console.ReadLine();` 으로 받은 문자열에 바로 `int result = s + 5;` 를 했다. `s + 5` 는 덧셈이 아니라 문자열 이어 붙이기라 결과가 string 이고, string 은 int 변수에 넣을 수 없다. 효과 끄기 화면은 대입하는 22번 줄이 빨갛게 표시되고 콘솔에 `CS0029: Cannot implicitly convert type \'string\' to \'int\'` 가 찍힌다. 빌드부터 막혀 프로그램이 한 줄도 실행되지 않으므로 앞의 이름·나이 출력도 없다.',
  mistakes: [
    { title: '`int price = Console.ReadLine();` 에서 CS0029 오류가 난다', body: '`ReadLine` 은 항상 string 을 돌려주므로 int 변수에 바로 넣을 수 없다 (파싱 누락). `int.Parse(...)` 나 `int.TryParse(...)` 로 먼저 숫자로 바꾼다.' },
    { title: '`s + 5` 가 15 가 아니라 "105" 처럼 이어 붙는다', body: '`+` 의 한쪽이 문자열이면 더하지 않고 글자를 이어 붙인다. 계산하려면 먼저 파싱해 int 로 만든 뒤 더한다.' },
    { title: '질문과 입력이 두 줄로 벌어진다', body: '질문을 `WriteLine` 으로 내보내면 출력 뒤에 커서가 다음 줄로 내려간다. 입력 직전의 질문은 `Console.Write` 로 쓴다.' },
    { title: '숫자가 아닌 입력에 프로그램이 멈춘다 (FormatException)', body: '`int.Parse` 는 변환에 실패하면 예외를 던져 프로그램을 끝낸다. 사용자 입력은 `int.TryParse` 로 성공 여부를 확인한다.' },
    { title: '`"합 : " + a + b` 가 합이 아니라 34 처럼 찍힌다', body: '앞에서부터 문자열 이어 붙이기가 된다. `$"합 : {a + b}"` 처럼 보간으로 쓰면 계산할 자리가 중괄호 안으로 분명히 갈라진다.' },
  ],
  unity: CONSOLE_UNITY,
  prompt: {
    goal: '콘솔에서 입력을 받아 파싱하고 계산해 문자열 보간으로 출력하는 흐름을 이해한다.',
    adaptIdeas: ['캐릭터 이름과 시작 레벨을 입력받아 "이름 Lv.레벨" 로 출력해 보고 싶다.', '상품 가격과 개수를 입력받아 총액을 계산해 보고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 04장 4.2 의 코드를 줄 번호까지 그대로 옮기고, 4.3 실수 1 을 효과 끄기로, 그것을 먼저 파싱해 고친 코드를 보통 실행으로 이었다.',
  lecture: [{ title: '04. 콘솔 입출력', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/04_console_input_output/' }],
  references: [
    { label: 'Microsoft Learn: Console.ReadLine 메서드', url: 'https://learn.microsoft.com/ko-kr/dotnet/api/system.console.readline' },
    { label: 'Microsoft Learn: Int32.Parse 메서드', url: 'https://learn.microsoft.com/ko-kr/dotnet/api/system.int32.parse' },
    { label: 'Microsoft Learn: 문자열 보간 ($)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/tokens/interpolated' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/04_console_input_output/', title: '교안: 04. 콘솔 입출력', why: '이 표본의 원본 교안. 3.1~3.4 개념, 4.2 기본 예시, 4.3 실수 1' },
    { id: 'console-tryparse', why: '같은 장 4.3 의 ✅ 적용. 숫자가 아닌 입력을 TryParse 로 안전하게 받는다' },
  ],
}
