// ── 3.5 증감 연산자 — 전위와 후위 ──
int count = 0;   // (교안에 없는 선언)

++count;    // 전위 : 먼저 1 올리고, 그 값을 쓴다 // [1]
count++;    // 후위 : 지금 값을 먼저 쓰고, 그 다음 1 올린다
Console.WriteLine(count);     // 2 — 홀로 쓰면 둘 다 1 씩 올린다

// 값을 다른 곳에 넘기면 차이가 드러난다 (교안 본문을 코드로)
int prefix = ++count;         // 먼저 올리고(3) 그 값을 넘긴다 // [2]
int postfix = count++;        // 지금 값(3)을 넘기고 그 다음 올린다 // [3]
Console.WriteLine($"prefix {prefix} · postfix {postfix} · count {count}");

// ── 3.6 삼항 연산자 (score 는 교안 4절의 85 로 덧붙임) ──
int score = 85; // @param score
string grade = score >= 90 ? "A" : "B"; // [4]
Console.WriteLine(grade);

// ── 3.7 우선순위 — && 가 || 보다 먼저 ──
bool a = false;   // (교안의 A · B · C 자리에 넣은 값)
bool b = false;
bool c = true;
// 의도 : a 이면서, b 또는 c 중 하나
#if GALLERY_MISTAKE
bool result = a && b || c;      // ❌ 괄호 생략 — (a && b) || c 로 묶인다
#else
bool result = a && (b || c);    // ✅ 묶이는 단위를 괄호로 드러낸다 // [5]
#endif
Console.WriteLine(result);
