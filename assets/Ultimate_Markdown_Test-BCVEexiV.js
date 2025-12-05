const n=`# Ultimate Markdown 테스트 파일 (GFM + 하이라이팅 포함)

---

## 1. 헤딩
# H1
## H2
### H3
#### H4
##### H5
###### H6

---

## 2. 텍스트 강조
**굵게**  
*기울임*  
***굵게+기울임***  
~~취소선~~  
<u>밑줄</u>  

---

## 3. 리스트

### 순서 없는 리스트
- 항목 1
- 항목 2
  - 하위 항목 2-1
  - 하위 항목 2-2
- 항목 3

### 순서 있는 리스트
1. 첫 번째
2. 두 번째
   1. 하위 첫 번째
   2. 하위 두 번째
3. 세 번째

### 체크박스 (GFM)
- [x] 완료된 항목
- [ ] 미완료 항목
- [ ] 또 다른 항목

---

## 4. 링크와 이미지
[Google](https://www.google.com)  
[깃허브](https://github.com)  

이미지+링크
![이미지+링크](https://placehold.co/600x400 "600x400")

내부이미지 - 절대경로
![내부이미지 - 절대경로](/public/img/ikkison_ai_01.png)

내부이미지 - 상대경로
![내부이미지 - 상대경로](./test_img_ai.png)

---

## 5. 코드

### 인라인 코드
\`console.log("Hello World");\`  

### 블럭 코드 (하이라이팅)
\`\`\`javascript
function greet(name) {
    console.log("Hello, " + name + "!");
}
greet("Markdown");
\`\`\`

\`\`\`python
def add(a, b):
    return a + b

print(add(5, 7))
\`\`\`

\`\`\`bash
echo "Hello, Bash!"
\`\`\`

\`\`\`c
#include <stdio.h>

int main() {
    printf("Hello, C World!\\n");
    return 0;
}
\`\`\`

---

## 6. 인용
> 기본 인용문
>
> > 중첩 인용문
>
> > > 3단계 인용문

---

## 7. 수평선
---
***
___

---

## 8. 표 (GFM)
| 이름   | 나이 | 직업     |
|--------|------|----------|
| 홍길동 | 25   | 개발자   |
| 김철수 | 30   | 디자이너 |
| 이영희 | 28   | 기획자   |

---

## 9. 수학/LaTeX (지원 시)
인라인: $E = mc^2$  
블럭:
$$
\\int_{0}^{\\infty} e^{-x} dx = 1
$$

---

## 10. HTML 태그
<p style="color:red;">빨간색 텍스트 (HTML)</p>  
<b>굵게 HTML</b>, <i>기울임 HTML</i>, <u>밑줄 HTML</u>  

---

## 11. 강조 + 링크
**[클릭 가능한 강조 텍스트](https://www.example.com)**

---

## 12. 체크박스 + 리스트 혼합
- [ ] 항목 A
  - 세부 항목 A-1
- [x] 항목 B
  - 세부 항목 B-1
- [ ] 항목 C

---

## 13. 특수문자 이스케이프
\\*별표\\* \\_밑줄\\_ \\#샵 \\\`백틱\\\` \\> 꺽쇠 \\| 파이프

---

## 14. 멀티라인 코드 + 주석
\`\`\`python
# Fibonacci 수열 출력
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        print(a, end=' ')
        a, b = b, a + b

fib(10)
\`\`\`

---

## 15. 인라인 수식 + 링크 + 코드 혼합
공식 \`$a^2 + b^2 = c^2$\` 를 확인하려면 [위키백과](https://ko.wikipedia.org/wiki/%ED%95%A8%EC%88%98) 참고.  
코드: \`print("Pythagoras")\`

---

## 16. 긴 문단/멀티라인 텍스트
Lorem ipsum dolor sit amet, consectetur adipiscing elit.  
Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor.  
Maecenas nisl est, ultrices nec congue eget, auctor vitae massa.

---

## 17. GFM 기능 확장

### 테이블 안 체크박스
| 완료 | 항목 |
|------|------|
| [x]  | 할 일 1 |
| [ ]  | 할 일 2 |
| [ ]  | 할 일 3 |

### 이모지
:smile: :rocket: :fire: :bug:

### 자동 링크
<https://www.google.com>  

### 줄바꿈 강제
첫 번째 줄  <br>
두 번째 줄

---

## 18. 코드 + 표 + 리스트 + 링크 혼합 예제
- [x] 항목 1: \`console.log("Hello")\`  
- [ ] 항목 2: [Google](https://www.google.com)  
  - 하위 A: ~~완료~~  
  - 하위 B: **중요**

\`\`\`python
for i in range(3):
    print(f"Item {i}")
\`\`\`

| 번호 | 출력 |
|------|------|
| 1    | 0    |
| 2    | 1    |
| 3    | 2    |

---

## 19. 이미지, 코드, 표, 링크, 수식 혼합
![이미지 예제](https://via.placeholder.com/100)

\`\`\`python
for i in range(5):
    print(i)
\`\`\`

| 번호 | 출력 |
|------|------|
| 1    | 0    |
| 2    | 1    |
| 3    | 2    |
| 4    | 3    |
| 5    | 4    |

수식: $f(x) = x^2 + 2x + 1$

---

## 20. 결론
이 파일을 사용하면 대부분의 **Markdown 문법(GFM 확장 포함)과 코드 하이라이팅**을 한 번에 테스트할 수 있습니다.
`;export{n as default};
