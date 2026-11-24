# 반환값은 받아야 남는다 (Return Values)

메서드를 부르면 프레임이 쌓이고, `return` 하면 값 하나만 들고 돌아오며 프레임이 걷힌다. 그 값은 변수에 받아야 남는다

개념: 메서드와 반환값. 난이도 1/3. 주제: 메서드, 반환값, return, 매개변수, 스택 프레임.

## 배울 것
- 메서드를 부르면 스택에 새 프레임이 쌓이고, 인자가 매개변수로 복사되는 것을 볼 수 있다.
- `return` 하면 프레임의 지역 변수와 매개변수가 사라지고 값 하나만 부른 자리로 돌아온다는 것을 설명할 수 있다.
- `Heal(hp, 30);` 처럼 반환값을 받지 않으면 계산한 값이 버려져 hp 가 그대로라는 것을 안다.

## 단계
1. **메서드 부르기** (`// [1]` 줄): `CalculateDamage(attack, 15)` 를 부른 직후다. 스택에 CalculateDamage 프레임이 새로 쌓였고, 인자 50 과 15 가 매개변수 attackPower, monsterDefense 에 **복사**되었다. Main 에는 아직 damage 가 없다. 메서드가 값을 돌려줘야 그 값으로 damage 가 만들어진다.
2. **값 들고 돌아오기** (`// [2]` 줄): `return dmg` 로 돌아온 직후다. CalculateDamage 프레임이 통째로 걷혀 dmg, attackPower, monsterDefense 가 사라졌다. 남은 것은 돌려받은 값 35 하나이고, 그 값이 Main 의 damage 에 들어갔다.
3. **회복 계산** (`// [3]` 줄): `Heal` 안에서 `healed = currentHp + amount` 를 계산한 직후다. Heal 프레임의 healed 는 95 지만 Main 의 hp 는 아직 65 다. 메서드 안의 값은 돌려주기 전까지 바깥에서 보이지 않는다.
4. **돌려받아 넣기** (`// [4]` 줄): `return healed` 로 돌아온 직후다. Heal 프레임이 걷히고 돌려받은 95 가 `hp = Heal(hp, 30)` 의 `=` 로 hp 에 들어갔다. 다음 줄이 `포션 사용 후 체력: 95` 를 찍는다.

## 흔한 실수 (효과 끄기)
흔한 실수: `Heal(hp, 30);` 으로 반환값을 받지 않았다. Heal 프레임 안에서 healed 는 95 가 되지만, 돌아온 값을 담을 자리가 없어 프레임과 함께 사라진다. hp 는 65 그대로라 콘솔에 `포션 사용 후 체력: 65` 가 찍힌다. 컴파일 오류도 경고도 나지 않는다.

## 흔한 실수 목록
- **회복 메서드를 불렀는데 체력이 그대로다**: `Heal(hp, 30);` 은 계산만 하고 결과를 버린다. 반환값이 있는 메서드는 `hp = Heal(hp, 30);` 처럼 받아서 쓴다. 매개변수 currentHp 는 hp 의 사본이라, 메서드 안에서 고쳐도 hp 는 바뀌지 않는다.
- **`int` 메서드인데 "not all code paths return a value" (CS0161) 가 난다**: 반환 타입이 있는 메서드는 모든 경로에서 `return 값;` 을 해야 한다. `if` 안에서만 return 하고 끝에 return 이 없으면 컴파일되지 않는다.
- **`void` 메서드에서 `return msg;` 가 컴파일되지 않는다**: `void` 는 돌려줄 값이 없다는 뜻이다. 값을 돌려주려면 반환 타입을 `string` 등으로 바꾸고, 일찍 끝내기만 하려면 빈 `return;` 을 쓴다.
- **메서드 안에서 만든 변수를 Main 에서 쓰려니 이름이 없다고 한다**: 지역 변수(dmg, healed)는 그 메서드의 프레임에만 있고, return 하면 프레임과 함께 사라진다. 바깥에서 필요한 값은 `return` 으로 돌려받는다.

## Unity 에서는
1. `ReturnValue.cs` 를 `Assets/CSharpGallery/return-value/` 에 넣는다.
2. MonoBehaviour 를 만들고 `[SerializeField] private int hp = 100;` 를 둔다.
3. `CalculateDamage`, `Heal` 과 같은 메서드를 그 MonoBehaviour 에 옮기고, `Start()` 에서 `hp = hp - CalculateDamage(50, 15);` 와 `hp = Heal(hp, 30);` 을 차례로 부른다.
4. Play 하고 인스펙터의 hp 와 `Debug.Log(hp)` 를 본다.

확인: `hp = Heal(hp, 30);` 이면 인스펙터의 hp 가 95 가 되고, `Heal(hp, 30);` 만 쓰면 65 에 머문다.

- Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.
- `Start`, `Update`, `OnCollisionEnter` 도 메서드다. Unity 가 알맞은 때에 불러 주는 라이프사이클 메서드라 직접 부르지 않는다.
- `Mathf.Max(0, dmg)`, `Mathf.Min(100, healed)` 도 반환값이 있는 메서드다. `Mathf.Max(0, dmg);` 만 쓰면 dmg 는 그대로다.

## 기본 입력값
| 변수 | 뜻 | 값 |
|---|---|---|
| `attack` | 공격력 (attack) | 50 (데미지 35) |

## 교안
- [10. 메서드](https://krkoohoo.github.io/01-csharp-basic/part1-basics/10_method/)
