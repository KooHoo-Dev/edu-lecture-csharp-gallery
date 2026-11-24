// 박싱과 언박싱: 값 타입을 object 자리에 넣으면 힙에 상자가 새로 생기고, 꺼낼 때는 넣을 때와 같은 타입으로 꺼내야 한다.
using System;

namespace CSharpGallery.BoxingUnboxing
{
    class Program
    {
        // 저장 칸에서 골드를 꺼낸다. 상자 속 타입을 먼저 물어보고 그 타입 그대로 꺼낸다
        static long ReadGold(object field)
        {
#if GALLERY_MISTAKE
            // 흔한 실수: 골드를 long 으로 쓰려고 묻지도 않고 (long) 으로 꺼냈다. 상자 속은 int 라 InvalidCastException 이다
            return (long)field;
#else
            if (field is int)
            {
                Console.WriteLine("int 상자다. (int) 로 꺼낸 뒤 long 으로 넓힌다");
                return (int)field;
            }
            if (field is long)
            {
                Console.WriteLine("long 상자다. (long) 으로 꺼낸다");
                return (long)field;
            }
            Console.WriteLine($"숫자가 아니다: {field.GetType().Name}");
            return 0;
#endif
        }

        static void Main()
        {
            // 1) 박싱: int 를 object 자리에 넣으면 힙에 상자가 새로 생기고 값이 복사된다
            int gold = 8750;
            object savedGold = gold; // @param savedGold // [1]
            gold = 0; // [2]
            Console.WriteLine($"gold = {gold}, savedGold = {savedGold}");

            // 2) 타입이 섞인 저장 데이터: 이름, 레벨, 골드를 object 배열 하나에 담는다
            object[] saveData = { "전사", 42, savedGold }; // [3]

            // 3) 언박싱: 골드 칸을 꺼내 long 으로 쓴다
            long totalGold = ReadGold(saveData[2]); // [4]
            Console.WriteLine($"{saveData[0]} Lv.{saveData[1]}, 골드 {totalGold}");
        }
    }
}
