# 개발환경 02 SpringBoot

- [01 PostgreSQL](./03_개발환경_01_PostgreSQL.md)
- **02 SpringBoot**
- [03 SpringSecurity](./03_개발환경_03_SpringSecurity.md)
- [04 H2](./03_개발환경_04_H2.md)
- [05 queryDSL](./03_개발환경_05_queryDSL.md)
- [05 Retrofit](./03_개발환경_05_Retrofit.md)
- [05 Swagger](./03_개발환경_05_Swagger.md)
- [05 JWT](./03_개발환경_05_JWT.md)

---

## 🖥️ Tech Stack

| list             | Spec |
|------------------|-------------|
| **IDE**          | IntelliJ by Jetbrain  |
| **JDK**          | Adoptium jdk-21.0.8.9-hotspot |
| **Spring Boot**  | 3.5.6 |
| **Language**     | Kotlin |
| **Build Tool**   | Gradle-Kotlin |
| **Packaging**    | Jar |
| **Dependencies** | Spring Web / Spring Security / Spring Data JPA / H2 Database / PostgreSQL Driver |
| | |

---

## start.spring.io

- 프로젝트 생성을 위해 [start.spring.io](https://start.spring.io/) 에서 아래와 같이 설정하여 **[Generate] 버튼** 클릭

![start_spring_io](./03_setup_02_SpringBoot/start_spring_io.png)

---

## 프로젝트 시작

- IntelliJ 로 프로젝트를 열고 IntelliJ 가 Indexing / Setup 을 완료할 때까지 하도록 기다린다.

![IntelliJ_ready](./03_setup_02_SpringBoot/IntelliJ_ready.png)

---

## 마치며

- 이제 Spring Security 설정을 통해 개발, 배포 상황을 고려한 기본 설정을 진행할 것이다.
