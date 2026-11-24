// 입력 → 처리 → 출력
Console.Write("당신의 이름은? ");
string userName = Console.ReadLine(); // [1]

Console.Write("몇 년도 출생? ");
string birthYearStr = Console.ReadLine(); // [2]

// 형 변환
int birthYear = int.Parse(birthYearStr); // [3]
int age = 2026 - birthYear; // [4]

// 출력
Console.WriteLine($"안녕하세요, {userName}님!"); // [5]
Console.WriteLine($"당신은 {birthYear}년생, 2026년 기준 약 {age}세입니다.");

// ── 4.3 잘못된 코드와 흔한 실수 ──
#if GALLERY_MISTAKE
// 실수 1 — 빌드부터 막힌다
Console.Write("숫자를 입력하세요: ");
string s = Console.ReadLine();

int result = s + 5;              // CS0029: s + 5 는 문자열 "…5" 가 되고,
                                 //         문자열은 int 에 대입할 수 없다
#else
// (덧붙임) 먼저 파싱해서 int 로 바꾼 뒤 계산한다 (4.2 의 9번 줄처럼)
Console.Write("숫자를 입력하세요: ");
string s = Console.ReadLine();

int result = int.Parse(s) + 5;
Console.WriteLine($"{s} 에 5를 더하면 {result}");
#endif
