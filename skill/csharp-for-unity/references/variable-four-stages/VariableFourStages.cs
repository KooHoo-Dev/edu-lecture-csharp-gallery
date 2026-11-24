// 1. 선언 — 공간만 만든다. 아직 값은 없다
int playerGold; // [1]

// 2. 할당 — 그 공간에 값을 넣는다
playerGold = 10000; // [2]
Console.WriteLine(playerGold);   // 10000

// 3. 초기화 — 선언과 할당을 한 줄로
int playerLevel = 1; // @param playerLevel // [3]
Console.WriteLine(playerLevel);  // 1

// 4. 재할당 — 들어 있던 값을 덮어쓴다. 이전 값은 사라진다
playerGold = 5000; // [4]
playerLevel = 5;
Console.WriteLine(playerGold);   // 5000
Console.WriteLine(playerLevel);  // 5

// ── 4.3 잘못된 코드와 흔한 실수 ──
#if GALLERY_MISTAKE
// ❌ 상황 — 선언만 하고 값을 넣기 전에 읽는다
int experience;
Console.WriteLine(experience);
#else
// ✅ 적용 — 선언과 동시에 의미 있는 값으로 시작
int experience = 0;
Console.WriteLine(experience);   // 0

experience = 150;                // 필요할 때 재할당
Console.WriteLine(experience);   // 150
#endif
