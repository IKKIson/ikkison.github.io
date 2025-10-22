# 개발환경

- [01 PostgreSQL](./03_setup_01_PostgreSQL.md)
- [02 SpringBoot](./03_setup_02_SpringBoot.md)
- [03 Logger](./03_setup_03_Logger.md)
- [04 Retrofit](./03_setup_04_Retrofit.md)
- [05 Swagger](./03_setup_05_Swagger.md)
- [06 SpringSecurity](./03_setup_06_SpringSecurity.md)
- [07 H2](./03_setup_07_H2.md)
- [08 JWT](./03_setup_08_JWT.md)
- [09 queryDSL](./03_setup_09_queryDSL.md)

## Logback

| Logback ver | SLF4J ver  | JDK ver                               | Enterprise Edition 의존성 (선택적 컴포넌트) | 상태 |
|-------------|------------|---------------------------------------|---------------------------------------|-----|
| 1.5.x (lts) | 2.0.x over | JDK 11 over (빌드 시 더 높은 버전 요구 가능) | Jakarta EE (jakarta.* 네임스페이스)      | 활발하게 개발 중 |
| 1.3.x       | 2.0.x over | JDK 8 over                            | Java EE (javax.* 네임스페이스)            | 더 이상 활발하게 개발되지 않음 |
| 1.2.x       | 1.x        | JDK 6 over                            | Java EE (javax.* 네임스페이스)            | 유지보수 중단 (사용 권장 안 함) |

## Dependecies

```kts
implementation("ch.qos.logback:logback-classic:1.5.20")
```

## 정리

- Java/JDK 버전: 사용 중인 Java 버전에 맞는 Logback 버전을 선택해야 합니다. 예를 들어, JDK 11 이상을 사용한다면 1.5.x 시리즈를 고려할 수 있습니다.

- SLF4J 버전: Logback은 SLF4J(Simple Logging Facade for Java)의 구현체입니다. Logback 버전과 SLF4J API 버전은 호환되어야 합니다.

    - SLF4J 2.0.x 이상을 사용한다면, Logback 1.3.x 또는 1.5.x 시리즈를 사용해야 합니다.

    - SLF4J 1.x 버전을 사용한다면 Logback 1.2.x 시리즈에 묶여 있을 가능성이 높으며, 이는 구 버전이므로 Spring Boot 3.x 이상을 사용한다면 SLF4J 2.x 및 Logback 1.3.x/1.5.x 이상으로 전부 업그레이드하는 것이 좋습니다.

- Spring Boot 사용 시: Spring Boot는 자체적으로 의존성 관리를 통해 호환되는 Logback 버전을 포함하고 있습니다.

    - Spring Boot 3.x 이상은 일반적으로 SLF4J 2.x 및 Logback 1.3.x 또는 1.4.x/1.5.x와 호환되도록 구성됩니다. 별도로 버전을 지정하지 않으면 Spring Boot가 권장하는 버전을 따르는 것이 가장 안정적입니다.

    - Spring Boot 2.x 이하는 일반적으로 SLF4J 1.x 및 Logback 1.2.x를 사용합니다.
