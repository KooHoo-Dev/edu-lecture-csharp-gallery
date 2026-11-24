# static 은 하나뿐 (Static Fields Are Shared)

정적 필드는 객체마다가 아니라 클래스에 하나 있어, 아이템을 몇 개 만들든 모두가 같은 번호표 칸과 개수 칸을 함께 쓴다

개념: static 필드. 난이도 1/3. 주제: static, 정적 필드, 인스턴스 필드, readonly, 생성자.

## 배울 것
- `static` 필드는 힙의 객체 안이 아니라 클래스에 하나만 있다는 것을 정적 영역의 상자로 볼 수 있다.
- 생성자가 `Id = _nextId++` 로 공용 칸에서 번호를 받아 가, 아이템마다 다른 Id 가 매겨지는 과정을 설명할 수 있다.
- `static` 을 빠뜨리면 객체마다 `_nextId` 를 따로 가져 모든 Id 가 1 이 된다는 것을 안다.
- 정적 필드는 `Item.CreatedCount` 처럼 클래스 이름으로 부른다는 것을 안다.

## 단계
1. **생성자 부르기** (`// [1]` 줄): `new Item("강철 검")` 으로 생성자를 부른 직후다. 힙에 Item 객체가 생겼지만 Id 는 아직 0 이다. 정적 영역에는 `Item._nextId = 1`, `Item.CreatedCount = 0` 이 객체와 따로 하나씩 있다.
2. **공용 칸에서 번호 받기** (`// [2]` 줄): `Id = _nextId++` 를 실행한 직후다. 검 객체의 Id 는 공용 칸에서 받은 1 이 되었고, 정적 영역의 `_nextId` 는 2 로 올라갔다. `_nextId` 는 검 객체 안에 없다.
3. **두 번째 객체** (`// [3]` 줄): 첫 물약의 생성자를 부른 직후다. 새 객체도 같은 정적 영역의 `_nextId` 를 보므로, 이어서 2 를 받아 간다. 객체는 늘어나도 정적 칸은 늘지 않는다.
4. **모두 만든 뒤** (`// [4]` 줄): 아이템을 다 만들고 첫 줄 `강철 검 번호: 1` 을 찍은 직후다. 힙의 Item 셋은 Id 가 1, 2, 3 으로 모두 다르고, 정적 영역의 `_nextId = 4`, `CreatedCount = 3` 은 여전히 하나씩이다.

## 흔한 실수 (효과 끄기)
흔한 실수: `_nextId` 에서 `static` 을 빠뜨렸다. 이제 `_nextId` 는 힙의 Item 객체마다 하나씩 들어가 저마다 1 에서 시작한다. 그래서 검과 물약의 번호가 모두 1 이고, 객체마다 `_nextId` 가 2 로 남는다. `CreatedCount` 는 여전히 static 이라 `총 생성: 3` 은 맞게 나온다. 정적 영역에서 `_nextId` 칸이 사라진 것을 본다.

## 흔한 실수 목록
- **아이템을 여러 개 만들었는데 Id 가 전부 1 이다**: 번호를 세는 `_nextId` 가 인스턴스 필드라 객체마다 1 부터 따로 센다. 모든 객체가 함께 써야 하는 값에는 `static` 을 붙인다.
- **몬스터 한 마리를 때렸는데 모든 몬스터 체력이 깎인다**: 반대 실수다. `Health` 를 `static` 으로 두면 클래스에 하나뿐이라 모든 몬스터가 같은 체력을 나눠 쓴다. 객체마다 달라야 하는 값은 static 을 붙이지 않는다.
- **`static` 메서드에서 `this.Health` 가 컴파일되지 않는다**: 정적 메서드는 어떤 객체에도 속하지 않은 채 불리므로 `this` 가 없다. 객체의 필드가 필요하면 인스턴스 메서드로 만든다.
- **`sword.CreatedCount` 로 부르니 컴파일 오류가 난다**: 정적 멤버는 객체가 아니라 클래스 이름으로 부른다. `Item.CreatedCount` 로 쓴다 (CS0176).

## Unity 에서는
1. `StaticSharedCounter.cs` 를 `Assets/CSharpGallery/static-shared-counter/` 에 넣는다.
2. MonoBehaviour 를 만들고 `Start()` 에서 `new CSharpGallery.StaticSharedCounter.Item("강철 검")` 과 물약 두 개를 만든다.
3. 각 아이템의 Id 와 `Item.CreatedCount` 를 `Debug.Log` 로 찍는다.
4. Play 를 멈췄다가 다시 눌러 번호가 1 부터 다시 시작하는지 본다.

확인: Console 에 번호 1, 2, 3 과 `총 생성: 3` 이 찍힌다. Play 를 다시 눌렀을 때 번호가 4 부터 이어지면 Domain Reload 가 꺼져 static 값이 남은 것이다.

- Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.
- `static` 필드는 인스펙터에 나타나지 않는다. Play 중에 보며 조정할 값은 `[SerializeField]` 인스턴스 필드로 둔다.
- Project Settings > Editor > Enter Play Mode Settings 에서 Domain Reload 를 끄면 Play 를 다시 눌러도 static 값이 초기화되지 않는다. 새 판을 시작할 때 직접 되돌리는 코드가 필요하다.
- `static` 필드는 씬을 바꿔도 남는다. 게임을 다시 시작할 때 이전 판의 점수나 개수가 남는 사고가 여기서 난다.

## 기본 입력값
| 변수 | 뜻 | 값 |
|---|---|---|
| `potionCount` | 만들 물약 수 (potionCount) | 2개 |

## 교안
- [12. 스코프·정적·상수](https://krkoohoo.github.io/01-csharp-basic/part1-basics/12_scope_static_const/)
