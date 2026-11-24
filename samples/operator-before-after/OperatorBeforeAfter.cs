// 4. 코드로 보기 — 점수로 등급을 내고, 할인가를 계산한다
int score = 85; // @param score
int price = 10000;

#if GALLERY_MISTAKE
// ❌ 상황 (Before)
// 1. 할인율 20% - 정수끼리 나눠서 0 이 된다
int discountRate = 20 / 100;              // 0.2 가 아니라 0 이다
int finalPrice = price - price * discountRate;   // 10000 - 0 = 10000

// 2. 비교하려던 자리에 할당을 썼다
//if (score = 90) { }                     // 컴파일 오류 - bool 이 아니라 int 가 나온다

// 3. 우선순위를 믿고 괄호를 생략했다
bool isPass = score >= 60 && score <= 100 || score == 999;   // 의도가 무엇인지 읽히지 않는다

// 4. 갈래 넷을 삼항으로 밀어 넣었다
string grade = score > 90 ? "A"
             : score > 80 ? "B"
             : score > 70 ? "C" : "F";

Console.WriteLine("최종 가격은 : " + finalPrice);   // 문자열 + 연결
#else
// ✅ 적용 (After)
// 1. 한쪽을 실수로 만들어 비율을 살린다
double discountRate = 20 / 100.0;                          // 0.2
int finalPrice = (int)(price - price * discountRate);      // 8000 // [1]

// 2. 비교는 == 로 적는다
if (score == 90) // [2]
    Console.WriteLine("정확히 90점입니다");

// 3. 묶이는 단위를 괄호로 드러낸다
bool isPass = (score >= 60 && score <= 100) || (score == 999); // [3]

// 4. 갈래가 셋을 넘으면 if-else if 가 읽기 쉽다
string grade; // [4]
if (score >= 90) grade = "A";
else if (score >= 80) grade = "B";
else if (score >= 70) grade = "C";
else grade = "F";

Console.WriteLine($"{grade} 등급 - 최종 가격은 {finalPrice}원입니다");   // 문자열 보간
#endif
