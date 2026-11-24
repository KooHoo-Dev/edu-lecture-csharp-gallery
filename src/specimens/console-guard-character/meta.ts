import type { CsMeta } from '../../stage/types.ts'
import { CONSOLE_UNITY, EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'console-guard-character',
  title: '가드 절로 거르는 캐릭터 생성 창구',
  titleEn: 'Character Creation with Guard Clauses',
  group: 'A',
  order: 44,
  concept: '04. 콘솔 입출력 · 4.4 · 5',
  oneLiner: '교안 5절 캐릭터 생성 코드를 한 줄씩 실행하며 이름 · 레벨 · 직업을 받는 즉시 다듬고 거르는 것, 잘못된 입력이면 가드 절의 return 에서 프로그램이 끝나는 것을 본다',
  goals: [
    '이름은 `Trim()`, 레벨은 `int.TryParse` 와 범위, 직업은 `Trim().ToUpper()` 로 **받는 자리에서** 다듬고 거르는 흐름을 따라갈 수 있다.',
    '가드 절이 잘못된 입력을 만나면 안내 문구를 찍고 `return` 으로 프로그램을 끝내, 뒤의 줄이 실행되지 않는다는 것을 볼 수 있다.',
    '가드 절을 통과한 뒤에는 `job == "WARRIOR" ? 120 : 80` 이 안전한 이유를 설명할 수 있다.',
    '`int.TryParse` 의 반환값을 버리면 숫자가 아닌 입력이 조용히 0 이 되어 계산에 흘러 들어간다는 것을 안다.',
  ],
  tags: ['가드 절', 'TryParse', 'return', '입력 검증', '삼항 연산자'],
  difficulty: 2,
  params: [
    {
      key: 'stdin',
      label: '콘솔에 칠 이름 · 시작 레벨 · 직업 (8 · 22 · 30번 줄 ReadLine)',
      type: 'select',
      default: '홍길동|3|warrior',
      options: [
        { value: '홍길동|3|warrior', label: '홍길동 / 3 / warrior (모두 통과)' },
        { value: '홍길동|5| Mage ', label: '홍길동 / 5 / " Mage " (마법사, 공백 섞임)' },
        { value: '홍길동|abc|warrior', label: '홍길동 / abc / warrior (레벨 형식이 틀림)' },
        { value: '홍길동|999|warrior', label: '홍길동 / 999 / warrior (레벨 범위 밖)' },
        { value: '홍길동|3|Rogue', label: '홍길동 / 3 / Rogue (선택지 밖 직업)' },
        { value: '   |3|warrior', label: '"   " / 3 / warrior (공백뿐인 이름)' },
      ],
      hint: '입력이 깨지는 자리마다 다른 가드 절이 걸린다. 걸리면 안내 문구를 찍고 return 으로 끝나 뒤의 질문은 나오지 않는다',
    },
  ],
  presets: [
    { id: 'lecture', name: '모두 통과', values: {} },
    { id: 'mage', name: '마법사 (공백 섞인 직업)', values: { stdin: '홍길동|5| Mage ' } },
    { id: 'bad-level', name: '레벨 형식이 틀림', values: { stdin: '홍길동|abc|warrior' } },
    { id: 'bad-job', name: '선택지 밖 직업', values: { stdin: '홍길동|3|Rogue' } },
    { id: 'blank-name', name: '공백뿐인 이름', values: { stdin: '   |3|warrior' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '이름 다듬기', body: '`rawName.Trim()` 을 실행한 직후다. rawName 은 친 그대로, nickname 은 앞뒤 공백을 뗀 새 문자열이다 (기본 입력 `"홍길동"` 은 공백이 없어 둘이 같다). 다음 가드 절은 nickname 의 길이로 빈 이름을 거른다 (입력값 "공백뿐인 이름" 에서는 `""` 이 되어 여기서 끝난다).' },
    { n: 2, label: '레벨 가드 절', body: '`if (!int.TryParse(...) || level < minLevel || level > maxLevel)` 를 실행한 직후다. 입력 `"3"` 이 파싱되어 level 상자에 3 이 들어갔고, 형식도 범위도 맞아 `{ }` 안을 건너뛰었다. 입력값 abc · 999 에서는 안내 문구를 찍고 `return` 으로 끝난다.' },
    { n: 3, label: '직업 정규화', body: '`rawJob.Trim().ToUpper()` 를 실행한 직후다. rawJob 은 `"warrior"`, job 은 `"WARRIOR"` 다. 그래서 바로 아래 가드 절이 `"WARRIOR"` · `"MAGE"` 로 비교한다.' },
    { n: 4, label: '삼항으로 기본 체력', body: '`job == "WARRIOR" ? 120 : 80` 을 실행한 직후다. 세 값이 모두 검증을 통과했으므로 job 은 둘 중 하나뿐이고, baseHp 는 120 이다. 다음 줄에서 hp 는 120 + 3 × 10 = 150 이 된다.' },
  ],
  offNote: '교안 3.3 · 8절의 실수 "`int.TryParse` 를 부르고 **반환값을 버림**" 이다. 효과 끄기는 `int.TryParse(Console.ReadLine(), out int level);` 로 결과를 받지 않아 레벨 가드 절이 통째로 없다. 기본 입력(3)처럼 숫자를 치면 결과가 같아 실수가 숨는다. 입력값을 **레벨 형식이 틀림(abc)** 으로 두면 level 상자가 조용히 0 이 되고, 안내 한 줄 없이 `홍길동 · WARRIOR · Lv.0 · 시작 체력 120` 이 찍힌다 (보통 실행은 `레벨은 1에서 10 사이의 정수여야 합니다.` 로 끝난다). 범위 검사도 함께 사라져 999 를 치면 `Lv.999 · 시작 체력 10110` 이 나온다.',
  mistakes: [
    { title: '숫자가 아닌 레벨을 쳤는데 오류 없이 Lv.0 캐릭터가 만들어진다', body: '`int.TryParse` 의 반환값을 버리고 out 변수만 썼다. 실패하면 out 변수에는 0 이 들어간다. `if (!int.TryParse(...))` 처럼 반환값으로 가드 절을 만든다.' },
    { title: '`Warrior` 를 골랐는데 "직업은 Warrior 또는 Mage 중 하나여야 합니다." 가 나온다', body: '앞뒤 공백이나 대소문자가 남은 채 비교했다. 비교 전에 `Trim().ToUpper()` 로 표기를 맞추고, 비교할 글자도 `"WARRIOR"` 처럼 대문자로 쓴다.' },
    { title: '`Rogue` 라고 쳤는데 안내 없이 마법사 체력을 받는다', body: '직업 가드 절 없이 `job == "WARRIOR" ? 120 : 80` 만 두었다. 선택지 밖의 값을 먼저 걸러야 삼항 연산자가 안전하다.' },
    { title: '스페이스만 친 이름으로 캐릭터가 만들어진다', body: '`Trim()` 하지 않은 문자열의 길이를 검사했다. `"   "` 은 길이가 3 이다. `Trim()` 한 뒤 `Length == 0` 으로 거른다.' },
    { title: '레벨에 abc 를 쳤더니 프로그램이 강제 종료된다', body: '`int.Parse` 만 쓰고 잘못된 입력에 대비하지 않았다. `int.Parse` 는 변환에 실패하면 FormatException 으로 멈춘다. `int.TryParse` 의 반환값으로 가드 절을 만들어 안내 문구를 찍고 `return` 한다.' },
  ],
  unity: CONSOLE_UNITY,
  prompt: {
    goal: '콘솔 입력을 받는 자리에서 다듬고 가드 절로 거른 뒤, 검증을 통과한 값만으로 계산하는 흐름을 이해한다.',
    adaptIdeas: ['직업에 Archer 를 더해 기본 체력을 셋으로 나누고 싶다.', '시작 골드 입력을 하나 더 받아 TryParse 와 범위로 거르고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 04장 5절 캐릭터 생성 코드를 그대로 옮기고 (4.4 가드 절이 그 안에 있다), 8절의 "TryParse 반환값을 버림" 을 효과 끄기로 이었다.',
  lecture: [{ title: '04. 콘솔 입출력', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/04_console_input_output/' }],
  references: [
    { label: 'Microsoft Learn: Int32.TryParse 메서드', url: 'https://learn.microsoft.com/ko-kr/dotnet/api/system.int32.tryparse' },
    { label: 'Microsoft Learn: return 문 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/statements/jump-statements#the-return-statement' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/04_console_input_output/', title: '교안: 04. 콘솔 입출력', why: '이 표본의 원본 교안. 4.4 가드 절, 5절 활용 예시, 8절 주의사항' },
    { id: 'console-tryparse', why: '같은 장 3.3 · 4.3. TryParse 의 반환값(bool)과 out 변수를 먼저 본다' },
    { id: 'console-normalize', why: '같은 장 3.5. Trim() → ToUpper() 정규화를 한 줄씩 본다' },
  ],
}
