// 참조 타입 매개변수에 new 를 넣으면 연결만 끊긴다: 받은 객체의 필드를 고치면 원본이 바뀌지만, 매개변수에 새 객체를 넣으면 부른 쪽 변수는 그대로다.
using System;

namespace CSharpGallery.RefParamReassign
{
    class Player
    {
        public string Name;
        public int Hp;
    }

    class Program
    {
        // 받은 객체의 필드를 고친다. target 에는 부른 쪽 객체의 주소가 복사되어 있다
        static void Hit(Player target, int damage)
        {
            target.Hp -= damage; // [2]
            Console.WriteLine($"{target.Name}: {damage} 피해, Hp = {target.Hp}");
        }

        // 쓰러진 플레이어를 체력 100 으로 되살리려 한다
        static void Revive(Player target)
        {
#if GALLERY_MISTAKE
            // 흔한 실수: 새 Player 를 만들어 매개변수에 넣었다. target 의 화살표만 새 객체로 옮겨 가고 원본과의 연결이 끊긴다
            target = new Player { Name = target.Name, Hp = 100 };
#else
            // 받은 객체의 필드를 고친다. 부른 쪽 변수와 같은 객체라 원본이 바뀐다
            target.Hp = 100;
#endif
            Console.WriteLine($"Revive 안: target.Hp = {target.Hp}"); // [4]
            Console.WriteLine($"{target.Name} 부활");
        }

        static void Main()
        {
            Player hero = new Player { Name = "전사", Hp = 100 };
            int damage = 70; // @param damage

            // 1) 객체를 넘기면 주소가 복사된다. 필드를 고치면 원본이 바뀐다
            Hit(hero, damage); // [1]
            Console.WriteLine($"Hit 뒤: hero.Hp = {hero.Hp}");

            // 2) 되살리기: 메서드 안에서 무엇을 바꾸느냐에 따라 원본이 갈린다
            Revive(hero); // [3]
            Console.WriteLine($"Revive 뒤: hero.Hp = {hero.Hp}");
        }
    }
}
