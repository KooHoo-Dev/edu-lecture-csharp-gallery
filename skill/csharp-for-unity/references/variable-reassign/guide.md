# 재할당은 갈아 끼우기 (Reassignment Replaces the Value)

`gold = gold + reward` 는 gold 의 지금 값을 읽어 계산한 새 값으로 상자 하나의 속을 갈아 끼운다

개념: 변수와 재할당. 난이도 1/3. 주제: 변수, 초기화, 재할당, 대입 연산자.

## 배울 것
- 초기화 한 줄에서 공간(자료형) · 이름 · 값 세 자리를 짚을 수 있다.
- `gold = gold + reward` 가 오른쪽을 먼저 계산해 왼쪽에 넣는 명령이라는 것을 상자 하나의 값 변화로 설명할 수 있다.
- `gold = reward` 는 더하기가 아니라 갈아 끼우기라 이전 값이 사라진다는 것을 콘솔 출력으로 확인할 수 있다.
- 재할당할 때는 자료형을 다시 적지 않는다는 것을 안다 (다시 적으면 CS0128).

## 단계
1. **초기화** (`// [1]` 줄): `int gold = 100;` 을 실행한 직후다. 공간(`int`) · 이름(`gold`) · 값(`100`) 을 한 줄에 적어 스택에 gold 상자가 생겼다. 선언만 하고 값을 넣지 않은 변수는 읽을 수 없어서(CS0165) 처음부터 초기화한다.
2. **첫 재할당** (`// [2]` 줄): 첫 퀘스트 보상을 반영하고 콘솔에 찍은 직후다. `gold = gold + reward` 는 gold 의 지금 값 100 을 읽어 50 을 더한 **150** 을 같은 상자에 넣었다. 상자는 여전히 하나이고 100 은 사라졌다. for 는 quest 를 2 로 올려 다음 바퀴로 간다.
3. **빼기도 재할당** (`// [3]` 줄): 퀘스트 세 개를 마친 gold 250 에서 물약값 120 을 뺀 직후다. gold 는 **130** 이다. `int gold = ...` 처럼 자료형을 다시 적지 않았다. 공간은 이미 있고 바꾸는 것은 속의 값뿐이다.

## 흔한 실수 (효과 끄기)
흔한 실수: 재할당을 누적으로 착각해 `gold = reward;` 로 썼다. 지금 값을 읽지 않으니 퀘스트를 몇 개 하든 gold 는 마지막 보상 50 하나로 갈아 끼워진다. 콘솔이 `골드 50` 을 세 번 찍고, 물약을 사면 `골드 -70` 이 된다.

## 흔한 실수 목록
- **보상을 여러 번 받았는데 골드가 늘지 않는다**: `gold = reward;` 는 더하기가 아니라 갈아 끼우기다. 이전 값에 더하려면 오른쪽에서 gold 를 읽어야 한다: `gold = gold + reward;`
- **`int gold = 50;` 을 두 번째로 쓰자 CS0128 오류가 난다**: 자료형을 다시 적으면 같은 이름의 변수를 하나 더 만들겠다는 뜻이 된다. 재할당은 이름만 적는다: `gold = 50;`
- **`int gold;` 뒤에 `Console.WriteLine(gold);` 가 CS0165 오류다**: 값을 한 번도 넣지 않은 지역 변수는 읽을 수 없다. 선언할 때 `int gold = 0;` 처럼 뜻이 통하는 시작값으로 초기화한다.
- **`playergold` 가 없다는 오류가 난다**: C# 은 대소문자를 구분한다. `playerGold` 와 `playergold` 는 다른 이름이다. 지역 변수는 camelCase 로 한 가지 표기를 지킨다.

## Unity 에서는
1. `VariableReassign.cs` 를 `Assets/CSharpGallery/variable-reassign/` 에 넣는다.
2. MonoBehaviour 에 `[SerializeField] private int gold = 100;` 과 `[SerializeField] private int reward = 50;` 을 둔다.
3. `Start()` 에서 퀘스트 세 번만큼 `gold = gold + reward;` 를 하고 `Debug.Log(gold);` 로 찍는다. Play 중 인스펙터의 gold 칸도 본다.
4. 인스펙터에서 gold 를 다른 값으로 바꾸고 다시 Play 해, 코드의 초기값 100 대신 인스펙터 값에서 시작하는지 본다.

확인: Console 에 150, 200, 250 이 차례로 찍히고, 인스펙터의 gold 칸이 250 이 된다.

- Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.
- `[SerializeField]` 필드는 인스펙터에 넣은 값이 코드의 초기값을 덮어쓴다. 코드에는 100 인데 게임에서 다른 값으로 도는 원인이 거의 이것이다.
- 필드는 값을 적지 않아도 기본값(`int` 는 0, `string` 은 null)으로 시작해 CS0165 가 나지 않는다. 대신 null 필드는 실행 중에 `NullReferenceException` 으로 터진다.

## 기본 입력값
| 변수 | 뜻 | 값 |
|---|---|---|
| `reward` | 퀘스트 보상 골드 | 50 |
| `questCount` | 완료한 퀘스트 수 | 3개 |

## 교안
- [01. 변수](https://krkoohoo.github.io/01-csharp-basic/part1-basics/01_variable/)
