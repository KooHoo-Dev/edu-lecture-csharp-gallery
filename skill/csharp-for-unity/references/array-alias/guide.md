# 배열 대입은 주소 복사 (Arrays Are References)

`copy = original` 도, 메서드에 배열을 넘기는 것도 본체를 복사하지 않는다. 두 변수가 배열 하나를 함께 가리킨다

개념: 배열은 참조 타입. 난이도 1/3. 주제: 배열, 참조 타입, 대입, 매개변수, Clone.

## 배울 것
- `copy = original` 뒤 `copy[0]` 을 고치면 `original[0]` 도 바뀌는 이유를 화살표 두 개가 모인 배열 하나로 설명할 수 있다.
- 배열을 메서드에 넘기면 매개변수도 같은 본체를 가리켜, 메서드 안에서 고친 칸이 부른 쪽 배열에 남는다는 것을 프레임 두 개로 볼 수 있다.
- 내용이 따로 놀아야 하면 `new` 로 본체를 새로 만들고 값을 옮겨 담아야 한다는 것을 안다 (`new` 만 하면 빈 칸이다).

## 단계
1. **배열 대입** (`// [1]` 줄): `copy = original` 을 실행한 직후다. 힙의 배열은 하나 그대로이고, **주소만 복사**되어 original 과 copy 의 화살표가 같은 배열로 모였다. 입력값에서 `Clone()` 을 고르면 힙에 배열이 둘이 된다.
2. **한쪽 칸 고치기** (`// [2]` 줄): `copy[0] = 999` 는 둘이 함께 가리키는 배열의 0번 칸을 고쳤다. 그래서 다음 줄은 `original[0] = 999` 를 찍는다. 대입(`=`)은 복사가 아니다.
3. **메서드에 넘기기** (`// [3]` 줄): `Clamped(enemyHealths)` 를 부른 직후다. 스택에 Clamped 프레임이 새로 쌓였고, 매개변수 healths 에는 **주소가 복사**되어 Main 의 enemyHealths 와 같은 배열을 가리킨다.
4. **돌려받기** (`// [4]` 줄): `return result` 로 돌아온 직후다. Clamped 프레임이 걷히고 clamped 가 메서드 안에서 `new` 로 만든 새 배열을 가리킨다. enemyHealths 의 -12, -5 는 그대로라 보정 전과 후가 다르게 찍힌다.

## 흔한 실수 (효과 끄기)
흔한 실수: 메서드 안에서 `int[] result = healths;` 로 받은 배열을 그대로 결과로 썼다. healths 는 부른 쪽 배열의 주소라 for 문이 enemyHealths 의 칸을 직접 0 으로 바꾼다. 힙에 체력 배열이 하나뿐이고 enemyHealths, healths, result, clamped 의 화살표가 모두 그 배열로 모인다. 콘솔의 보정 전과 후가 똑같이 `[40, 0, 90, 0]` 이다.

## 흔한 실수 목록
- **배열을 대입하고 한쪽만 고친 줄 알았다**: 배열 변수에는 본체의 주소가 들어 있어 `=` 는 주소만 복사한다. 내용을 따로 두려면 `(int[])original.Clone()` 이나 `Array.Copy` 로 본체를 복사한다.
- **메서드에 넘긴 배열이 바뀌어 돌아왔다**: 매개변수도 주소를 받는다. 메서드 안에서 인덱스로 칸을 고치면 부른 쪽 배열이 바뀐다. 원본을 남겨야 하면 메서드 안에서 새 배열을 만들어 결과를 담거나, 복사본을 만들어 넘긴다.
- **`new int[n]` 으로 복사했다고 생각했다**: `new` 는 같은 크기의 **빈** 본체(모두 0)를 만들 뿐이다. 내용은 `for` 나 `Array.Copy` 로 옮겨 담아야 한다.
- **`for (int i = 0; i <= arr.Length; i++)`**: 마지막 바퀴에서 `arr[Length]` 에 손대 `IndexOutOfRangeException` 이 난다. 조건은 항상 `i < arr.Length` 다.

## Unity 에서는
1. `ArrayAlias.cs` 를 `Assets/CSharpGallery/array-alias/` 에 넣는다.
2. MonoBehaviour 에 `[SerializeField] private int[] enemyHealths;` 를 두고 인스펙터에서 40, -12, 90, -5 를 채운다.
3. `Start()` 에서 `CSharpGallery.ArrayAlias.Program` 의 `Clamped` 와 같은 메서드를 불러, 보정 전·후를 `Debug.Log(string.Join(", ", ...))` 로 찍는다. Play 중 인스펙터의 enemyHealths 가 바뀌는지도 본다.

확인: 올바른 Clamped 는 인스펙터의 enemyHealths 를 그대로 두고, `result = healths` 로 쓰면 Play 하자마자 인스펙터의 -12, -5 가 0 으로 바뀐다.

- Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.
- `mesh.vertices` 처럼 배열을 돌려주는 Unity 속성은 부를 때마다 **새 사본**을 준다. `mesh.vertices[0] = ...` 은 사본만 고친다. 꺼내서 고친 뒤 `mesh.vertices = verts;` 로 다시 넣는다.
- 인스펙터에 노출한 배열을 스크립트에서 고치면 Play 중에는 인스펙터 값도 바뀐다 (같은 배열이다).

## 기본 입력값
| 변수 | 뜻 | 값 |
|---|---|---|
| `copyHow` | copy 를 만드는 방법 | = original (주소 복사) |

## 교안
- [08. 배열](https://krkoohoo.github.io/01-csharp-basic/part1-basics/08_array/)
- [04. 반복문 퀴즈 (A6 해설)](https://krkoohoo.github.io/01-csharp-basic/part6-projects/04_quiz_loop/)
