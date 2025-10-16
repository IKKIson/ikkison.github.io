const r=`# 개발환경 02 SpringBoot\r
\r
- [01 PostgreSQL](./03_개발환경_01_PostgreSQL.md)\r
- **02 SpringBoot**\r
- [03 SpringSecurity](./03_개발환경_03_SpringSecurity.md)\r
- [04 H2](./03_개발환경_04_H2.md)\r
- [05 queryDSL](./03_개발환경_05_queryDSL.md)\r
- [05 Retrofit](./03_개발환경_05_Retrofit.md)\r
- [05 Swagger](./03_개발환경_05_Swagger.md)\r
- [05 JWT](./03_개발환경_05_JWT.md)\r
\r
---\r
\r
## 🖥️ Tech Stack\r
\r
| list             | Spec |\r
|------------------|-------------|\r
| **IDE**          | IntelliJ by Jetbrain  |\r
| **JDK**          | Adoptium jdk-21.0.8.9-hotspot |\r
| **Spring Boot**  | 3.5.6 |\r
| **Language**     | Kotlin |\r
| **Build Tool**   | Gradle-Kotlin |\r
| **Packaging**    | Jar |\r
| **Dependencies** | Spring Web / Spring Security / Spring Data JPA / H2 Database / PostgreSQL Driver |\r
| | |\r
\r
---\r
\r
## start.spring.io\r
\r
- 프로젝트 생성을 위해 [start.spring.io](https://start.spring.io/) 에서 아래와 같이 설정하여 **[Generate] 버튼** 클릭\r
\r
![start_spring_io](./03_setup_02_SpringBoot/start_spring_io.png)\r
\r
---\r
\r
## 프로젝트 시작\r
\r
- IntelliJ 로 프로젝트를 열고 IntelliJ 가 Indexing / Setup 을 완료할 때까지 하도록 기다린다.\r
\r
![IntelliJ_ready](./03_setup_02_SpringBoot/IntelliJ_ready.png)\r
\r
---\r
\r
## 마치며\r
\r
- 이제 Spring Security 설정을 통해 개발, 배포 상황을 고려한 기본 설정을 진행할 것이다.\r
`;export{r as default};
