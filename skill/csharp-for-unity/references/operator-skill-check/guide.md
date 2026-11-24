# 활용 예시: 스킬을 쓸 수 있는지 판정하기 (Skill Use Check)

교안 5절의 스킬 판정 코드를 한 줄씩 실행하며 비교 · 논리가 만든 bool 상자, 할당으로 깎이는 mana, 실수 나눗셈으로 환산한 manaPercent 를 본다

개념: 03. 연산자 · 5. 난이도 1/3. 주제: 연산자, 비교, 논리, 정수 나눗셈, 삼항.

## 배울 것
- 비교 연산자가 isLevelEnough · hasEnoughMana 같은 bool 상자를 만들고, `&&` · `!` 가 그것을 조합한다는 것을 볼 수 있다.
- `mana -= skillCost;` 가 mana 상자의 값을 실제로 깎는다는 것을 볼 수 있다.
- `mana / (double)maxMana` 처럼 한쪽을 실수로 만들어야 비율이 살아난다는 것을 설명할 수 있다.
- 판정을 bool 변수로 쪼개 두면 왜 못 쓰는지 메모리에서 바로 찾을 수 있다는 것을 안다.

## 단계
1. **비교** (`// [1]` 줄): `bool hasEnoughMana = mana >= skillCost;` 를 실행한 직후다. 비교 연산자 두 줄이 각각 bool 상자를 만들었다: isLevelEnough 는 `25 >= 20` 이라 **true**, hasEnoughMana 는 `80 >= 30` 이라 **true**. 숫자가 아니라 true / false 가 담긴다.
2. **논리** (`// [2]` 줄): `bool canUseSkill = isLevelEnough && hasEnoughMana && !isOnCooldown;` 을 실행한 직후다. isOnCooldown 이 false 라 `!isOnCooldown` 은 true, 셋 다 true 라 canUseSkill 은 **true** 다. 입력값에서 쿨타임 중을 켜면 여기서 false 가 된다.
3. **if 로 판정** (`// [3]` 줄): `if (canUseSkill)` 로 판정한 직후다. canUseSkill 이 true 라 ▶ 가 중괄호 안 18번 줄 `mana -= skillCost;` 로 들어갔다. 다음 칸에서 mana 상자가 80 에서 **50** 으로 깎인다 (`mana = mana - skillCost` 와 같다). false 면 else 쪽 23번 줄로 가고 mana 는 그대로다.
4. **산술** (`// [4]` 줄): `double manaPercent = mana / (double)maxMana * 100.0;` 을 실행한 직후다. 이 줄에 닿았을 때 mana 는 이미 50 이다. `(double)` 로 한쪽을 실수로 만들어 50 / 100.0 = 0.5, 여기에 100.0 을 곱해 manaPercent 에 **50** 이 들어갔다. 효과 끄기에서는 정수 나눗셈이라 0 이다.
5. **삼항** (`// [5]` 줄): `string manaState = manaPercent >= 50.0 ? "넉넉함" : "부족함";` 을 실행한 직후다. `50 >= 50.0` 이 true 라 앞쪽 값 "넉넉함" 이 manaState 에 들어갔다. 마지막 줄이 `마나 50/100 (50.0%) - 넉넉함` 을 찍는다.

## 흔한 실수 (효과 끄기)
교안 5절 본문이 짚는 실수: 28번 줄처럼 `(double)` 없이 `mana / maxMana` 로 적었다 (나머지는 30번 줄과 같다). mana 50 과 maxMana 100 이 둘 다 int 라 `50 / 100` 이 **0** 이 되고, 100.0 을 곱해도 0 이다. 메모리의 manaPercent 는 0, manaState 는 "부족함" 이고 콘솔 마지막 줄은 `마나 50/100 (0.0%) - 부족함` 이다 (보통 실행은 50.0% 넉넉함). 레벨 모자람이나 쿨타임 중이라 mana 가 80 으로 남아도 0.0% 다. 마나가 얼마 남았든 늘 0% 로 찍힌다.

## 흔한 실수 목록
- **마나가 남아 있는데 게이지가 늘 0% 로 찍힌다**: `mana / maxMana` 는 양쪽이 int 라 정수 나눗셈이다. 50 / 100 은 0 이고, 거기에 100.0 을 곱해도 0 이다. `mana / (double)maxMana` 처럼 한쪽을 실수로 만든다.
- **스킬을 못 쓰는데 이유를 모르겠다**: 조건을 `if` 한 줄에 몰아넣으면 어느 것이 false 인지 보이지 않는다. isLevelEnough · hasEnoughMana 처럼 bool 변수로 쪼개 두고 하나씩 찍어 본다.
- **`&&` 와 `||` 를 섞었더니 판정이 생각과 다르다**: `&&` 가 `||` 보다 먼저 묶인다. 묶이는 단위를 괄호로 드러낸다.
- **`mana >= skillCost;` 만 적었더니 아무 일도 없다**: 비교 연산자는 bool 을 돌려줄 뿐이다. 결과를 변수에 담거나, 출력에 넘기거나, 조건에 넣어야 쓸모가 생긴다.

## Unity 에서는
1. 이 표본은 교안과 같은 콘솔 프로그램(최상위 문)이다. `dotnet new console` 로 프로젝트를 만들고 Program.cs 에 원본을 붙여 넣는다.
2. `dotnet run` 으로 실행해 콘솔 출력을 무대의 콘솔 칸과 비교한다. 입력값이 있으면 무대에서 고른 입력을 그대로 친다.

확인: 콘솔 출력이 무대의 콘솔 칸과 같다.

- Unity 에서는 `Console.WriteLine` 대신 `Debug.Log` 로 찍는다. `Console.ReadLine` 은 Unity 에서 입력을 받지 못한다.
- 최상위 문(클래스와 Main 없이 쓰는 코드)은 Unity 스크립트에 그대로 넣을 수 없다. MonoBehaviour 의 `Start()` 안으로 옮긴다.

## 기본 입력값
| 변수 | 뜻 | 값 |
|---|---|---|
| `mana` | mana 의 처음 값 (4번 줄) | 80 (교안 그대로) |
| `isOnCooldown` | isOnCooldown (6번 줄) | 끔 |
| `playerLevel` | playerLevel 의 값 (2번 줄) | 25 (교안 그대로) |

## 교안
- [03. 연산자](https://krkoohoo.github.io/01-csharp-basic/part1-basics/03_operators/)
