// TryParse 가드 절: 입력 문자열을 숫자로 바꿀 때 반환값(bool)을 확인해, 숫자가 아닌 입력을 계산 전에 거른다.
using System;

namespace CSharpGallery.TryparseGuard
{
    class Program
    {
        static void Main()
        {
            int minLevel = 1;
            int maxLevel = 10;
            Console.WriteLine("=== 캐릭터 생성 ===");

            // 사용자가 친 한 줄이다. 콘솔 입력은 언제나 string 이다
            string input = "abc"; // @param input
            Console.WriteLine($"입력한 레벨: \"{input}\"");

            // 변환에 실패하면 이 1 이 남을까?
            int level = 1; // [1]
            bool parsed = int.TryParse(input, out level); // [2]
#if GALLERY_MISTAKE
            // 흔한 실수: parsed 를 확인하지 않고 계산으로 간다
#else
            // 가드 절: 형식이나 범위가 틀리면 안내하고 끝낸다
            if (!parsed || level < minLevel || level > maxLevel)
            {
                Console.WriteLine("레벨은 1~10 사이의 정수여야 합니다.");
                return;
            }
#endif
            // 여기부터는 level 이 1~10 의 정수라고 믿고 쓴다
            int hp = 120 + level * 10;
            Console.WriteLine($"전사 Lv.{level} 생성, 시작 체력 {hp}");
        }
    }
}
