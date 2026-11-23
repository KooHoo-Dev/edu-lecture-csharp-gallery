import { bullets, codeSection, numbered, promptDoc, richToMarkdown, valueTable, type AiConfig, type CodeFile, type ParamValues } from '@koohoo/gallery-kit'
import { applyParamValues, type CsSpecimen } from './stage/types'

/* AI 지시 세트와 Skill. 프롬프트는 특정 AI 도구에 묶지 않는 평범한 Markdown 이다.
 * C# 기초 갤러리의 독자는 수강생이라, '넣기'보다 '이해하기'(설명, 예측 문제, 내 코드 점검, Unity 로 옮기기)가 중심이다. */

const ENVIRONMENT = ['- C# 9 (Unity 6.3 LTS 와 같은 언어 버전)', '- 콘솔 프로그램으로 실행한다 (Unity 에서는 `Debug.Log` 로 바꿔 본다)'].join('\n')

export const FIXED_RULES = [
  '- C# 9 까지만 쓴다. 파일 범위 `namespace X;`, `record struct`, 전역 using 같은 C# 10 이상 문법은 쓰지 않는다 (Unity 6.3).',
  '- 초보자 눈높이로 설명한다. 용어는 값 타입, 참조 타입, 스택, 힙, 메서드, 매개변수, 인자로 통일한다.',
  '- 메모리 이야기는 "스택의 상자"와 "힙의 객체를 가리키는 화살표" 그림으로 설명한다.',
  '- `// [1]` 같은 줄 끝 표시는 웹 갤러리의 단계 보기 표시, `// @param` 은 입력값 표시다. 코드 동작과 상관없다.',
  '- `#if GALLERY_MISTAKE` 구역은 흔한 실수를 재현한 나쁜 예다. 평소에는 꺼져 있다.',
].join('\n')

/** 원본 코드 (Main 이 있는 파일 먼저) */
export const sourceFiles = (s: CsSpecimen): CodeFile[] => s.files

/** 지금 입력값을 코드의 // @param 선언에 넣은 파일 (무대와 같은 실행) */
export const filesWithValues = (s: CsSpecimen, values: ParamValues): CodeFile[] => sourceFiles(s).map(f => ({ ...f, code: applyParamValues(f.code, s.meta.params, values) }))

const inputs = (s: CsSpecimen, values: ParamValues) => (s.meta.params.length ? valueTable(s.meta.params, values, ['변수', '뜻', '값']) : '(입력값 없음)')

const defaults = (s: CsSpecimen): ParamValues => Object.fromEntries(s.meta.params.map(p => [p.key, p.default]))

const stepList = (s: CsSpecimen) => s.meta.steps.map(st => `${st.n}. **${st.label}** (\`// [${st.n}]\` 줄): ${richToMarkdown(st.body)}`).join('\n')

