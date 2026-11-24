// 캐릭터 상태 — 전부 초기화까지 한 줄로
string characterName = "광전사";
int health = 100; // @param health
int gold = 10000;
bool isAlive = true; // [1]

Console.WriteLine($"{characterName} · 체력 {health} · 소지금 {gold}");

// 몬스터의 공격 — 체력 재할당
health = health - 30; // [2]

// 전리품 획득 — 소지금 재할당
gold = gold + 250; // [3]

// 생존 여부도 값이 바뀐 뒤 다시 판정해 재할당한다
isAlive = health > 0; // [4]

Console.WriteLine($"공격받음! 체력 {health} · 소지금 {gold} · 생존 {isAlive}");

// ── 8. 주의사항: 재할당을 누적으로 착각하기 ──
#if GALLERY_MISTAKE
gold = 5000;          // ❌ 기존 값에 더하는 것이 아니라 갈아 끼운다
#else
gold = gold + 5000;   // ✅ 더하려면 지금 값을 오른쪽에서 읽어 계산한다
#endif
Console.WriteLine(gold);
