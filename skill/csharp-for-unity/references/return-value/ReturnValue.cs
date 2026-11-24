// 메서드의 반환값: 부르면 프레임이 쌓이고, return 하면 값 하나만 들고 돌아오며 프레임이 걷힌다. 돌아온 값은 받아야 남는다.
using System;

namespace CSharpGallery.ReturnValue
{
    class Program
    {
        // 최종 데미지(공격력 - 방어력)를 돌려준다. 음수는 0 으로 막는다
        static int CalculateDamage(int attackPower, int monsterDefense)
        {
            int dmg = attackPower - monsterDefense;
            if (dmg < 0) dmg = 0;
            return dmg; // [2]
        }

        // 지금 체력에 회복량을 더한 값을 돌려준다. 최대 체력 100 을 넘지 않는다
        static int Heal(int currentHp, int amount)
        {
            int healed = currentHp + amount; // [3]
            if (healed > 100) healed = 100;
            return healed; // [4]
        }

        static void Main()
        {
            int attack = 50; // @param attack
            int hp = 100;

            // 1) 반환값을 변수에 받는다: 호출 자리가 값 하나가 된다
            int damage = CalculateDamage(attack, 15); // [1]
            hp = hp - damage;
            Console.WriteLine($"슬라임에게 맞은 데미지: {damage}, 남은 체력: {hp}");

            // 2) 체력 회복: 돌려받은 값을 다시 hp 에 넣어야 체력이 바뀐다
#if GALLERY_MISTAKE
            // 흔한 실수: 반환값을 받지 않았다. 계산한 값은 버려진다
            Heal(hp, 30);
#else
            hp = Heal(hp, 30);
#endif
            Console.WriteLine($"포션 사용 후 체력: {hp}");
        }
    }
}
