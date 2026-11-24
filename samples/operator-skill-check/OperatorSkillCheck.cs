// 5. 활용 예시 — 스킬을 쓸 수 있는지 판정하기
int playerLevel = 25; // @param playerLevel
int maxMana = 100;
int mana = 80; // @param mana
int skillCost = 30;
bool isOnCooldown = false; // @param isOnCooldown

// 비교 - 각각 bool 을 만든다
bool isLevelEnough = playerLevel >= 20;
bool hasEnoughMana = mana >= skillCost; // [1]

// 논리 - bool 들을 조합한다. 괄호로 묶이는 단위를 드러낸다
bool canUseSkill = isLevelEnough && hasEnoughMana && !isOnCooldown; // [2]

if (canUseSkill) // [3]
{
    // 할당 - 자원을 실제로 깎는다
    mana -= skillCost;
    Console.WriteLine("스킬을 사용했습니다");
}
else
{
    Console.WriteLine("사용 조건을 만족하지 않습니다");
}

// 산술 - 남은 마나를 백분율로 환산한다. 100 이 아니라 100.0 인 것에 주의한다
#if GALLERY_MISTAKE
double manaPercent = mana / maxMana * 100.0;   // ❌ (double) 없이 정수끼리 나눠서 0 이 된다
#else
double manaPercent = mana / (double)maxMana * 100.0; // [4]
#endif

// 삼항 - 한 줄 분기
string manaState = manaPercent >= 50.0 ? "넉넉함" : "부족함"; // [5]

Console.WriteLine($"마나 {mana}/{maxMana} ({manaPercent:F1}%) - {manaState}");
