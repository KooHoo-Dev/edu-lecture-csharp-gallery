// 배열은 참조 타입: 대입하거나 메서드에 넘기면 본체가 아니라 주소만 복사되어 같은 배열을 함께 가리킨다.
using System;

namespace CSharpGallery.ArrayAlias
{
    class Program
    {
        // 음수 체력을 0 으로 다듬은 배열을 돌려준다. 받은 배열(원본)은 그대로 두려 한다
        static int[] Clamped(int[] healths)
        {
#if GALLERY_MISTAKE
            // 흔한 실수: 받은 배열을 그대로 결과로 쓴다. healths 는 부른 쪽 배열의 주소라 원본을 고치게 된다
            int[] result = healths;
#else
            // 새 본체를 만들어 옮겨 담는다. 원본은 그대로다
            int[] result = new int[healths.Length];
#endif
            for (int i = 0; i < healths.Length; i++)
            {
                result[i] = healths[i] < 0 ? 0 : healths[i];
            }
            return result; // [4]
        }

        static void Main()
        {
            // 1) 대입: 배열 변수에는 본체가 아니라 본체의 주소가 들어 있다
            int[] original = { 1, 2, 3 };
            int[] copy = original; // @param copyHow // [1]
            copy[0] = 999; // [2]
            Console.WriteLine($"original[0] = {original[0]}, copy[0] = {copy[0]}");

            // 2) 메서드에 넘기기: 매개변수에도 주소가 복사된다
            int[] enemyHealths = { 40, -12, 90, -5 };
            int[] clamped = Clamped(enemyHealths); // [3]
            Console.WriteLine($"보정 전: [{string.Join(", ", enemyHealths)}]");
            Console.WriteLine($"보정 후: [{string.Join(", ", clamped)}]");
        }
    }
}
