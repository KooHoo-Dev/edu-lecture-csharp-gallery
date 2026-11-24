// break 는 가장 가까운 반복문 하나만 끝낸다: 두 겹 for 에서 첫 슬라임을 찾자마자 멈추려면 메서드로 빼고 return 한다.
using System;

namespace CSharpGallery.BreakOneLevel
{
    class Program
    {
        // 맵을 위 줄부터 훑어 처음 만나는 슬라임(S)의 칸을 돌려준다
        static string FindFirstSlime(string[] map)
        {
            string found = "없음";
            int looked = 0;
            for (int y = 0; y < map.Length; y++)
            {
                for (int x = 0; x < map[y].Length; x++)
                {
                    looked++;
                    if (map[y][x] == 'S')
                    {
                        found = $"({y}, {x})"; // [2]
                        Console.WriteLine($"슬라임 발견: {found}");
#if GALLERY_MISTAKE
                        // 흔한 실수: break 는 안쪽 for(x) 만 끝낸다
                        break;
#else
                        // return 은 두 겹을 한 번에 빠져나온다
                        return found;
#endif
                    }
                }
            }
            // 슬라임이 없거나, break 뒤 바깥 for 가 다 돌면 여기로 온다
            return found;
        }

        static void Main()
        {
            // 한 줄이 한 층, 글자 하나가 방 하나다. S 는 슬라임, . 은 빈 방
            string[] map = { "....", "..S.", "S..." }; // @param map
            string first = FindFirstSlime(map); // [1]
            Console.WriteLine($"첫 슬라임: {first}"); // [3]
            if (first != "없음")
            {
                Console.WriteLine($"전사가 {first} 칸으로 간다");
            }
        }
    }
}
