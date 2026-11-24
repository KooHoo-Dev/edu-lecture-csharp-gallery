# TryParse 는 반환값을 확인한다 (TryParse Guard Clause)

`int.TryParse` 는 성공 여부를 bool 로 돌려주고, 실패하면 out 자리에 0 을 넣는다. 반환값을 확인하는 가드 절이 없으면 0 이 조용히 계산에 흘러간다

개념: TryParse 와 가드 절. 난이도 1/3. 주제: TryParse, 가드 절, 입력 검증, out, return.

## 배울 것
- `int.TryParse(input, out level)` 이 성공 여부(bool)와 숫자(out) 두 가지를 내놓는다는 것을 메모리의 parsed 와 level 로 볼 수 있다.
- 변환에 실패하면 level 에 미리 넣어 둔 값이 남지 않고 0 으로 덮어써진다는 것을 설명할 수 있다.
- `!parsed || level < 1 || level > 10` 가드 절 하나가 형식이 틀린 입력과 범위 밖 입력을 함께 거른다는 것을 안다.

## 단계
1. **실패에 대비한 값?** (`// [1]` 줄): `int level = 1;` 을 실행한 직후다. 변환에 실패하면 이 1 이 남을 것 같지만, 다음 줄에서 확인한다. input 은 숫자처럼 보여도 언제나 string 이다.
2. **TryParse 의 두 결과** (`// [2]` 줄): `int.TryParse(input, out level)` 을 실행한 직후다. "abc" 는 숫자가 아니라 parsed 가 **false** 이고, level 은 1 이 아니라 **0** 으로 덮어써졌다. 입력값을 "7" 로 바꾸면 parsed 는 true, level 은 7 이다.

## 흔한 실수 (효과 끄기)
흔한 실수: TryParse 의 반환값 parsed 를 확인하지 않고 지나갔다 (가드 절이 없다). "abc" 가 오류 한 줄 없이 level 0 이 되어 계산이 이어지고, 콘솔에 `전사 Lv.0 생성, 시작 체력 120` 이 찍힌다. "999" 를 고르면 `전사 Lv.999 생성, 시작 체력 10110` 이다.

## 흔한 실수 목록
- **글자를 쳤는데 오류 없이 레벨 0 캐릭터가 만들어진다**: `int.TryParse(input, out level);` 처럼 반환값을 버리면, 실패한 입력이 조용히 0 이 되어 계산에 흘러간다. `if (!int.TryParse(input, out level)) { 안내; return; }` 로 반환값을 확인한다.
- **실패하면 미리 넣어 둔 기본값이 남을 줄 알았다**: TryParse 는 실패해도 out 자리에 0 을 넣는다. 기본값을 쓰려면 반환값이 false 일 때 직접 기본값을 넣는다.
- **`int.Parse(input)` 에서 프로그램이 멈춘다**: `int.Parse` 는 숫자가 아닌 입력에 `FormatException` 을 던진다. 사용자 입력은 `int.TryParse` 로 받는다.
- **형식은 맞는데 999 레벨이 통과한다**: TryParse 는 숫자인지만 본다. 범위는 `level < 1 || level > 10` 처럼 같은 가드 절에서 함께 거른다.
- **`int level = Console.ReadLine();` 이 컴파일되지 않는다**: `ReadLine` 은 언제나 string 을 돌려준다. 숫자가 필요하면 파싱을 거친다 (CS0029).

## Unity 에서는
1. `TryParseGuard.cs` 를 `Assets/CSharpGallery/tryparse-guard/` 에 넣는다.
2. Hierarchy 의 + 메뉴에서 UI > Input Field - TextMeshPro 와 UI > Button - TextMeshPro 를 만든다.
3. MonoBehaviour 에 `[SerializeField] private TMP_InputField levelField;` 를 두고, 버튼의 On Click () 에 연결할 `public void OnSubmit()` 메서드를 만든다.
4. `OnSubmit()` 에서 `levelField.text` 를 input 대신 써서 이 표본의 TryParse 와 가드 절을 옮기고, `Console.WriteLine` 을 `Debug.Log` 로 바꾼다.
5. Play 해서 입력 칸에 abc, 7, 999 를 차례로 쳐 보고 Console 창을 본다.

확인: abc 와 999 는 Console 에 안내 문구만 찍히고, 7 은 `전사 Lv.7 생성, 시작 체력 190` 이 찍힌다.

- Unity 에서 `Console.WriteLine` 은 Console 창에 보이지 않는다. `Debug.Log` 를 쓴다.
- `TMP_InputField.text` 도 string 이다. 입력 칸이 UI 로 바뀌어도 TryParse 와 가드 절은 그대로 필요하다.
- Input Field 의 Content Type 을 Integer Number 로 두어도 빈 칸은 막지 못한다. 빈 문자열은 TryParse 가 false 를 돌려준다.

## 기본 입력값
| 변수 | 뜻 | 값 |
|---|---|---|
| `input` | 사용자가 친 글자 input | "abc" (숫자가 아님) |

## 교안
- [04. 콘솔 입출력](https://krkoohoo.github.io/01-csharp-basic/part1-basics/04_console_input_output/)
- [11. 참조](https://krkoohoo.github.io/01-csharp-basic/part1-basics/11_reference/)
