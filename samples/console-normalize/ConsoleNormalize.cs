// 3.5 입력 정규화 — 비교하기 전에 모양 맞추기
Console.Write("색을 입력하세요: ");   // (덧붙임)
string raw = Console.ReadLine(); // [1]

// (덧붙임) 정규화 없이 그대로 비교하면 — 사람 눈에는 같아도 == 에서는 다른 값
bool sameAsTyped = raw == "Red"; // [2]
Console.WriteLine($"그대로 비교: {sameAsTyped}");

#if GALLERY_MISTAKE
// ❌ 비교 전에 Trim() 을 빠뜨림 — 대문자로만 맞춘다
string normalized = raw.ToUpper();
#else
string trimmed = raw.Trim();        // 앞뒤 공백 제거 — " Red " → "Red" // [3]
string normalized = trimmed.ToUpper();  // 전부 대문자로 — "red" · "Red" → "RED" // [4]
#endif
Console.WriteLine($"정규화한 값: [{normalized}]");   // (덧붙임) [ ] 로 공백이 보이게

bool isRed = normalized == "RED";   // 이제 어떤 표기로 쳐도 같은 판정 // [5]
Console.WriteLine($"정규화 후 비교: {isRed}");   // (덧붙임)
