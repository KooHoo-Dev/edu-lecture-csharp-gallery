# TryParse: 잘못된 입력에도 죽지 않는 파싱 (Safe Parsing with TryParse)

교안 4.3 ✅ 코드를 여러 입력으로 실행하며 TryParse 가 성공 여부(bool)와 값(out)을 따로 돌려주고, 실패하면 number 가 0 이 되는 것을 본다

개념: 04. 콘솔 입출력 · 3.3 · 4.3. 난이도 1/3. 주제: int.TryParse, out, 파싱, FormatException.

## 배울 것
- `int.TryParse` 가 변환 성공 여부를 `bool` 로 돌려주고, 실제 값은 `out int number` 상자에 넣는다는 것을 메모리에서 볼 수 있다.
- 숫자가 아닌 입력이면 TryParse 가 false 를 돌려주고 number 는 0 이 되며, if/else 의 else 쪽으로 간다는 것을 설명할 수 있다.
- `int.Parse` 는 숫자가 아닌 문자열에서 FormatException 으로 프로그램을 멈추게 한다는 것을 안다.
- Parse · TryParse · Convert.ToInt32 가 실패할 때 어떻게 다른지 말할 수 있다.

## 단계
1. **입력은 string** (`// [1]` 줄): `string input = Console.ReadLine();` 을 실행한 직후다. 25 를 쳤지만 input 상자에는 **문자열 `"25"`** 가 들어갔다. 계산하려면 int 로 파싱해야 한다.
2. **TryParse** (`// [2]` 줄): `if (int.TryParse(input, out int number))` 를 실행한 직후다. TryParse 는 성공 여부를 **bool** 로 돌려주고(여기서는 true), 바꾼 값 25 는 `out` 으로 number 상자에 넣었다. 실패하면 false 를 돌려주고 number 는 **0** 이 된다 (입력값 "숫자가 아닌 입력"). 같은 일을 `int.Parse` 는 실패하면 예외로 프로그램을 멈추고, `Convert.ToInt32` 는 null 이면 0, 형식이 틀리면 예외다 (3.3).

## 흔한 실수 (효과 끄기)
교안 4.3 실수 2: `int n = int.Parse("abc");` 는 빌드는 되지만 실행 중에 멈춘다. 효과 끄기 화면은 질문과 입력까지 찍힌 뒤 7번 줄에서 **FormatException** 이 나 프로그램이 강제 종료되고, 그 뒤의 출력은 없다. 교안 그대로 친 값이 아니라 글자 `"abc"` 를 파싱하므로 무엇을 입력해도 같은 자리에서 멈춘다 (메모리에는 input 상자만 남는다). TryParse 를 쓴 보통 실행은 같은 "숫자가 아닌 입력" 에도 안내 문구를 찍고 정상으로 끝난다.

## 흔한 실수 목록
- **숫자가 아닌 입력 한 번에 프로그램이 꺼진다 (FormatException)**: `int.Parse` 는 변환에 실패하면 예외를 던진다. 사용자 입력은 항상 잘못될 수 있으므로 `int.TryParse` 로 성공 여부를 먼저 확인한다.
- **숫자가 아닌 것을 쳤는데 오류 없이 엉뚱한 결과가 나온다**: `int.TryParse` 의 반환값을 버리고 out 변수만 쓰면, 실패한 입력이 조용히 0 이 되어 계산에 흘러 들어간다. 반환값을 `if` 로 확인한다.
- **`int price = Console.ReadLine();` 에서 컴파일 오류가 난다**: `ReadLine` 은 항상 string 을 돌려준다 (파싱 누락). `int.TryParse(Console.ReadLine(), out int price)` 처럼 파싱해서 받는다.
- **3.5 를 입력했는데 "숫자가 아닙니다" 가 나온다**: `int.TryParse` 는 정수 형식만 int 로 바꾼다. 소수점이 있는 입력은 실패해 false 가 된다. 소수가 필요하면 `float.TryParse` 나 `double.TryParse` 를 쓴다.

## Unity 에서는
1. 이 표본은 교안과 같은 콘솔 프로그램(최상위 문)이다. `dotnet new console` 로 프로젝트를 만들고 Program.cs 에 원본을 붙여 넣는다.
2. `dotnet run` 으로 실행해 콘솔 출력을 무대의 콘솔 칸과 비교한다. 입력값이 있으면 무대에서 고른 입력을 그대로 친다.

확인: 콘솔 출력이 무대의 콘솔 칸과 같다.

- Unity 에서는 `Console.WriteLine` 대신 `Debug.Log` 로 찍는다. `Console.ReadLine` 은 Unity 에서 입력을 받지 못한다.
- 최상위 문(클래스와 Main 없이 쓰는 코드)은 Unity 스크립트에 그대로 넣을 수 없다. MonoBehaviour 의 `Start()` 안으로 옮긴다.

## 기본 입력값
| 변수 | 뜻 | 값 |
|---|---|---|
| `stdin` | 키보드 입력 (숫자를 입력하세요) | 25 (숫자) |

## 교안
- [04. 콘솔 입출력](https://krkoohoo.github.io/01-csharp-basic/part1-basics/04_console_input_output/)
