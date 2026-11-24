// 변수의 재할당: gold = gold + reward 는 gold 의 지금 값을 읽어 계산한 새 값으로 상자 속을 갈아 끼운다.
using System;

namespace CSharpGallery.VariableReassign
{
    class Program
    {
        static void Main()
        {
            // 초기화: 공간(int) · 이름(gold) · 값(100) 을 한 줄에 적는다
            int gold = 100; // [1]
            int reward = 50; // @param reward
            int questCount = 3; // @param questCount
            Console.WriteLine($"시작 골드: {gold}");

            for (int quest = 1; quest <= questCount; quest++)
            {
#if GALLERY_MISTAKE
                // 흔한 실수: 지금 값을 읽지 않아 보상 하나로 갈아 끼운다
                gold = reward;
#else
                // 재할당: 오른쪽을 먼저 계산해 왼쪽 gold 에 넣는다
                gold = gold + reward;
#endif
                Console.WriteLine($"퀘스트 {quest}: 골드 {gold}"); // [2]
            }

            // 물약을 산다. 빼기도 재할당이라 자료형을 다시 적지 않는다
            int potionPrice = 120;
            gold = gold - potionPrice; // [3]
            Console.WriteLine($"물약 구매 -{potionPrice}: 골드 {gold}");
        }
    }
}
