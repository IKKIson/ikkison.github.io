const n=`# Data Transfer Object

## 판단

- DTO의 주된 목적은 데이터를 그대로 전달해주는 것이므로 Component, Layer 간 결합도를 낮추는데 기여한다.

- 무조건 사용한다고 결합도를 낮추는 것이 아니므로, 사용 여부를 판단해보자.

## 전략

| Direction | DTO | Description |
|-----------|-----|-------------|
| FE -> Controller      | Request DTO  | Rquest Body 를 파싱                           |
| Controller -> Service | Not use      | 대부분 소량의 데이터가 bypass 되므로 굳이 사용하지 않음 |
|                       |              | DTO 관리 포인트 증가 낭비                        |
|                       |              | 단순 Data Class로 Instance 낭비                |
|                       |              | 단, 파라미터가 복잡한 경우 사용                    |
| Service -> Controller | Result DTO   | 서비스 결과를 그대로 전달                         |
| Controller -> FE      | Resposne DTO | Result DTO with Envelope Pattern            |

\`\`\`
 <FE> |  --- Request  DTO ---> | [Controller] |  --- Not use    ---> | [Service]
      | <--- Resposne DTO ---  |              | <--- Result DTO ---  |
\`\`\`
`;export{n as default};
