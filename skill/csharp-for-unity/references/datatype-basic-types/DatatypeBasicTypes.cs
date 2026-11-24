// ── 3.2 기본 자료형 한눈에 보기 ──
float big = 1234567.8f; // @param big // [1]
Console.WriteLine(big);                  // 1234567.8 — 출력은 멀쩡해 보인다
Console.WriteLine((double)big);          // 1234567.75 — 실제로 담긴 값. 정수부 7자리로 이미 한도라 .8 을 정확히 담지 못한다 // [2]
Console.WriteLine(big + 0.01f == big);   // True — 0.01 을 더해도 담을 자리가 없어 그대로다

// ── 4.1 문법 구조 ──
// 정수형
int level = 1;
long population = 5000000000L;     // L 접미사

// 실수형
float speed = 1.5f;                // f 접미사 필수
double pi = 3.14159265;
decimal price = 19900m;            // m 접미사 (금융)

// 문자/문자열
char grade = 'A';                  // 작은따옴표
string name = "홍길동";            // 큰따옴표

// 논리
bool isAlive = true; // [3]

// ── 4.3 잘못된 코드와 흔한 실수 ── (pi 와 speed 는 4.1 에서 이어짐)
#if GALLERY_MISTAKE
// ❌ 상황
int number = "Hello";    // CS0029: string을 int로 변환 불가
int piInt = pi;          // CS0266: double을 int로 암묵적 변환 불가
speed = 1.5;             // CS0664: 1.5는 double이므로 1.5f 필요
#else
// ✅ 적용
int number = 100;             // 타입 일치
int piInt = (int)pi;          // 명시적 형변환 (소수점 손실 감수) // [4]
speed = 1.5f;                 // f 접미사로 float 명시
#endif
