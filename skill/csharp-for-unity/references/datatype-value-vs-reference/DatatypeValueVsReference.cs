// 값 형식 — 값이 통째로 복사됨
int a = 10; // @param a
int b = a;       // a의 값 10이 b에 복사 // [1]
b = 20;          // b만 바뀜, a는 그대로 // [2]
Console.WriteLine($"a: {a}, b: {b}");      // a: 10, b: 20

// 참조 형식 — 주소만 복사됨
int[] arrA = { 1, 2, 3 }; // [3]
int[] arrB = arrA;   // arrA의 주소가 arrB에 복사 (같은 배열을 가리킴) // [4]
arrB[0] = 99;        // arrB로 바꿨지만 arrA에도 반영 // [5]
Console.WriteLine($"arrA[0]: {arrA[0]}, arrB[0]: {arrB[0]}");  // 둘 다 99

// ── 3.4 대입하면 주소만 복사된다 ──
#if GALLERY_MISTAKE
// ❌ 상황 — 값 형식처럼 대입하면 복사본이 생긴다고 생각했다
int[] arrC = arrA;
#else
// ✅ 적용 — 따로 쓸 배열은 따로 만든다 (본체가 하나 더 생긴다)
int[] arrC = { 1, 2, 3 };
#endif
arrC[0] = 50;
Console.WriteLine($"arrA[0]: {arrA[0]}, arrC[0]: {arrC[0]}");
