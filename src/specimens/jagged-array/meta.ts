import type { CsMeta } from '../../stage/types.ts'
import { EXEC_EVENTS } from '../../stage/types.ts'

export const meta: CsMeta = {
  id: 'jagged-array',
  title: '가변 배열은 배열의 배열',
  titleEn: 'Jagged Arrays',
  group: 'A',
  order: 9,
  concept: '다차원 배열과 가변 배열',
  oneLiner: '`int[][]` 의 바깥 칸은 안쪽 배열을 가리키는 참조다. `new int[3][]` 직후에는 모두 null 이고, 안쪽을 `new` 해서 넣어야 화살표가 생긴다',
  goals: [
    '`new int[3][]` 직후 바깥 배열의 세 칸이 모두 null 인 이유를 힙 그림으로 설명할 수 있다.',
    '가변 배열은 층마다 길이가 다른 안쪽 배열 여러 개, `int[,]` 는 한 덩어리라는 차이를 메모리 그림으로 비교할 수 있다.',
    '안쪽 배열을 넣지 않은 칸에 손대면 `NullReferenceException` 이 난다는 것을 알고, 안쪽 길이는 `dungeon[i].Length` 로 묻는다.',
  ],
  tags: ['가변 배열', '2차원 배열', '참조 타입', 'null', 'GetLength'],
  difficulty: 2,
  params: [
    {
      key: 'lastFloor',
      label: '3층 배열',
      type: 'select',
      default: 'new int[4]',
      options: [
        { value: 'new int[4]', label: 'new int[4] (빈 방 4개)' },
        { value: 'new int[] { 90, 300 }', label: '{ 90, 300 } (보스 층, 방 2개)' },
        { value: 'dungeon[1]', label: 'dungeon[1] (2층 배열을 같이 쓰기)' },
      ],
      hint: '안쪽 배열은 층마다 길이가 달라도 된다. dungeon[1] 을 고르면 바깥 칸 두 개의 화살표가 같은 배열로 모인다',
    },
  ],
  presets: [
    { id: 'empty', name: '빈 방 4개', values: {} },
    { id: 'boss', name: '몬스터가 있는 보스 층', values: { lastFloor: 'new int[] { 90, 300 }' } },
    { id: 'shared', name: '2층 배열 같이 쓰기', values: { lastFloor: 'dungeon[1]' } },
  ],
  events: EXEC_EVENTS,
  steps: [
    { n: 1, label: '2차원 배열', body: '`new int[2, 3]` 을 실행한 직후다. 힙에 칸 6개가 **한 덩어리**로 생겼고 모두 0 이다. 다음 줄은 `GetLength(0)` 으로 행 2, `GetLength(1)` 로 열 3 을 묻고, `Length` 는 전체 칸 수 6 이다.' },
    { n: 2, label: '바깥 배열만 만들기', body: 'PrintArenaSize 에서 돌아와 `new int[3][]` 을 실행한 직후다. 힙에 칸 3개짜리 바깥 배열이 생겼지만 칸이 **모두 null** 이다. 안쪽 배열은 아직 하나도 없다.' },
    { n: 3, label: '안쪽 배열 넣기', body: '`dungeon[0] = new int[] { 10 }` 을 실행한 직후다. 안쪽 배열이 따로 생기고 바깥 배열 0번 칸에서 화살표가 그 배열로 간다. 1번, 2번 칸은 아직 null 이다.' },
    { n: 4, label: '층마다 길이가 다르다', body: '바깥 for 를 시작한 직후다. 바깥 칸 셋이 길이 1, 3, 4 인 배열을 하나씩 가리키고, 2번 칸과 lastFloor 는 같은 배열이다. 안쪽 for 는 층마다 `dungeon[floor].Length` 만큼 돌아 1층 10, 2층 120, 3층 0 을 찍는다.' },
  ],
  offNote: '흔한 실수: 3층 배열(lastFloor)을 만들어 두고 `dungeon[2] = lastFloor;` 를 빠뜨렸다. 힙에 배열은 있지만 바깥 배열 2번 칸은 null 그대로다. 1층과 2층은 찍히고, 3층에서 `dungeon[floor].Length` 가 null 에 손대 `NullReferenceException` 으로 멈춘다.',
  mistakes: [
    { title: '`jagged[0][0] = 100;` 에서 `NullReferenceException` 이 난다', body: '`new int[3][]` 은 바깥 배열만 만든다. 안쪽 칸은 모두 null 이라 `jagged[0] = new int[5];` 처럼 안쪽 배열을 따로 만들어 넣어야 한다.' },
    { title: '2차원 배열의 `Length` 가 행 수가 아니다', body: '`int[,]` 의 `Length` 는 전체 칸 수(행 × 열)다. 행 수는 `GetLength(0)`, 열 수는 `GetLength(1)` 로 묻는다.' },
    { title: '`IndexOutOfRangeException` 이 난다', body: '행과 열을 바꿔 썼거나 범위를 넘었다. `arr[행, 열]` 순서를 지키고, 변수 이름을 `row`, `col` 로 지으면 덜 헷갈린다.' },
    { title: '한 층을 고쳤는데 다른 층도 바뀐다', body: '바깥 칸 두 개에 같은 안쪽 배열을 넣었다 (`dungeon[2] = dungeon[1]`). 안쪽 배열도 참조 타입이라 주소만 복사된다. 층마다 `new` 로 따로 만든다.' },
  ],
  unity: {
    setup: [
      '`JaggedArray.cs` 를 `Assets/CSharpGallery/jagged-array/` 에 넣는다.',
      '빈 GameObject 에 MonoBehaviour 를 붙이고 `Start()` 에서 같은 던전을 만들어, 층마다 합을 `Debug.Log` 로 찍는다.',
      '타일맵 데이터처럼 모든 줄의 길이가 같으면 `int[,]` 나 `GameObject[,]` 로 바꿔 `GetLength(0)`, `GetLength(1)` 로 돈다.',
    ],
    verify: 'Console 에 `1층: 방 1개, 몬스터 체력 합 10`, `2층: 방 3개, 몬스터 체력 합 120`, `3층: 방 4개, 몬스터 체력 합 0` 이 찍힌다.',
    pitfalls: [
      'Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.',
      '인스펙터는 `int[,]` 와 `int[][]` 를 보여 주지 않는다 (직렬화하지 않는다). 인스펙터에서 채우려면 줄 하나를 담는 `[System.Serializable]` 클래스의 배열로 만든다.',
      '그리드 게임의 로직 데이터는 보통 `int[,]` 나 `Tile[,]` 로 두고, 화면은 `Tilemap` 이 그린다.',
    ],
  },
  prompt: {
    goal: '가변 배열(int[][])의 바깥 칸이 안쪽 배열을 가리키는 참조라는 것과, 2차원 배열(int[,])과의 차이를 이해한다.',
    adaptIdeas: ['파티마다 인원이 다른 길드(파티별 캐릭터 이름 string[][])로 바꾸고 싶다.', '모든 줄의 길이가 같은 타일맵을 int[,] 로 만들어 GetLength 로 돌고 싶다.', '안쪽 배열 대신 List<List<int>> 로 층과 방을 늘였다 줄였다 하고 싶다.'],
  },
  inspiredBy: [],
  original: '교안 09장 4.2절의 학생별 과목 수 예시를 층마다 방 수가 다른 던전으로 바꾸고, 4.3절 "가변 배열의 안쪽 배열 미생성" 을 효과 끄기로, 2차원 배열의 GetLength 를 앞에 짧게 붙여 새로 썼다.',
  lecture: [
    { title: '09. 다차원 배열', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/09_multidimensional_array/' },
    { title: '08. 배열', url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/08_array/' },
  ],
  references: [
    { label: 'Microsoft Learn: 배열 (C# 참조)', url: 'https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/builtin-types/arrays' },
    { label: 'Microsoft Learn: Array.GetLength 메서드', url: 'https://learn.microsoft.com/ko-kr/dotnet/api/system.array.getlength' },
  ],
  related: [
    { url: 'https://krkoohoo.github.io/01-csharp-basic/part1-basics/09_multidimensional_array/', title: '교안: 09. 다차원 배열', why: '이 표본의 원본 교안. §3.3 둘의 차이, §4.3 흔한 실수' },
    { id: 'array-alias', why: '배열 변수가 본체의 주소를 담는다는 것을 먼저 본다. 가변 배열의 바깥 칸도 같은 주소다' },
  ],
}
