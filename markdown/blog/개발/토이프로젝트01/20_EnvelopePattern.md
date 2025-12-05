# 봉투패턴

## 일관성

- 프론트엔드에게 일관된 결과를 수신할 수 있게함.
- 모든 Response Body 포멧을 동일하게 하여 Service 및 Service 결과와 분리
- 기술적인 IPC 와 비즈니스 로직인 Serivce 결과를 별도로 분리

## 전략

- 400, 500 대 status code 와 같은 기술적인 약속보다는, FE-BE 가 함께 예외 서비스를 고려하여 작성

