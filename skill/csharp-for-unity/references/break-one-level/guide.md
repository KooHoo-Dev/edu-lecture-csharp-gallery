# break 는 한 겹만 끝낸다 (break Exits One Loop)

두 겹 for 에서 `break` 는 안쪽 반복문 하나만 끝낸다. 찾자마자 두 겹을 한 번에 나오려면 메서드로 빼고 `return` 한다

개념: break 와 return. 난이도 1/3. 주제: break, return, 중첩 반복문, 흐름 제어.

## 배울 것
- `break` 가 가장 가까운 반복문 하나만 끝내고, 바깥 반복문은 다음 바퀴로 간다는 것을 실행 줄의 움직임으로 볼 수 있다.
- `return` 은 반복문이 몇 겹이든 메서드를 통째로 끝내고 부른 쪽으로 돌아간다는 것을 프레임이 걷히는 모습으로 설명할 수 있다.
- 중첩 반복문에서 "찾으면 멈춘다" 는 코드를 찾기 메서드 + `return` 으로 쓸 수 있다.

## 단계
1. **찾기 메서드 부르기** (`// [1]` 줄): `FindFirstSlime(map)` 을 부른 직후다. 스택에 FindFirstSlime 프레임이 새로 쌓였고, 매개변수 map 은 Main 의 map 과 같은 배열을 가리킨다. 이제 y(줄)와 x(칸) 두 겹 for 로 방을 하나씩 살핀다.
2. **첫 슬라임 발견** (`// [2]` 줄): `(1, 2)` 칸에서 슬라임을 찾아 found 에 넣은 직후다. looked 가 7 이니 방 7개를 살폈다. 다음 줄이 `슬라임 발견` 을 찍고, 그 뒤 `return found` 가 안쪽 for, 바깥 for, 메서드를 한 번에 끝낸다.
3. **돌아와서 찍기** (`// [3]` 줄): 돌아와 `첫 슬라임: (1, 2)` 를 찍은 직후다. FindFirstSlime 프레임이 걷혔고 Main 의 first 에 `"(1, 2)"` 가 들어 있다. 아랫줄의 두 번째 슬라임은 살피지도 않았다.

## 흔한 실수 (효과 끄기)
흔한 실수: 찾은 자리에서 `return` 대신 `break` 를 썼다. `break` 는 안쪽 for(x) 만 끝내서 바깥 for(y) 가 다음 줄로 넘어가 아랫줄의 슬라임을 또 찾는다. 콘솔에 `슬라임 발견` 이 두 번 찍히고, found 가 덮어써져 `첫 슬라임: (2, 0)` 이 나온다. 전사도 `(2, 0)` 칸으로 간다. 찾은 첫 슬라임은 `(1, 2)` 인데 마지막으로 찾은 것을 돌려준 것이다.

## 흔한 실수 목록
- **`break` 를 했는데 바깥 반복문이 계속 돈다**: `break` 는 가장 가까운 반복문 **하나**만 끝낸다. 두 겹을 한 번에 나오려면 찾기를 메서드로 빼고 `return` 한다.
- **"첫 번째" 를 찾았는데 마지막 것이 나온다**: 안쪽 `break` 뒤에도 바깥 반복이 계속 돌아, 결과 변수를 뒤에 찾은 것으로 덮어썼다. 찾자마자 `return` 하거나, 결과가 이미 있으면 바깥 반복도 멈추게 한다.
- **`break` 를 두 번 썼는데 두 번째가 실행되지 않는다**: 첫 `break` 를 만나는 순간 그 반복문을 나가므로 바로 아래 줄은 실행되지 않는다. 바깥 반복문까지 멈추려면 `return` 이나 플래그(`bool done`)를 바깥 조건에서 검사한다.
- **`while` 안의 `continue` 뒤로 증감이 실행되지 않아 무한 루프다**: `continue` 는 이번 바퀴의 남은 줄을 건너뛴다. `while` 에서는 증감을 `continue` 보다 위에 둔다.

## Unity 에서는
1. `BreakOneLevel.cs` 를 `Assets/CSharpGallery/break-one-level/` 에 넣는다.
2. MonoBehaviour 에 `[SerializeField] private string[] map = { "....", "..S.", "S..." };` 를 두고, `Start()` 에서 `FindFirstSlime` 과 같은 메서드를 불러 `Debug.Log` 로 찍는다.
3. `return found;` 를 `break;` 로 바꿔 Play 해 보고, Console 에 찍히는 줄 수와 결과를 비교한다.

확인: Console 에 `슬라임 발견: (1, 2)` 와 `첫 슬라임: (1, 2)` 가 찍히고, `break` 로 바꾸면 `슬라임 발견` 이 두 번 찍힌 뒤 `첫 슬라임: (2, 0)` 이 나온다.

- Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.
- `Update()` 안의 `return` 은 이번 프레임의 `Update` 호출 하나만 끝낸다. 다음 프레임에 Unity 가 `Update()` 를 다시 부른다.
- 코루틴(`IEnumerator`)을 중간에 끝낼 때는 `return` 이 아니라 `yield break` 를 쓴다.

## 기본 입력값
| 변수 | 뜻 | 값 |
|---|---|---|
| `map` | 맵 | 슬라임 둘 (가운데 줄, 아랫줄) |

## 교안
- [07. 프로그램 흐름 제어](https://krkoohoo.github.io/01-csharp-basic/part1-basics/07_controlling_program_flow/)
- [06. 반복문](https://krkoohoo.github.io/01-csharp-basic/part1-basics/06_loop/)
