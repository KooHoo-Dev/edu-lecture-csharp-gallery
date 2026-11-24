import type { CsMeta } from '../../stage/types.ts'
import { CONSOLE_UNITY, EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'console-normalize',
  title: '입력 정규화: 비교하기 전에 모양 맞추기',
  titleEn: 'Normalizing Input Before Comparing',
  group: 'A',
  order: 43,
  concept: '04. 콘솔 입출력 · 3.5 · 8',
  oneLiner: '교안 3.5 코드를 한 줄씩 실행하며 입력 문자열이 raw → trimmed → normalized 상자로 옮겨 가며 모양이 맞춰지는 것을 본다',
  goals: [
    '`" Red "`, `"red"`, `"Red"` 가 사람 눈에는 같아도 `==` 비교에서는 다른 값이라는 것을 메모리 상자로 설명할 수 있다.',
    '`Trim()` 이 앞뒤 공백을, `ToUpper()` 가 대소문자를 맞춘 **새 문자열**을 돌려주고, 그래서 결과를 새 변수에 받는다는 것을 볼 수 있다.',
    '정규화를 `Trim()` 부터 시작해야 하는 이유를 앞에 공백이 붙은 입력으로 설명할 수 있다.',
  ],
  tags: ['입력 정규화', 'Trim', 'ToUpper', '문자열 비교', 'ReadLine'],
  difficulty: 1,
  params: [
    {
      key: 'stdin',
      label: '콘솔에 칠 색 (3번 줄 ReadLine)',
      type: 'select',
      default: ' Red ',
      options: [
        { value: ' Red ', label: '" Red " (앞뒤에 공백, 교안 그대로)' },
        { value: 'red', label: '"red" (소문자)' },
        { value: 'Red', label: '"Red" (그대로 맞는 표기)' },
        { value: 'Blue', label: '"Blue" (다른 색)' },
      ],
      hint: '3번 줄 raw 상자에 친 그대로 들어간다. 그대로 비교는 "Red" 일 때만 True 지만, 정규화 후 비교는 " Red " · "red" · "Red" 모두 True, "Blue" 만 False 다',
    },
  ],
  presets: [
    { id: 'lecture', name: '앞뒤 공백 (교안 그대로)', values: {} },
    { id: 'lower', name: '소문자로 친 입력', values: { stdin: 'red' } },
    { id: 'exact', name: '표기가 맞는 입력', values: { stdin: 'Red' } },
    { id: 'other', name: '다른 색', values: { stdin: 'Blue' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '입력 받기', body: '`string raw = Console.ReadLine();` 을 실행한 직후다. 친 글자가 **앞뒤 공백까지 그대로** raw 상자에 `" Red "` 로 들어갔다. ReadLine 은 무조건 string 을 돌려준다.' },
    { n: 2, label: '그대로 비교', body: '`raw == "Red"` 를 계산한 직후다. 사람 눈에는 Red 지만 앞뒤 공백이 붙어 있어 **다른 값**이다. sameAsTyped 는 `false` 이고, 다음 줄이 콘솔에 `그대로 비교: False` 를 찍는다 (입력값 `Red` 에서만 True).' },
    { n: 3, label: 'Trim()', body: '`raw.Trim()` 을 실행한 직후다. 앞뒤 공백을 뗀 **새 문자열** `"Red"` 가 trimmed 상자에 들어갔다. raw 상자는 `" Red "` 그대로다 (원본을 바꾸지 않는다).' },
    { n: 4, label: 'ToUpper()', body: '`trimmed.ToUpper()` 를 실행한 직후다. 전부 대문자로 바꾼 새 문자열 `"RED"` 가 normalized 상자에 들어갔다. 이제 raw · trimmed · normalized 세 상자에 같은 입력의 세 모양이 나란히 있다. 다음 줄이 콘솔에 `정규화한 값: [RED]` 로 찍는다.' },
    { n: 5, label: '정규화 후 비교', body: '`normalized == "RED"` 를 계산한 직후다. isRed 는 `true` 이고, 다음 줄이 콘솔에 `정규화 후 비교: True` 를 찍는다. 입력값을 `red` · `Red` 로 바꿔도 normalized 는 `"RED"` 가 되어 같은 판정이 나온다.' },
  ],
  offNote: '교안 8절의 실수 "비교 전에 `Trim()` 을 빠뜨림" 이다. 효과 끄기는 `raw.ToUpper()` 로 대문자만 맞추고 공백은 그대로 둔다. 기본 입력 `" Red "` 에서 normalized 상자가 `" RED "` 가 되어 (콘솔 `정규화한 값: [ RED ]`) `"RED"` 와 다르고, isRed 는 `false`, 콘솔에 `정규화 후 비교: False` 가 찍힌다. trimmed 상자는 생기지 않는다. 오류 한 줄 없이 조용히 빠져나간다. 입력값 `red` · `Red` 처럼 공백이 없는 입력에서는 True 로 같아 실수가 드러나지 않는다.',
  mistakes: [
    { title: '`Red` 라고 쳤는데 `==` 비교가 false 다', body: '앞이나 뒤에 스페이스가 섞여 들어왔거나 대소문자가 다르다. `==` 는 글자 하나라도 다르면 다른 값이다. 비교하기 전에 `Trim()` → `ToUpper()` 로 모양을 맞춘다.' },
    { title: '`raw.Trim();` 을 불렀는데 raw 의 공백이 그대로다', body: '`Trim()` · `ToUpper()` 는 원본을 바꾸지 않고 **새 문자열을 돌려준다**. `string trimmed = raw.Trim();` 처럼 결과를 변수에 받아서 쓴다.' },
    { title: '대문자로 맞췄는데 공백이 붙은 입력이 어느 경우에도 걸리지 않는다', body: '정규화를 `ToUpper()` 나 첫 글자 대문자부터 시작해 앞뒤 공백을 다루지 않았다. **정규화는 `Trim()` 부터** 시작한다.' },
    { title: '`ToUpper()` 로 맞춘 뒤 `"Red"` 와 비교해서 늘 false 다', body: '정규화한 값은 전부 대문자 `"RED"` 다. 비교할 글자도 같은 모양(`"RED"`)으로 쓴다.' },
  ],
  unity: CONSOLE_UNITY,
  prompt: {
    goal: '사용자 입력 문자열을 비교하기 전에 Trim() 과 ToUpper() 로 정규화하는 이유와 순서를 이해한다.',
    adaptIdeas: ['직업 입력(warrior / mage)을 같은 방식으로 정규화해 비교해 보고 싶다.', 'ToUpper() 대신 string.Equals(..., StringComparison.OrdinalIgnoreCase) 로 비교하면 어떻게 다른지 보고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 04장 3.5 의 정규화 코드를 그대로 옮기고, 묻는 줄과 정규화 전후 비교 출력을 덧붙였다. 8절의 "Trim() 을 빠뜨림" 을 효과 끄기로 이었다.',
  lecture: [{ title: '04. 콘솔 입출력', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/04_console_input_output/' }],
  references: [
    { label: 'Microsoft Learn: String.Trim 메서드', url: 'https://learn.microsoft.com/ko-kr/dotnet/api/system.string.trim' },
    { label: 'Microsoft Learn: String.ToUpper 메서드', url: 'https://learn.microsoft.com/ko-kr/dotnet/api/system.string.toupper' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/04_console_input_output/', title: '교안: 04. 콘솔 입출력', why: '이 표본의 원본 교안. 3.5 입력 정규화, 8절 주의사항' },
    { id: 'console-tryparse', why: '같은 장 3.3 · 4.3. 숫자 입력은 TryParse 로 걸러 낸다' },
    { id: 'console-guard-character', why: '같은 장 5절. 직업 입력을 Trim().ToUpper() 로 맞춘 뒤 가드 절로 거른다' },
  ],
}
