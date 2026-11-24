import type { CsMeta } from '../../stage/types.ts'
import { EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'tryparse-guard',
  title: 'TryParse 는 반환값을 확인한다',
  titleEn: 'TryParse Guard Clause',
  group: 'A',
  order: 4,
  concept: 'TryParse 와 가드 절',
  oneLiner: '`int.TryParse` 는 성공 여부를 bool 로 돌려주고, 실패하면 out 자리에 0 을 넣는다. 반환값을 확인하는 가드 절이 없으면 0 이 조용히 계산에 흘러간다',
  goals: [
    '`int.TryParse(input, out level)` 이 성공 여부(bool)와 숫자(out) 두 가지를 내놓는다는 것을 메모리의 parsed 와 level 로 볼 수 있다.',
    '변환에 실패하면 level 에 미리 넣어 둔 값이 남지 않고 0 으로 덮어써진다는 것을 설명할 수 있다.',
    '`!parsed || level < 1 || level > 10` 가드 절 하나가 형식이 틀린 입력과 범위 밖 입력을 함께 거른다는 것을 안다.',
  ],
  tags: ['TryParse', '가드 절', '입력 검증', 'out', 'return'],
  difficulty: 1,
  params: [
    {
      key: 'input',
      label: '사용자가 친 글자 input',
      type: 'select',
      default: '"abc"',
      options: [
        { value: '"abc"', label: '"abc" (숫자가 아님)' },
        { value: '"7"', label: '"7"' },
        { value: '" 7 "', label: '" 7 " (앞뒤 공백)' },
        { value: '"999"', label: '"999" (범위 밖)' },
      ],
      hint: '"abc" 는 형식에서, "999" 는 범위에서 가드 절에 걸린다. 앞뒤 공백은 TryParse 가 허용해 " 7 " 도 7 이 된다',
    },
  ],
  presets: [
    { id: 'not-number', name: '숫자가 아닌 입력', values: { input: '"abc"' } },
    { id: 'valid', name: '올바른 입력', values: { input: '"7"' } },
    { id: 'spaces', name: '앞뒤에 공백이 붙은 입력', values: { input: '" 7 "' } },
    { id: 'out-of-range', name: '범위 밖 숫자', values: { input: '"999"' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '실패에 대비한 값?', body: '`int level = 1;` 을 실행한 직후다. 변환에 실패하면 이 1 이 남을 것 같지만, 다음 줄에서 확인한다. input 은 숫자처럼 보여도 언제나 string 이다.' },
    { n: 2, label: 'TryParse 의 두 결과', body: '`int.TryParse(input, out level)` 을 실행한 직후다. "abc" 는 숫자가 아니라 parsed 가 **false** 이고, level 은 1 이 아니라 **0** 으로 덮어써졌다. 입력값을 "7" 로 바꾸면 parsed 는 true, level 은 7 이다.' },
  ],
  offNote: '흔한 실수: TryParse 의 반환값 parsed 를 확인하지 않고 지나갔다 (가드 절이 없다). "abc" 가 오류 한 줄 없이 level 0 이 되어 계산이 이어지고, 콘솔에 `전사 Lv.0 생성, 시작 체력 120` 이 찍힌다. "999" 를 고르면 `전사 Lv.999 생성, 시작 체력 10110` 이다.',
  mistakes: [
    { title: '글자를 쳤는데 오류 없이 레벨 0 캐릭터가 만들어진다', body: '`int.TryParse(input, out level);` 처럼 반환값을 버리면, 실패한 입력이 조용히 0 이 되어 계산에 흘러간다. `if (!int.TryParse(input, out level)) { 안내; return; }` 로 반환값을 확인한다.' },
    { title: '실패하면 미리 넣어 둔 기본값이 남을 줄 알았다', body: 'TryParse 는 실패해도 out 자리에 0 을 넣는다. 기본값을 쓰려면 반환값이 false 일 때 직접 기본값을 넣는다.' },
    { title: '`int.Parse(input)` 에서 프로그램이 멈춘다', body: '`int.Parse` 는 숫자가 아닌 입력에 `FormatException` 을 던진다. 사용자 입력은 `int.TryParse` 로 받는다.' },
    { title: '형식은 맞는데 999 레벨이 통과한다', body: 'TryParse 는 숫자인지만 본다. 범위는 `level < 1 || level > 10` 처럼 같은 가드 절에서 함께 거른다.' },
    { title: '`int level = Console.ReadLine();` 이 컴파일되지 않는다', body: '`ReadLine` 은 언제나 string 을 돌려준다. 숫자가 필요하면 파싱을 거친다 (CS0029).' },
  ],
  unity: {
    setup: [
      '`TryParseGuard.cs` 를 `Assets/CSharpGallery/tryparse-guard/` 에 넣는다.',
      'Hierarchy 의 + 메뉴에서 UI > Input Field - TextMeshPro 와 UI > Button - TextMeshPro 를 만든다.',
      'MonoBehaviour 에 `[SerializeField] private TMP_InputField levelField;` 를 두고, 버튼의 On Click () 에 연결할 `public void OnSubmit()` 메서드를 만든다.',
      '`OnSubmit()` 에서 `levelField.text` 를 input 대신 써서 이 표본의 TryParse 와 가드 절을 옮기고, `Console.WriteLine` 을 `Debug.Log` 로 바꾼다.',
      'Play 해서 입력 칸에 abc, 7, 999 를 차례로 쳐 보고 Console 창을 본다.',
    ],
    verify: 'abc 와 999 는 Console 에 안내 문구만 찍히고, 7 은 `전사 Lv.7 생성, 시작 체력 190` 이 찍힌다.',
    pitfalls: [
      'Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.',
      '`TMP_InputField.text` 도 string 이다. 입력 칸이 UI 로 바뀌어도 TryParse 와 가드 절은 그대로 필요하다.',
      'Input Field 의 Content Type 을 Integer Number 로 두어도 빈 칸은 막지 못한다. 빈 문자열은 TryParse 가 false 를 돌려준다.',
    ],
  },
  prompt: {
    goal: 'int.TryParse 의 반환값을 가드 절로 확인해, 숫자가 아니거나 범위 밖인 입력을 계산 전에 거르는 방법을 이해한다.',
    adaptIdeas: [
      'Unity 의 TMP_InputField 에서 레벨을 입력받는 스크립트로 바꾸고 싶다.',
      '잘못 입력하면 끝내지 않고 다시 묻도록 바꾸고 싶다.',
      '이름(Trim)과 직업(ToUpper)까지 함께 검증하는 캐릭터 생성 창구로 늘리고 싶다.',
    ],
  },
  inspiredBy: [],
  original: '교안 04장의 가드 절 예시(시작 레벨 1~10)와 §8 "TryParse 의 반환값을 버림" 을 바탕으로, 실패한 TryParse 가 out 자리를 0 으로 덮어쓰는 순간을 볼 수 있게 새로 썼다.',
  lecture: [
    { title: '04. 콘솔 입출력', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/04_console_input_output/' },
    { title: '11. 참조', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/11_reference/' },
  ],
  references: [
    { label: 'Microsoft Learn: 문자열을 숫자로 변환하는 방법', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/programming-guide/types/how-to-convert-a-string-to-a-number' },
    { label: 'Microsoft Learn: Int32.TryParse 메서드', url: 'https://learn.microsoft.com/ko-kr/dotnet/api/system.int32.tryparse' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/04_console_input_output/', title: '교안: 04. 콘솔 입출력', why: '이 표본의 원본 교안. §3.3 파싱, §4.4 가드 절, §8 흔한 실수' },
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/11_reference/', title: '교안: 11. 참조', why: 'out 이 호출한 쪽 변수에 값을 넣는 원리를 이어서 본다' },
    { id: 'if-chain-order', why: '가드 절의 조건을 if 와 && · || 로 짜는 법을 이어서 본다' },
  ],
}
