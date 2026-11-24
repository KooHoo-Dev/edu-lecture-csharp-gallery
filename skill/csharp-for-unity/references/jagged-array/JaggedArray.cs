// 가변 배열(int[][])은 배열의 배열이다: 바깥 칸은 안쪽 배열을 가리키는 참조라, 안쪽을 new 해서 넣기 전까지 null 이다.
using System;

namespace CSharpGallery.JaggedArray
{
    class Program
    {
        // 2차원 배열은 한 덩어리다. 행과 열의 길이는 GetLength 로 묻는다
        static void PrintArenaSize()
        {
            int[,] arena = new int[2, 3]; // [1]
            Console.WriteLine($"arena: {arena.GetLength(0)}행 {arena.GetLength(1)}열, 칸 {arena.Length}개");
        }

        static void Main()
        {
            PrintArenaSize();

            // 가변 배열은 층마다 방 수가 다른 던전이다. 칸의 값은 방에 있는 몬스터 체력이다
            int[][] dungeon = new int[3][]; // [2]
            dungeon[0] = new int[] { 10 }; // [3]
            dungeon[1] = new int[] { 30, 40, 50 };
            int[] lastFloor = new int[4]; // @param lastFloor
#if GALLERY_MISTAKE
            // 흔한 실수: 3층 배열을 만들고 바깥 칸에 넣지 않았다
#else
            dungeon[2] = lastFloor;
#endif

            for (int floor = 0; floor < dungeon.Length; floor++) // [4]
            {
                int total = 0;
                // 안쪽 길이는 층마다 다르다. dungeon[floor].Length 로 묻는다
                for (int room = 0; room < dungeon[floor].Length; room++)
                {
                    total += dungeon[floor][room];
                }
                Console.WriteLine($"{floor + 1}층: 방 {dungeon[floor].Length}개, 몬스터 체력 합 {total}");
            }
        }
    }
}
