// 4.3 ✅ 적용 — TryParse 로 받으면 무엇을 입력해도 프로그램이 죽지 않는다
Console.Write("숫자를 입력하세요: ");
string input = Console.ReadLine(); // [1]

#if GALLERY_MISTAKE
// 실수 2 — 빌드는 되지만 실행 중에 멈춘다
int n = int.Parse("abc");        // 런타임 FormatException 발생!
                                 // → 프로그램이 강제 종료됨
#else
if (int.TryParse(input, out int number)) // [2]
{
    Console.WriteLine($"입력한 숫자에 10을 더하면 {number + 10}");
}
else
{
    Console.WriteLine("숫자가 아닙니다. 다시 시도하세요.");
}
#endif
