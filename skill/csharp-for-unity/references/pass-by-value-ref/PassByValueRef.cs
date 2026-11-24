// 값에 의한 전달과 ref: 보통은 값이 복사되어 메서드가 사본만 바꾸고, ref 로 넘기면 메서드가 부른 쪽 변수 자체를 바꾼다.
using System;

namespace CSharpGallery.PassByValueRef
{
    class Program
    {
        // 값에 의한 전달: health 는 부른 쪽 값을 복사한 사본이다
        static void Heal(int health, int amount)
        {
            health += amount; // [2]
            if (health > 100) health = 100;
            Console.WriteLine($"Heal 안: health = {health}");
        }

        // ref 로 받기: health 는 부른 쪽 변수 그 자체다
#if GALLERY_MISTAKE
        // 흔한 실수: 원본을 바꾸려 했는데 ref 를 빼먹었다. health 는 다시 사본이다
        static void HealRef(int health, int amount)
#else
        static void HealRef(ref int health, int amount)
#endif
        {
            health += amount; // [3]
            if (health > 100) health = 100;
            Console.WriteLine($"HealRef 안: health = {health}");
        }

        static void Main()
        {
            int playerHp = 60;
            int healAmount = 30; // @param healAmount

            // 1) 값에 의한 전달: playerHp 의 값 60 이 복사되어 넘어간다
            Heal(playerHp, healAmount); // [1]
            Console.WriteLine($"Heal 뒤: playerHp = {playerHp}");

            // 2) ref 로 넘기기: 부르는 쪽에도 ref 를 붙인다
#if GALLERY_MISTAKE
            HealRef(playerHp, healAmount);
#else
            HealRef(ref playerHp, healAmount);
#endif
            Console.WriteLine($"HealRef 뒤: playerHp = {playerHp}");
        }
    }
}
