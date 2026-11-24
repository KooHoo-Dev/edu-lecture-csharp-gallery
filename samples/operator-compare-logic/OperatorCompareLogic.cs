// number 는 250 이다
int number = 250;   // (교안 3.2 에서 이어짐)
bool isBigger = number > 100;    // true // [1]
Console.WriteLine(isBigger);

isBigger = number > 1000;        // false // [2]
Console.WriteLine(isBigger);

#if GALLERY_MISTAKE
isBigger = number = 250;         // ❌ == 자리에 = 를 썼다
#else
isBigger = number == 250;        // true - 같은가? // [3]
#endif
Console.WriteLine(isBigger);

isBigger = number != 249;        // true - 다른가?
Console.WriteLine(isBigger);

// ── 3.4 논리 연산자 ──
int a = 10;
int b = 20;
int c = 15; // @param c

// c 가 a 와 b 사이에 있는가?
bool isBetween = (a < c) && (c < b);

// c 가 a 보다 작거나, b 보다 큰가? (= 구간 밖에 있는가?)
bool isOutside = (c < a) || (b < c); // [4]

Console.WriteLine($"&& (그리고) 결과 : {isBetween}");   // true
Console.WriteLine($"|| (또는) 결과 : {isOutside}");     // c 가 15 일 때 : false

c = 5;
isOutside = (c < a) || (b < c); // [5]
Console.WriteLine($"|| (또는) 결과 : {isOutside}");     // c 가 5 일 때 : true - 왼쪽이 참이다

c = 25;
isOutside = (c < a) || (b < c);
Console.WriteLine($"|| (또는) 결과 : {isOutside}");     // c 가 25 일 때 : true - 오른쪽이 참이다
