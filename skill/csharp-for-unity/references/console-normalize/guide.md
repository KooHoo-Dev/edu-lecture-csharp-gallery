# 입력 정규화: 비교하기 전에 모양 맞추기 (Normalizing Input Before Comparing)

교안 3.5 코드를 한 줄씩 실행하며 입력 문자열이 raw → trimmed → normalized 상자로 옮겨 가며 모양이 맞춰지는 것을 본다

개념: 04. 콘솔 입출력 · 3.5 · 8. 난이도 1/3. 주제: 입력 정규화, Trim, ToUpper, 문자열 비교, ReadLine.

## 배울 것
- `" Red "`, `"red"`, `"Red"` 가 사람 눈에는 같아도 `==` 비교에서는 다른 값이라는 것을 메모리 상자로 설명할 수 있다.
- `Trim()` 이 앞뒤 공백을, `ToUpper()` 가 대소문자를 맞춘 **새 문자열**을 돌려주고, 그래서 결과를 새 변수에 받는다는 것을 볼 수 있다.
- 정규화를 `Trim()` 부터 시작해야 하는 이유를 앞에 공백이 붙은 입력으로 설명할 수 있다.

## 단계
1. **입력 받기** (`// [1]` 줄): `string raw = Console.ReadLine();` 을 실행한 직후다. 친 글자가 **앞뒤 공백까지 그대로** raw 상자에 `" Red "` 로 들어갔다. ReadLine 은 무조건 string 을 돌려준다.
2. **그대로 비교** (`// [2]` 줄): `raw == "Red"` 를 계산한 직후다. 사람 눈에는 Red 지만 앞뒤 공백이 붙어 있어 **다른 값**이다. sameAsTyped 는 `false` 이고, 다음 줄이 콘솔에 `그대로 비교: False` 를 찍는다 (입력값 `Red` 에서만 True).
3. **Trim()** (`// [3]` 줄): `raw.Trim()` 을 실행한 직후다. 앞뒤 공백을 뗀 **새 문자열** `"Red"` 가 trimmed 상자에 들어갔다. raw 상자는 `" Red "` 그대로다 (원본을 바꾸지 않는다).
4. **ToUpper()** (`// [4]` 줄): `trimmed.ToUpper()` 를 실행한 직후다. 전부 대문자로 바꾼 새 문자열 `"RED"` 가 normalized 상자에 들어갔다. 이제 raw · trimmed · normalized 세 상자에 같은 입력의 세 모양이 나란히 있다. 다음 줄이 콘솔에 `정규화한 값: [RED]` 로 찍는다.
5. **정규화 후 비교** (`// [5]` 줄): `normalized == "RED"` 를 계산한 직후다. isRed 는 `true` 이고, 다음 줄이 콘솔에 `정규화 후 비교: True` 를 찍는다. 입력값을 `red` · `Red` 로 바꿔도 normalized 는 `"RED"` 가 되어 같은 판정이 나온다.

## 흔한 실수 (효과 끄기)
교안 8절의 실수 "비교 전에 `Trim()` 을 빠뜨림" 이다. 효과 끄기는 `raw.ToUpper()` 로 대문자만 맞추고 공백은 그대로 둔다. 기본 입력 `" Red "` 에서 normalized 상자가 `" RED "` 가 되어 (콘솔 `정규화한 값: [ RED ]`) `"RED"` 와 다르고, isRed 는 `false`, 콘솔에 `정규화 후 비교: False` 가 찍힌다. trimmed 상자는 생기지 않는다. 오류 한 줄 없이 조용히 빠져나간다. 입력값 `red` · `Red` 처럼 공백이 없는 입력에서는 True 로 같아 실수가 드러나지 않는다.

## 흔한 실수 목록
- **`Red` 라고 쳤는데 `==` 비교가 false 다**: 앞이나 뒤에 스페이스가 섞여 들어왔거나 대소문자가 다르다. `==` 는 글자 하나라도 다르면 다른 값이다. 비교하기 전에 `Trim()` → `ToUpper()` 로 모양을 맞춘다.
- **`raw.Trim();` 을 불렀는데 raw 의 공백이 그대로다**: `Trim()` · `ToUpper()` 는 원본을 바꾸지 않고 **새 문자열을 돌려준다**. `string trimmed = raw.Trim();` 처럼 결과를 변수에 받아서 쓴다.
- **대문자로 맞췄는데 공백이 붙은 입력이 어느 경우에도 걸리지 않는다**: 정규화를 `ToUpper()` 나 첫 글자 대문자부터 시작해 앞뒤 공백을 다루지 않았다. **정규화는 `Trim()` 부터** 시작한다.
- **`ToUpper()` 로 맞춘 뒤 `"Red"` 와 비교해서 늘 false 다**: 정규화한 값은 전부 대문자 `"RED"` 다. 비교할 글자도 같은 모양(`"RED"`)으로 쓴다.

## Unity 에서는
1. 이 표본은 교안과 같은 콘솔 프로그램(최상위 문)이다. `dotnet new console` 로 프로젝트를 만들고 Program.cs 에 원본을 붙여 넣는다.
2. `dotnet run` 으로 실행해 콘솔 출력을 무대의 콘솔 칸과 비교한다. 입력값이 있으면 무대에서 고른 입력을 그대로 친다.

확인: 콘솔 출력이 무대의 콘솔 칸과 같다.

- Unity 에서는 `Console.WriteLine` 대신 `Debug.Log` 로 찍는다. `Console.ReadLine` 은 Unity 에서 입력을 받지 못한다.
- 최상위 문(클래스와 Main 없이 쓰는 코드)은 Unity 스크립트에 그대로 넣을 수 없다. MonoBehaviour 의 `Start()` 안으로 옮긴다.

## 기본 입력값
| 변수 | 뜻 | 값 |
|---|---|---|
| `stdin` | 콘솔에 칠 색 (3번 줄 ReadLine) | " Red " (앞뒤에 공백, 교안 그대로) |

## 교안
- [04. 콘솔 입출력](https://krkoohoo.github.io/01-csharp-basic/part1-basics/04_console_input_output/)
