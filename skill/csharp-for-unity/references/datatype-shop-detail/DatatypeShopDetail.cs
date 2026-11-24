// 5. 활용 예시 — 상품 정보를 데이터 성격에 맞는 자료형으로 표현한다
long productCode = 123456789012L;       // 큰 숫자 → long // [1]
string productName = "고성능 기계식 키보드";
int price = 159000;                     // 일반 정수 // @param price
decimal discountRate = 0.15m;           // 금융/비율 → decimal // [2]
double starRating = 4.8;                // 평점은 소수점 가능
bool onSale = true;                     // 참/거짓 // @param onSale // [3]

Console.WriteLine("--- 상품 상세 ---");
Console.WriteLine($"상품 코드: {productCode}");
Console.WriteLine($"상품명: {productName}");
Console.WriteLine($"가격: {price}원");
Console.WriteLine($"할인율: {discountRate * 100}%"); // [4]
Console.WriteLine($"평점: {starRating} / 5.0");
Console.WriteLine($"할인 여부: {onSale}");

// ── 8. 주의사항 — decimal 리터럴 뒤 m 누락 ──
#if GALLERY_MISTAKE
// ❌ 상황
decimal p = 100.5;
#else
// ✅ 적용
decimal p = 100.5m;
#endif
Console.WriteLine(p);   // (p 에 담긴 값을 보려고 덧붙임)
