# 사본을 넘기나 변수를 넘기나: 값 전달과 ref (Pass by Value vs ref)

보통 매개변수는 값의 사본이라 메서드가 고쳐도 원본이 그대로이고, `ref` 로 넘기면 메서드가 부른 쪽 변수 자체를 고친다

개념: 값에 의한 전달과 ref. 난이도 1/3. 주제: 매개변수, ref, out, 값 복사, 메서드.

## 배울 것
- `Heal(playerHp, …)` 안에서 health 를 바꿔도 playerHp 가 그대로인 이유를 프레임 두 개의 따로 된 상자로 설명할 수 있다.
- `ref` 매개변수는 값을 따로 갖지 않고 부른 쪽 변수를 가리킨다는 것을 점선 화살표로 볼 수 있다.
- `ref` 는 선언과 호출 양쪽에 붙여야 하고, 호출 전에 변수가 초기화되어 있어야 한다는 것을 안다.
- 결과를 받을 그릇만 넘길 때는 `out` 을 쓴다는 것을 `ref` 와 비교해 말할 수 있다.

## 단계
1. **값으로 넘기기** (`// [1]` 줄): `Heal(playerHp, healAmount)` 를 부른 직후다. 스택에 Heal 프레임이 쌓였고, 매개변수 health 에는 playerHp 의 값 60 이 **복사**되어 들어 있다. 두 상자는 남남이다.
2. **사본만 바뀐다** (`// [2]` 줄): `health += amount` 를 실행한 직후다. Heal 프레임의 health 만 90 이 되었고 Main 의 playerHp 는 60 그대로다. 그래서 콘솔에 `Heal 뒤: playerHp = 60` 이 찍힌다.
3. **ref 로 넘기면** (`// [3]` 줄): `ref playerHp` 로 넘긴 HealRef 에서 `health += amount` 를 실행한 직후다. health 칸은 값을 따로 갖지 않고 초록 점선 화살표로 Main 의 playerHp 를 가리킨다. 그래서 playerHp 가 바로 90 이 되었고, 돌아온 뒤에도 `HealRef 뒤: playerHp = 90` 이 찍힌다.

## 흔한 실수 (효과 끄기)
흔한 실수: 원본을 바꾸려고 HealRef 를 만들었는데 선언과 호출에서 `ref` 를 빼먹었다. health 는 다시 사본이라 점선 화살표가 없고, HealRef 안에서 health 가 90 이 되어도 playerHp 는 60 이다. 콘솔에 `HealRef 뒤: playerHp = 60` 이 찍힌다.

## 흔한 실수 목록
- **메서드에서 체력을 올렸는데 원본이 그대로다**: 값 타입 매개변수는 부른 쪽 값의 사본이다. 원본을 바꾸려면 `ref` 로 넘기거나, 결과를 `return` 으로 돌려받아 `playerHp = Heal(playerHp, 30);` 처럼 다시 넣는다.
- **`ref` 를 선언에만 붙였더니 컴파일되지 않는다**: `ref` 는 메서드 선언과 호출 양쪽에 붙인다: `HealRef(ref playerHp, 30)`. 호출에서 빼먹으면 CS1620, 선언에서 빼먹으면 CS1615 오류가 난다.
- **초기화하지 않은 변수를 `ref` 로 넘겼더니 오류다**: `ref` 는 이미 있는 값을 읽고 쓰는 통로라 호출 전에 값이 있어야 한다 (CS0165). 결과만 받을 그릇이면 `out` 을 쓴다. `int.TryParse(text, out int hp)` 가 그 예다.
- **`out` 매개변수에 값을 넣지 않았더니 컴파일되지 않는다**: `out` 은 메서드가 끝나기 전에 반드시 값을 채워야 한다 (CS0177). 실패하는 갈래에서도 `hp = 0;` 처럼 넣는다.

## Unity 에서는
1. `PassByValueRef.cs` 를 `Assets/CSharpGallery/pass-by-value-ref/` 에 넣는다.
2. MonoBehaviour 에 `public int health = 60;` 을 두고, `Start()` 에서 `Heal(health, 30)` 과 `HealRef(ref health, 30)` 같은 메서드를 차례로 불러 `Debug.Log` 로 찍는다.
3. 같은 실험을 `Vector3` 로 해 본다: `void Push(Vector3 pos) { pos.x += 1f; }` 는 원본 위치를 바꾸지 못한다.

확인: `Heal(health, 30)` 뒤에는 health 가 60 그대로이고, `HealRef(ref health, 30)` 뒤에는 Console 과 인스펙터 모두 90 이 된다.

- Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.
- `Vector3`, `Quaternion`, `Color` 는 값 타입이라 매개변수로 넘기면 사본이다. 메서드에서 `.x` 를 바꿔도 오브젝트는 움직이지 않는다.
- `transform.position` 같은 속성은 `ref` 로 넘길 수 없다 (CS0206). 지역 변수에 꺼내 넘긴 뒤 다시 넣는다.

## 기본 입력값
| 변수 | 뜻 | 값 |
|---|---|---|
| `healAmount` | 회복량 | 30 |

## 교안
- [11. 참조](https://krkoohoo.github.io/01-csharp-basic/part1-basics/11_reference/)
- [10. 메서드](https://krkoohoo.github.io/01-csharp-basic/part1-basics/10_method/)
