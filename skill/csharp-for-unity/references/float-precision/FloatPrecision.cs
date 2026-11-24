// 실수 자료형은 근삿값이다: 0.1 을 열 번 더해도 float 는 1 에서 조금 어긋나고, decimal 은 정확히 1.0 이 된다.
using System;

namespace CSharpGallery.FloatPrecision
{
    class Program
    {
        static void Main()
        {
            // 1) 0.1 짜리 물약 무게를 float 와 decimal 로 더한다
            int potionCount = 10; // @param potionCount
            float floatWeight = 0f;
            decimal decimalWeight = 0m;
            for (int i = 0; i < potionCount; i++)
            {
                floatWeight = floatWeight + 0.1f; // [1]
                decimalWeight = decimalWeight + 0.1m;
            }
            Console.WriteLine($"float   무게: {floatWeight}"); // [2]
            Console.WriteLine($"decimal 무게: {decimalWeight}");

            // 2) 가방 한도 1 에 닿았는지 판정한다
            float bagLimit = 1f;
#if GALLERY_MISTAKE
            // 흔한 실수: 실수를 == 로 비교했다
            bool isFull = floatWeight == bagLimit;
#else
            // 실수는 == 로 비교하지 않는다. 한도에 닿았는지는 >= 로 본다
            bool isFull = floatWeight >= bagLimit;
#endif
            Console.WriteLine($"가방이 가득 찼나? {isFull}"); // [3]
            if (!isFull)
            {
                Console.WriteLine("아직 자리가 있다. 물약을 더 넣는다");
            }
        }
    }
}
