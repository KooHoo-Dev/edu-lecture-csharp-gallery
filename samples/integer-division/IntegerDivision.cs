// 정수 나눗셈: int 끼리 나누면 소수점 아래가 버려져 체력 비율이 0 이 되고, float 변수에 담아도 이미 늦다.
using System;

namespace CSharpGallery.IntegerDivision
{
    class Program
    {
        static void Main()
        {
            int maxHp = 250;
            int hp = 173; // @param hp

            // 1) int 끼리 나누면 몫만 남는다. 173 / 250 은 0 이다
            int wrongPercent = hp / maxHp * 100; // [1]
            Console.WriteLine($"hp / maxHp * 100 = {wrongPercent}");

            // 2) float 변수에 담아도 늦다. 나눗셈은 int 끼리 이미 끝났다
            float lateRatio = hp / maxHp; // [2]
            Console.WriteLine($"float lateRatio = {lateRatio}");

            // 3) 캐스트는 나누기 전에 건다. 한쪽이 float 이면 실수 나눗셈이 된다
#if GALLERY_MISTAKE
            // 흔한 실수: 캐스트를 나눗셈 괄호 밖에 걸었다
            float ratio = (float)(hp / maxHp);
#else
            float ratio = (float)hp / maxHp;
#endif
            int percent = (int)(ratio * 100); // [3]
            Console.WriteLine($"ratio = {ratio}, percent = {percent}");

            // 4) 체력 바 10칸. 몇 칸인지는 몫이 맞다
            int filled = percent / 10; // [4]
            string bar = "";
            for (int i = 0; i < 10; i++)
            {
                bar += i < filled ? "■" : "□";
            }
            Console.WriteLine($"체력 {hp}/{maxHp} [{bar}] {percent}%");
        }
    }
}
