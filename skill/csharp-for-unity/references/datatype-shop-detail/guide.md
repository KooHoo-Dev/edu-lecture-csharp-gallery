# 활용 예시: 상품 상세를 자료형으로 (Product Detail with Data Types)

교안 5절 상품 상세 코드를 한 줄씩 실행하며 long · string · int · decimal · double · bool 상자 여섯 개가 생기고 상품 상세 일곱 줄이 출력되는 것을 본다

개념: 02. 자료형 · 5 · 8. 난이도 1/3. 주제: 자료형, long, decimal, 접미사, CS0664.

## 배울 것
- 상품 정보 여섯 가지를 데이터의 성격(큰 숫자, 글자, 정수, 비율, 소수점, 참거짓)에 맞는 자료형으로 고른 이유를 말할 수 있다.
- `L` · `m` 접미사가 붙은 리터럴이 long · decimal 상자에 들어가는 것을 볼 수 있다.
- 문자열 보간 `{ }` 자리에 각 상자의 값이 들어가 출력되는 것을 콘솔과 메모리를 맞대어 확인할 수 있다.
- decimal 에 m 없이 소수를 넣으면 컴파일 오류(CS0664)로 막힌다는 것을 안다.

## 단계
1. **큰 숫자 → long** (`// [1]` 줄): `long productCode = 123456789012L;` 을 실행한 직후다. 1234억이 넘는 수는 int (약 ±21억) 에 들어가지 않아 **long** 상자에 담았다. 리터럴 끝의 `L` 이 long 이라는 표시다.
2. **비율 → decimal** (`// [2]` 줄): `decimal discountRate = 0.15m;` 을 실행한 직후다. 할인율처럼 오차가 있으면 안 되는 값은 **decimal** 에 담는다. 소수점 리터럴은 기본이 double 이라 `m` 을 붙여야 decimal 이 된다.
3. **상자 여섯 개** (`// [3]` 줄): `bool onSale = true;` 를 실행한 직후다. 메모리에 **long · string · int · decimal · double · bool** 상자 여섯 개가 모두 생겼다. 아직 출력한 것은 없다 (콘솔이 비어 있다).
4. **할인율 출력** (`// [4]` 줄): `Console.WriteLine($"할인율: {discountRate * 100}%");` 를 실행한 직후다. decimal 0.15 에 100 을 곱한 값이 `{ }` 자리에 들어가 `할인율: 15.00%` 가 찍혔다. discountRate 상자는 0.15 그대로다.

## 흔한 실수 (효과 끄기)
교안 8절의 흔한 실수 `decimal p = 100.5;` 다. 100.5 처럼 소수점이 있는 리터럴은 기본이 double 이라 decimal 상자에 그대로 넣을 수 없다. 효과 끄기 화면은 그 줄(20번)이 빨갛게 표시되고 콘솔에 `CS0664: Literal of type double cannot be implicitly converted to type 'decimal'; use an 'M' suffix …` 가 찍힌다. 프로그램이 한 줄도 실행되지 않아 위의 상품 상세 일곱 줄도 출력되지 않는다. 효과를 켜면 `100.5m` 으로 고쳐 p 상자에 100.5 가 들어가고, 덧붙인 마지막 줄이 `100.5` 를 찍는다.

## 흔한 실수 목록
- **`decimal p = 100.5;` 에서 CS0664 오류가 난다**: 소수점 리터럴은 기본이 double 이다. decimal 에 넣으려면 `100.5m` 처럼 m 을 붙인다.
- **`float x = 1.5;` 에서 오류가 난다**: 같은 이유로 float 에는 `1.5f` 처럼 f 를 붙인다.
- **`int productCode = 123456789012;` 가 컴파일되지 않는다**: int 는 약 ±21억까지만 담는다. 그보다 큰 수는 long 에 담고 리터럴 끝에 `L` 을 붙인다.
- **`5 / 2` 가 2.5 가 아니라 2 로 나온다**: 정수끼리 나누면 결과도 정수라 소수점 아래가 버려진다 (교안 8절 정수 나눗셈 함정). 소수점이 필요하면 실수형으로 계산한다.

## Unity 에서는
1. 이 표본은 교안과 같은 콘솔 프로그램(최상위 문)이다. `dotnet new console` 로 프로젝트를 만들고 Program.cs 에 원본을 붙여 넣는다.
2. `dotnet run` 으로 실행해 콘솔 출력을 무대의 콘솔 칸과 비교한다. 입력값이 있으면 무대에서 고른 입력을 그대로 친다.

확인: 콘솔 출력이 무대의 콘솔 칸과 같다.

- Unity 에서는 `Console.WriteLine` 대신 `Debug.Log` 로 찍는다. `Console.ReadLine` 은 Unity 에서 입력을 받지 못한다.
- 최상위 문(클래스와 Main 없이 쓰는 코드)은 Unity 스크립트에 그대로 넣을 수 없다. MonoBehaviour 의 `Start()` 안으로 옮긴다.

## 기본 입력값
| 변수 | 뜻 | 값 |
|---|---|---|
| `price` | price 의 값 (4번 줄) | 159000 (교안 그대로) |
| `onSale` | onSale 의 값 (7번 줄) | 켬 |

## 교안
- [02. 자료형](https://krkoohoo.github.io/01-csharp-basic/part1-basics/02_datatype/)
