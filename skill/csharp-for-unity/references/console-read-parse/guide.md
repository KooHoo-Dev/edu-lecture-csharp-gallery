# 입력 → 처리 → 출력: ReadLine 과 int.Parse (Read, Parse, Print)

교안 4.2 코드를 한 줄씩 실행하며 입력이 string 상자로 들어오고, 파싱으로 int 상자가 생기고, 보간으로 다시 출력되는 것을 본다

개념: 04. 콘솔 입출력 · 3.1~3.4 · 4.2 · 4.3. 난이도 1/3. 주제: Console.ReadLine, int.Parse, 파싱, 문자열 보간, CS0029.

## 배울 것
- `Console.Write` 로 물으면 입력이 질문 바로 옆, 같은 줄에 찍힌다는 것을 콘솔 칸에서 볼 수 있다.
- `Console.ReadLine()` 은 숫자를 쳐도 무조건 `string` 을 돌려준다는 것을 메모리의 `"2000"` 상자로 설명할 수 있다.
- `int.Parse` 로 파싱해야 계산할 수 있는 int 값이 생기고, 문자열에 숫자를 `+` 하면 컴파일 오류(CS0029)가 난다는 것을 안다.
- `$"…{변수}…"` 문자열 보간으로 변수 값을 문장 안에 넣어 출력할 수 있다.

## 단계
1. **입력은 같은 줄에** (`// [1]` 줄): `string userName = Console.ReadLine();` 을 실행한 직후다. 2번 줄이 `Write` 라 줄바꿈 없이 커서가 질문 옆에 머물렀고, 친 이름이 콘솔에 **`당신의 이름은? 홍길동`** 처럼 같은 줄에 붙었다 (3.1). 메모리에 userName 상자가 생겨 `"홍길동"` 이 들어갔다.
2. **입력은 항상 string** (`// [2]` 줄): `string birthYearStr = Console.ReadLine();` 을 실행한 직후다. 숫자 2000 을 쳤지만 birthYearStr 상자에는 **문자열 `"2000"`** 이 들어갔다 (3.2). `ReadLine` 은 무엇을 치든 string 을 돌려준다. 이대로는 계산할 수 없다.
3. **형 변환 (파싱)** (`// [3]` 줄): `int birthYear = int.Parse(birthYearStr);` 를 실행한 직후다. 문자열 `"2000"` 을 읽어 **int 2000** 을 만들어 새 상자 birthYear 에 넣었다 (3.3). birthYearStr 상자는 그대로 `"2000"` 이다. 파싱은 원래 상자를 바꾸지 않고 새 값을 만든다.
4. **처리** (`// [4]` 줄): `int age = 2026 - birthYear;` 를 실행한 직후다. 이제 birthYear 가 int 라 뺄셈이 된다. 2026 - 2000 = **26** 이 age 상자에 들어갔다.
5. **문자열 보간** (`// [5]` 줄): `Console.WriteLine($"안녕하세요, {userName}님!");` 을 실행한 직후다. `$` 가 붙은 문자열의 `{userName}` 자리에 상자의 값이 들어가 **`안녕하세요, 홍길동님!`** 이 찍혔다 (3.4). `WriteLine` 이라 출력 뒤에 줄이 바뀐다.

## 흔한 실수 (효과 끄기)
교안 4.3 실수 1: `string s = Console.ReadLine();` 으로 받은 문자열에 바로 `int result = s + 5;` 를 했다. `s + 5` 는 덧셈이 아니라 문자열 이어 붙이기라 결과가 string 이고, string 은 int 변수에 넣을 수 없다. 효과 끄기 화면은 대입하는 22번 줄이 빨갛게 표시되고 콘솔에 `CS0029: Cannot implicitly convert type 'string' to 'int'` 가 찍힌다. 빌드부터 막혀 프로그램이 한 줄도 실행되지 않으므로 앞의 이름·나이 출력도 없다.

## 흔한 실수 목록
- **`int price = Console.ReadLine();` 에서 CS0029 오류가 난다**: `ReadLine` 은 항상 string 을 돌려주므로 int 변수에 바로 넣을 수 없다 (파싱 누락). `int.Parse(...)` 나 `int.TryParse(...)` 로 먼저 숫자로 바꾼다.
- **`s + 5` 가 15 가 아니라 "105" 처럼 이어 붙는다**: `+` 의 한쪽이 문자열이면 더하지 않고 글자를 이어 붙인다. 계산하려면 먼저 파싱해 int 로 만든 뒤 더한다.
- **질문과 입력이 두 줄로 벌어진다**: 질문을 `WriteLine` 으로 내보내면 출력 뒤에 커서가 다음 줄로 내려간다. 입력 직전의 질문은 `Console.Write` 로 쓴다.
- **숫자가 아닌 입력에 프로그램이 멈춘다 (FormatException)**: `int.Parse` 는 변환에 실패하면 예외를 던져 프로그램을 끝낸다. 사용자 입력은 `int.TryParse` 로 성공 여부를 확인한다.
- **`"합 : " + a + b` 가 합이 아니라 34 처럼 찍힌다**: 앞에서부터 문자열 이어 붙이기가 된다. `$"합 : {a + b}"` 처럼 보간으로 쓰면 계산할 자리가 중괄호 안으로 분명히 갈라진다.

## Unity 에서는
1. 이 표본은 교안과 같은 콘솔 프로그램(최상위 문)이다. `dotnet new console` 로 프로젝트를 만들고 Program.cs 에 원본을 붙여 넣는다.
2. `dotnet run` 으로 실행해 콘솔 출력을 무대의 콘솔 칸과 비교한다. 입력값이 있으면 무대에서 고른 입력을 그대로 친다.

확인: 콘솔 출력이 무대의 콘솔 칸과 같다.

- Unity 에서는 `Console.WriteLine` 대신 `Debug.Log` 로 찍는다. `Console.ReadLine` 은 Unity 에서 입력을 받지 못한다.
- 최상위 문(클래스와 Main 없이 쓰는 코드)은 Unity 스크립트에 그대로 넣을 수 없다. MonoBehaviour 의 `Start()` 안으로 옮긴다.

## 기본 입력값
| 변수 | 뜻 | 값 |
|---|---|---|
| `stdin` | 키보드 입력 (이름 · 출생 연도 · 숫자) | 홍길동 · 2000 · 10 (교안 예) |

## 교안
- [04. 콘솔 입출력](https://krkoohoo.github.io/01-csharp-basic/part1-basics/04_console_input_output/)
