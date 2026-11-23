// 값 타입과 참조 타입: 대입할 때 값 타입(struct)은 데이터가 통째로 복사되고, 참조 타입(class)은 주소만 복사되어 같은 객체를 함께 가리킨다.
using System;

namespace CSharpGallery.ValueVsReference
{
#if GALLERY_MISTAKE
    // 흔한 실수: 위치처럼 '값'으로 다룰 것을 class 로 만들었다. 이제 대입은 주소 복사라 p2 를 고치면 p1 도 바뀐다
    class Point
#else
    // 위치는 struct(값 타입)다. Unity 의 Vector3 도 struct 다
    struct Point
#endif
    {
        public int X;
        public int Y;
    }

    // 플레이어는 class(참조 타입)다. Unity 의 GameObject, 컴포넌트도 참조 타입이다
    class Player
    {
        public string Name;
        public int Health;
    }

    class Program
    {
        static void Main()
        {
            // 1) 값 타입: 대입하면 사본이 생긴다
            Point p1 = new Point { X = 1, Y = 2 };
            Point p2 = p1; // [1]
            p2.X = 100; // [2]
            Console.WriteLine($"p1.X = {p1.X}, p2.X = {p2.X}");

            // 2) 참조 타입: 대입하면 주소만 복사되어 같은 객체를 가리킨다
            bool makeNew = false; // @param makeNew
            Player player1 = new Player { Name = "전사", Health = 100 };
            Player player2 = makeNew ? new Player { Name = player1.Name, Health = player1.Health } : player1; // [3]
            player2.Health = 500; // [4]
            Console.WriteLine($"player1.Health = {player1.Health}, player2.Health = {player2.Health}");
        }
    }
}
