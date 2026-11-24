// if-else if 사슬은 위에서부터 조건을 검사하다 처음 참이 된 갈래 하나만 실행한다. 그래서 좁은 조건을 먼저 둔다.
using System;

namespace CSharpGallery.IfChainOrder
{
    class Program
    {
        static void Main()
        {
            int score = 85; // @param score
            string grade = "";
            int rewardGold = 0;
            Console.WriteLine($"던전 클리어 점수: {score}점"); // [1]

#if GALLERY_MISTAKE
            // 흔한 실수: 넓은 조건(60점 이상)을 맨 위에 두었다
            if (score >= 60) { grade = "D"; rewardGold = 100; }
            else if (score >= 70) { grade = "C"; rewardGold = 300; }
            else if (score >= 80) { grade = "B"; rewardGold = 500; }
            else if (score >= 90) { grade = "A"; rewardGold = 1000; }
            else { grade = "F"; rewardGold = 0; }
#else
            // 좁은 조건(높은 기준)부터 검사한다
            if (score >= 90) { grade = "A"; rewardGold = 1000; }
            else if (score >= 80) { grade = "B"; rewardGold = 500; }
            else if (score >= 70) { grade = "C"; rewardGold = 300; }
            else if (score >= 60) { grade = "D"; rewardGold = 100; }
            else { grade = "F"; rewardGold = 0; }
#endif
            Console.WriteLine($"등급 {grade}, 보상 {rewardGold} 골드"); // [2]

            // 보상은 플레이어의 골드에 더한다
            int playerGold = 200;
            playerGold += rewardGold; // [3]
            Console.WriteLine($"Player 골드: {playerGold}");
        }
    }
}
