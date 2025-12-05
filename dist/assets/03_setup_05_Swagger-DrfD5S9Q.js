const n=`# 개발환경

- [01 PostgreSQL](./03_setup_01_PostgreSQL.md)
- [02 SpringBoot](./03_setup_02_SpringBoot.md)
- [03 Logger](./03_setup_03_Logger.md)
- [04 Retrofit](./03_setup_04_Retrofit.md)
- [05 Swagger](./03_setup_05_Swagger.md)
- [06 SpringSecurity](./03_setup_06_SpringSecurity.md)
- [07 H2](./03_setup_07_H2.md)
- [08 JWT](./03_setup_08_JWT.md)
- [09 queryDSL](./03_setup_09_queryDSL.md)

## SpringDoc

- spring-boot3 부터는 springdoc-openapi 버전 2를 사용해야합니다.
  - springdoc-openapi 버전이 맞지 않는 경우(springdoc-openapi v1.x)
  \`\`\`java
  Failed to introspect Class [org.springdoc.webmvc.api.OpenApiWebMvcResource] from ClassLoader [jdk.internal.loader.ClassLoaders$AppClassLoader
  \`\`\`

## Depedencies

\`\`\`kts
implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.11")
implementation("org.springdoc:springdoc-openapi-starter-webmvc-api:2.8.11")
implementation("org.springframework.boot:spring-boot-starter-validation")
\`\`\`

## Spring Security

-  .requestMatchers("/swagger-ui/**").permitAll()
    -  /swagger-ui/index.html 접속 하용

- .requestMatchers("/v3/api-docs/**").permitAll()
    - swagger web ui 는 접속하였으나 Spring Security에서 접근할 수 없도록 막기 때문에 API가 보이지 않으므로 추가.


\`\`\`kt
    .requestMatchers(
        "/swagger-ui/**",
        "/v3/api-docs/**",
    ).permitAll()
\`\`\``;export{n as default};
