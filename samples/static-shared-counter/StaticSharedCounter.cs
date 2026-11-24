// static 필드는 객체마다가 아니라 클래스에 하나뿐이다: 아이템을 몇 개 만들든 모두가 같은 번호표 칸과 개수 칸을 함께 쓴다.
using System;

namespace CSharpGallery.StaticSharedCounter
{
    class Item
    {
#if GALLERY_MISTAKE
        // 흔한 실수: static 을 빠뜨려 아이템마다 _nextId 를 따로 갖는다
        private int _nextId = 1;
#else
        private static int _nextId = 1;      // 다음에 줄 번호 (클래스에 하나)
#endif
        public static int CreatedCount = 0;  // 만든 개수 (클래스에 하나)

        public readonly int Id;              // 아이템마다 다른 번호
        public string Name;

        public Item(string name)
        {
            Id = _nextId++; // [2]
            Name = name;
            CreatedCount++;
        }
    }

    class Program
    {
        static void Main()
        {
            int potionCount = 2; // @param potionCount

            // 1) 첫 아이템: 생성자가 정적 필드에서 번호를 받아 간다
            Item sword = new Item("강철 검"); // [1]

            // 2) 물약을 여러 개 만든다: 모두 같은 _nextId 칸에서 번호를 받는다
            Item[] potions = new Item[potionCount];
            for (int i = 0; i < potions.Length; i++)
            {
                potions[i] = new Item("체력 물약"); // [3]
            }

            Console.WriteLine($"{sword.Name} 번호: {sword.Id}"); // [4]
            for (int i = 0; i < potions.Length; i++)
            {
                Console.WriteLine($"{potions[i].Name} 번호: {potions[i].Id}");
            }
            // 정적 필드는 객체가 아니라 클래스 이름으로 부른다
            Console.WriteLine($"총 생성: {Item.CreatedCount}");
        }
    }
}
