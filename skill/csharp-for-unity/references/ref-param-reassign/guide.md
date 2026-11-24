# 매개변수에 new 를 넣으면 연결이 끊긴다 (Reassigning a Reference Parameter)

객체를 넘기면 주소가 복사된다. 받은 객체의 필드를 고치면 원본이 바뀌지만, 매개변수에 `new` 로 새 객체를 넣으면 매개변수의 화살표만 옮겨 가고 원본은 그대로다

개념: 참조 타입 매개변수. 난이도 2/3. 주제: 참조 타입, 매개변수, new, 주소 복사, ref.

## 배울 것
- 객체를 메서드에 넘기면 매개변수와 부른 쪽 변수의 화살표가 힙의 객체 하나로 모인다는 것을 볼 수 있다.
- `target.Hp -= damage` 처럼 필드를 고치면 부른 쪽 객체가 바뀌는 이유를 설명할 수 있다.
- `target = new Player { … }` 는 매개변수의 화살표만 새 객체로 옮기고 부른 쪽 변수는 건드리지 못한다는 것을 안다.
- 메서드 안에서 만든 새 객체를 부른 쪽에 넘기려면 `return` 으로 돌려주거나 `ref` 로 받아야 한다는 것을 안다.

## 단계
1. **객체를 넘기기** (`// [1]` 줄): `Hit(hero, damage)` 를 부른 직후다. Hit 프레임의 target 에는 **주소가 복사**되어, Main 의 hero 와 target 의 화살표가 힙의 Player 하나로 모였다.
2. **필드를 고치면** (`// [2]` 줄): `target.Hp -= damage` 를 실행한 직후다. 둘이 함께 가리키는 객체의 Hp 가 30 이 되었다. 그래서 돌아온 뒤 `Hit 뒤: hero.Hp = 30` 이 찍힌다.
3. **되살리러 넘기기** (`// [3]` 줄): `Revive(hero)` 를 부른 직후다. 이번에도 target 과 hero 가 같은 객체를 가리킨다. 메서드 안에서 무엇을 바꾸느냐가 결과를 가른다.
4. **필드로 되살리기** (`// [4]` 줄): `target.Hp = 100` 뒤 `Revive 안: target.Hp = 100` 을 찍은 직후다. 힙의 객체는 여전히 하나이고 hero.Hp 도 100 이다. 효과 끄기를 켜고 같은 단계를 보면 객체가 둘로 갈라진다.

## 흔한 실수 (효과 끄기)
흔한 실수: 되살리려고 `target = new Player { Name = target.Name, Hp = 100 };` 처럼 매개변수에 새 객체를 넣었다. target 의 화살표만 새 객체로 옮겨 가고 hero 는 Hp 30 인 옛 객체를 그대로 가리킨다. 힙에 Player 가 둘이 되고, 콘솔은 `Revive 안: target.Hp = 100` 과 `전사 부활` 을 찍고도 `Revive 뒤: hero.Hp = 30` 을 찍는다. Revive 가 끝나면 새 객체는 아무도 가리키지 않는다.

## 흔한 실수 목록
- **메서드에서 새 객체로 바꿨는데 원본이 그대로다**: 매개변수에는 주소의 **사본**이 들어 있다. `target = new …` 는 그 사본만 바꿔 부른 쪽 변수와의 연결이 끊긴다. 원본을 고치려면 `target.Hp = 100` 처럼 필드를 고친다.
- **새 객체를 꼭 만들어야 하는데 부른 쪽에 전달이 안 된다**: `static Player Revive(Player target)` 로 새 객체를 `return` 하고 `hero = Revive(hero);` 처럼 받아 넣는다. 부른 쪽 변수 자체를 바꿔야 하면 `static void Revive(ref Player target)` 로 받고 `Revive(ref hero)` 로 넘긴다.
- **`null` 을 넘겼더니 필드를 고치는 줄에서 멈춘다**: `target` 이 `null` 이면 `target.Hp` 에서 `NullReferenceException` 이 난다. 참조 타입 매개변수는 `if (target == null) return;` 으로 먼저 거른다.
- **메서드 안에서 `target = null;` 로 지웠는데 원본이 살아 있다**: `null` 을 넣는 것도 매개변수의 화살표만 지운다. 부른 쪽 변수는 여전히 객체를 가리킨다.

## Unity 에서는
1. `RefParamReassign.cs` 를 `Assets/CSharpGallery/ref-param-reassign/` 에 넣는다.
2. MonoBehaviour 를 만들어 Hit, Revive 메서드를 옮기고, Main 의 내용을 `Start()` 에 옮긴다. `Console.WriteLine` 은 `Debug.Log` 로 바꾼다 (Player 클래스는 같은 namespace 를 `using` 해서 쓴다).
3. `void Revive(Player target)` 안을 필드 고치기와 `target = new …` 로 바꿔 가며 `Revive 뒤` 줄의 Hp 를 비교한다.

확인: Console 에 `Hit 뒤: hero.Hp = 30` 과 `Revive 뒤: hero.Hp = 100` 이 찍힌다.

- Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.
- `GameObject`, `Transform`, 컴포넌트는 참조 타입이다. 메서드에서 `enemy.GetComponent<Enemy>().TakeDamage(10)` 처럼 고치면 원본에 반영되지만, 매개변수에 `Instantiate(...)` 결과를 넣어도 부른 쪽 변수는 바뀌지 않는다.
- MonoBehaviour 는 `new` 로 만들지 않는다. `AddComponent<T>()` 나 `Instantiate` 를 쓴다.

## 기본 입력값
| 변수 | 뜻 | 값 |
|---|---|---|
| `damage` | Hit 의 피해량 | 70 |

## 교안
- [11. 참조](https://krkoohoo.github.io/01-csharp-basic/part1-basics/11_reference/)
- [10. 메서드](https://krkoohoo.github.io/01-csharp-basic/part1-basics/10_method/)
