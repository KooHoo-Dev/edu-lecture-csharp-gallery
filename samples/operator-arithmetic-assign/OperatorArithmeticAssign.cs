// ── 3.1 산술 연산자 ──
int number = 100; // @param number

Console.WriteLine(number + 50);   // 덧셈 (150) // [1]
Console.WriteLine(number - 25);   // 뺄셈 (75)
Console.WriteLine(number * 2);    // 곱셈 (200)
Console.WriteLine(number / 5);    // 나눗셈 - 몫 (20)
Console.WriteLine(number % 3);    // 나눗셈 - 나머지 (1) // [2]
#if GALLERY_MISTAKE
Console.WriteLine(10 / 3);        // ❌ 3 — 양쪽이 int 라 몫만 남는다
#else
Console.WriteLine(10.0 / 3);      // ✅ 3.333… — 한쪽이 실수
#endif

// ── 3.2 할당 연산자 (number 는 3.1 의 값 그대로) ──
number = number + 50;   // 오른쪽 100 + 50 = 150 을 계산해서 number 에 넣는다 // [3]
Console.WriteLine(number);   // 150

number = number + 50;   // 이번엔 오른쪽이 150 + 50 = 200 이다
Console.WriteLine(number);   // 200

number = number + 50;   // 또 한 번 - 200 + 50 = 250 // [4]
Console.WriteLine(number);   // 250

// ── 3.2 복합 할당 연산자 (시작값과 마지막 출력은 교안에 없어 덧붙임) ──
int score = 50;
int health = 100;
int damage = 30;
int gold = 100;
int count = 10;
int index = 4;
score += 10;        // score = score + 10 과 같다
health -= damage;   // health = health - damage 와 같다 // [5]
gold *= 2;          // gold = gold * 2 와 같다
count /= 2;         // count = count / 2 와 같다
index %= 4;         // index = index % 4 와 같다 - 0 1 2 3 을 순환한다
Console.WriteLine($"{score} {health} {gold} {count} {index}");   // 60 70 200 5 0
