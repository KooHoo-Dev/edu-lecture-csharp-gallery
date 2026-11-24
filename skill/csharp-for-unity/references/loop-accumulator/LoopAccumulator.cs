// 누적 변수는 반복문 밖에서 한 번 만든다. 바퀴마다 같은 변수에 더해야 값이 쌓인다.
using System;

namespace CSharpGallery.LoopAccumulator
{
    class Program
    {
        static void Main()
        {
            // 이번 사냥에서 쓰러뜨린 몬스터들의 처치 보상(골드)
            int[] rewards = { 30, 50, 25, 40 }; // @param rewards
            int totalGold = 0; // [1]

            foreach (int reward in rewards)
            {
#if GALLERY_MISTAKE
                // 흔한 실수: 누적 변수를 반복문 안에서 0 으로 되돌렸다
                totalGold = 0;
#endif
                totalGold += reward; // [2]
                Console.WriteLine($"+{reward} 골드, 누적 {totalGold} 골드");
            }

            // 반복문이 끝나도 밖에서 만든 totalGold 는 남아 있다
            Console.WriteLine($"총 보상: {totalGold} 골드"); // [3]
            double average = (double)totalGold / rewards.Length;
            Console.WriteLine($"평균: {average} 골드");
        }
    }
}
