// 5. 활용 예시 — 캐릭터 생성 창구 (4.4 가드 절)
int minLevel = 1;
int maxLevel = 10;

Console.WriteLine("=== 캐릭터 생성 ===");

Console.Write("캐릭터 이름: ");
string rawName = Console.ReadLine();
string nickname = rawName.Trim();          // 앞뒤 공백은 이름이 아니다 // [1]

if (nickname.Length == 0)
{
    Console.WriteLine("이름은 한 글자 이상이어야 합니다.");
    return;
}

Console.Write($"시작 레벨({minLevel}~{maxLevel}): ");
#if GALLERY_MISTAKE
// ❌ int.TryParse 를 부르고 반환값을 버림 — 숫자가 아니면 level 은 조용히 0
int.TryParse(Console.ReadLine(), out int level);
#else
if (!int.TryParse(Console.ReadLine(), out int level) || level < minLevel || level > maxLevel) // [2]
{
    Console.WriteLine($"레벨은 {minLevel}에서 {maxLevel} 사이의 정수여야 합니다.");
    return;
}
#endif

Console.Write("직업(Warrior / Mage): ");
string rawJob = Console.ReadLine();
string job = rawJob.Trim().ToUpper();      // 비교 전에 표기를 통일한다 // [3]

if (job != "WARRIOR" && job != "MAGE")
{
    Console.WriteLine("직업은 Warrior 또는 Mage 중 하나여야 합니다.");
    return;
}

// 여기서부터 세 값은 전부 검증을 통과했다
int baseHp = job == "WARRIOR" ? 120 : 80; // [4]
int hp = baseHp + level * 10;

Console.WriteLine($"{nickname} · {job} · Lv.{level} · 시작 체력 {hp}");