export const ai: AiConfig<CsSpecimen> = {
  intro: '이 세트는 지금 입력값을 코드에 넣은 상태로 담습니다. 위에서 입력값을 바꾼 뒤 복사하세요.',
  prompts: [
    {
      id: 'explain',
      name: '설명해 줘',
      desc: '한 줄씩 실행하며 변수와 메모리가 어떻게 바뀌는지 설명을 듣는다',
      build: (s, values) =>
        promptDoc(`C# 설명: ${s.meta.title}`, `아래 C# 프로그램을 한 줄씩 실행한다고 생각하고, 줄마다 변수와 메모리(스택, 힙)가 어떻게 바뀌는지 설명해 줘. 주제: ${s.meta.concept}.`, [
          ['환경', ENVIRONMENT],
          ['내가 알고 싶은 것', bullets(s.meta.goals.map(richToMarkdown))],
          ['설명 순서', numbered(['`Main` 첫 줄부터 차례대로 따라간다.', '`// [n]` 표시 줄에서는 그 줄이 메모리에 무엇을 했는지 그림(상자와 화살표)으로 보여 준다.', '콘솔에 찍히는 값을 실행 전에 먼저 맞혀 보게 질문하고, 그다음 답을 알려 준다.', '마지막에 핵심을 세 줄로 정리한다.'])],
          ['단계 표시', stepList(s)],
          ['지킬 것', FIXED_RULES],
          ['입력값', inputs(s, values)],
          ['코드', codeSection(filesWithValues(s, values))],
        ]),
    },
    {
      id: 'practice',
      name: '예측 문제 만들기',
      desc: '같은 개념으로 실행 결과를 맞히는 연습 문제를 받는다',
      build: (s, values) =>
        promptDoc(`C# 연습 문제: ${s.meta.title}`, `아래 코드와 같은 개념(${s.meta.concept})으로 '실행 결과 맞히기' 문제 3개를 만들어 줘.`, [
          ['환경', ENVIRONMENT],
          [
            '문제 규칙',
            bullets([
              '문제마다 20줄 이내의 완전한 콘솔 프로그램, 보기 4개, 정답, 해설을 쓴다.',
              '해설은 스택과 힙 그림(상자와 화살표)으로 한다.',
              '쉬운 것부터 어려운 것 순서로 낸다. 마지막 문제는 아래 흔한 실수를 일부러 넣는다.',
              '정답과 해설은 문제를 모두 낸 뒤 맨 아래에 모아 둔다.',
            ]),
          ],
          ['흔한 실수', bullets(s.meta.mistakes.map(m => `${m.title}: ${richToMarkdown(m.body)}`))],
          ['지킬 것', FIXED_RULES],
          ['기준 코드', codeSection(filesWithValues(s, values))],
        ]),
    },
    {
      id: 'check',
      name: '내 코드 점검',
      desc: '내 코드에 이 표본의 흔한 실수가 있는지 봐 달라고 맡긴다',
      build: (s, values) =>
        promptDoc(`C# 코드 점검: ${s.meta.concept}`, `내 코드에 '${s.meta.concept}' 과 관련된 실수가 있는지 봐 줘.`, [
          ['환경', `${ENVIRONMENT}\n- 내 코드가 하려는 일: [여기에 적는다]`],
          ['내 코드', '```csharp\n[여기에 붙인다]\n```'],
          ['특히 볼 것', bullets([...s.meta.mistakes.map(m => `${m.title}: ${richToMarkdown(m.body)}`), richToMarkdown(s.meta.offNote)])],
          ['점검 규칙', bullets(['문제가 있는 줄을 줄 번호와 함께 짚고, 왜 문제인지 메모리 그림으로 설명한다.', '고친 코드는 바꾼 부분만이 아니라 메서드 전체를 보여 준다.', '문제가 없으면 없다고 말한다. 억지로 찾지 않는다.'])],
          ['지킬 것', FIXED_RULES],
          ['참고: 올바른 예', codeSection(filesWithValues(s, values))],
        ]),
    },
    {
      id: 'unity',
      name: 'Unity 로 옮기기',
      desc: '같은 개념이 Unity 스크립트에서 어떻게 나타나는지 본다',
      build: (s, values) =>
        promptDoc(`Unity 에서 보기: ${s.meta.title}`, `아래 콘솔 프로그램의 개념(${s.meta.concept})을 Unity 6.3 의 MonoBehaviour 예시로 옮겨 줘.`, [
          ['환경', '- Unity 6.3 LTS (6000.3), C# 9\n- 새 Input System (입력이 필요하면)'],
          ['할 일', numbered([...s.meta.unity.setup.map(richToMarkdown), `확인: ${richToMarkdown(s.meta.unity.verify)}`])],
          ['주의할 점', bullets(s.meta.unity.pitfalls.map(richToMarkdown))],
          ['옮기는 규칙', bullets(['`Console.WriteLine` 은 `Debug.Log` 로 바꾼다.', '`Main` 의 내용은 `Start()` 로 옮긴다.', 'Unity 에서 같은 개념이 나오는 곳(`Vector3`, `Transform`, `GameObject` 등)을 예로 든다.', '파일 맨 위에 무엇을 하는지 한국어 주석을 둔다.'])],
          ['지킬 것', FIXED_RULES],
          ['입력값', inputs(s, values)],
          ['콘솔 원본', codeSection(filesWithValues(s, values))],
        ]),
    },
  ],
  files: (s, values) => filesWithValues(s, values),
  codeNote: s => `콘솔 프로그램입니다. dotnet 으로 그대로 실행하거나, Unity 에서는 Assets/CSharpGallery/${s.meta.id}/ 에 넣고 Main 의 내용을 Start() 로 옮겨 봅니다.`,
  sheet: { tab: '입력값', markdown: inputs },
  images: {
    title: '무대 화면',
    list: s => [
      ...(s.shots.default ? [{ name: 'default', label: '기본값', url: s.shots.default }] : []),
      ...(s.meta.captures ?? []).filter(c => s.shots[c.name]).map(c => ({ name: c.name, label: c.label, url: s.shots[c.name] })),
    ],
    note: '무대는 이 코드를 실제로 실행한 기록을 재생한 것이다. 메모리 그림은 그 실행에서 변수와 객체를 읽은 값이다.',
    liveLabel: '현재 무대 복사',
  },
  skill: {
    name: 'csharp-for-unity',
    description: all =>
      `C# 기초 개념(값 타입과 참조 타입, 스택과 힙, 매개변수, 컬렉션 등)을 Unity 입문자에게 설명하거나, 그 개념의 흔한 실수를 찾을 때 쓴다. 개념마다 실제로 실행해 검증한 짧은 C# 9 프로그램, 단계 설명, 흔한 실수, Unity 에서 나타나는 모습이 들어 있다. 다루는 개념: ${[...new Set(all.map(s => s.meta.concept))].join(', ')}.`,
    compatibility: 'C# 9, Unity 6.3 LTS (6000.3)',
    title: 'C# for Unity',
    intro: '사용자가 C# 기초 개념을 묻거나 그 개념과 관련된 버그를 겪으면 아래 목록에서 가장 가까운 표본을 고르고, 그 표본의 `references/<id>/guide.md` 만 읽는다. 다른 표본의 자료는 읽지 않는다.',
    kindOf: s => s.meta.concept,
    steps: [
      '`references/<id>/guide.md` 를 읽는다.',
      '같은 폴더의 `.cs` 를 예시로 삼아, 사용자의 코드나 질문에 맞게 줄 단위로 설명한다.',
      '메모리 이야기는 스택의 상자와 힙 객체를 가리키는 화살표로 그린다.',
      'guide 의 흔한 실수 목록으로 사용자의 코드를 점검한다.',
    ],
    rules: FIXED_RULES,
    notes: ['예시 코드는 실제로 실행해 기록을 남긴 것이다. 출력값을 바꿔 말하지 않는다.', '표에 없는 개념은 가장 비슷한 표본의 설명 방식(단계, 흔한 실수, Unity 에서는)을 틀로 삼는다.'],
    guide: s => {
      const m = s.meta
      const list = (lines: string[]) => lines.map(line => `- ${line}`).join('\n')
      return (
        [
          `# ${m.title} (${m.titleEn})`,
          m.oneLiner,
          `개념: ${m.concept}. 난이도 ${m.difficulty}/3. 주제: ${m.tags.join(', ')}.`,
          `## 배울 것\n${list(m.goals.map(richToMarkdown))}`,
          `## 단계\n${stepList(s)}`,
          `## 흔한 실수 (효과 끄기)\n${richToMarkdown(m.offNote)}`,
          `## 흔한 실수 목록\n${list(m.mistakes.map(x => `**${x.title}**: ${richToMarkdown(x.body)}`))}`,
          `## Unity 에서는\n${numbered(m.unity.setup.map(richToMarkdown))}\n\n확인: ${richToMarkdown(m.unity.verify)}\n\n${list(m.unity.pitfalls.map(richToMarkdown))}`,
          `## 기본 입력값\n${inputs(s, defaults(s))}`,
          `## 교안\n${list(m.lecture.map(l => `[${l.title}](${l.url})`))}`,
        ].join('\n\n') + '\n'
      )
    },
    files: async s => sourceFiles(s).map(f => ({ name: f.name, content: f.code })),
  },
}
