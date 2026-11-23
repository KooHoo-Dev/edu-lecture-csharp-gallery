# 복사인가 공유인가: 값 타입과 참조 타입 (Value Types vs Reference Types)

대입하면 struct 는 통째로 복사되고, class 는 주소만 복사되어 같은 객체를 함께 가리킨다

개념: 값 타입과 참조 타입. 난이도 1/3. 주제: struct, class, 대입, 스택, 힙.

## 배울 것
- `p2 = p1` 뒤 p2 를 고쳐도 p1 이 그대로인 이유를 스택의 두 상자로 설명할 수 있다.
- `player2 = player1` 뒤 두 변수가 힙의 객체 하나를 가리키는 것을 화살표로 볼 수 있다.
- 참조 타입에서 따로 된 객체가 필요하면 `new` 로 새로 만들어야 한다는 것을 안다.
- Unity 의 `Vector3` 는 값 타입, `GameObject` 와 컴포넌트는 참조 타입이라는 것을 연결할 수 있다.

## 단계
1. **값 타입 대입** (`// [1]` 줄): `p2 = p1` 을 실행한 직후다. p1 의 X, Y 가 **통째로 복사된** p2 상자가 스택에 따로 생겼다. 힙에는 아무것도 없다.
2. **사본 고치기** (`// [2]` 줄): `p2.X = 100` 은 p2 상자만 바꿨다. p1 과 p2 는 남남이라 p1.X 는 1 그대로다. 다음 줄이 찍는 콘솔 첫 줄에서 확인한다.
3. **참조 타입 대입** (`// [3]` 줄): `player2 = player1` 은 객체를 복사하지 않는다. **주소만 복사**되어 두 변수의 화살표가 힙의 Player 객체 하나로 모였다.
4. **한쪽에서 고치면** (`// [4]` 줄): `player2.Health = 500` 은 둘이 함께 가리키는 객체를 고쳤다. 그래서 player1.Health 도 500 이다. 입력값을 켜서 `new` 로 따로 만들면 힙에 객체가 둘 생기고 player1 은 100 그대로다.

## 흔한 실수 (효과 끄기)
흔한 실수: 위치처럼 값으로 다룰 데이터를 class 로 만들었다. 그러면 `p2 = p1` 도 주소 복사가 되어 p2 를 고치면 p1 도 바뀐다 (p1.X = 100). 힙에 Point 객체가 하나만 생기는 것을 본다.

## 흔한 실수 목록
- **복사했다고 생각했는데 원본도 바뀐다**: 참조 타입은 `=` 가 주소만 복사한다. 따로 된 객체가 필요하면 `new` 로 만들고 값을 옮긴다.
- **`transform.position.x = 5f;` 가 컴파일되지 않는다**: `position` 은 Vector3(값 타입)의 **사본**을 돌려준다. 사본을 고쳐 봐야 소용없어 컴파일러가 막는다. `var pos = transform.position; pos.x = 5f; transform.position = pos;` 처럼 고친 사본을 다시 넣는다.
- **메서드에 넘긴 struct 를 고쳤는데 그대로다**: 값 타입 매개변수는 사본이다. 고친 값을 돌려받아 다시 넣거나 `ref` 로 넘긴다.

## Unity 에서는
1. `ValueVsReference.cs` 를 `Assets/CSharpGallery/value-vs-reference/` 에 넣는다.
2. 빈 MonoBehaviour 의 `Start()` 에서 `CSharpGallery.ValueVsReference.Program` 의 내용을 옮겨 실행하고, `Console.WriteLine` 을 `Debug.Log` 로 바꿔 Console 창에서 본다.
3. 같은 실험을 `Vector3`(값 타입)와 `GameObject`(참조 타입)로 해 본다.

확인: Console 에 `p1.X = 1, p2.X = 100` 과 `player1.Health = 500, player2.Health = 500` 이 찍힌다.

- Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.
- `Vector3`, `Quaternion`, `Color` 는 값 타입이다. 속성(`transform.position`)으로 꺼낸 것은 사본이다.

## 기본 입력값
| 변수 | 뜻 | 값 |
|---|---|---|
| `makeNew` | player2 를 new 로 따로 만들기 | 끔 |

## 교안
- [05. 스택 vs 힙](https://krkoohoo.github.io/01-csharp-basic/part2-memory/05_stack_vs_heap/)
- [02. 구조체](https://krkoohoo.github.io/01-csharp-basic/part2-memory/02_struct/)
