const r=`# 개발환경 Setup 02 SpringBoot\r
\r
- [01 PostgreSQL](./03_개발환경_01_PostgreSQL.md)\r
- [02 SpringBoot](./03_개발환경_02_SpringBoot.md)\r
- **03 SpringSecurity**\r
- [04 H2](./03_개발환경_04_H2.md)\r
- [05 queryDSL](./03_개발환경_05_queryDSL.md)\r
- [05 Retrofit](./03_개발환경_05_Retrofit.md)\r
- [05 Swagger](./03_개발환경_05_Swagger.md)\r
- [05 JWT](./03_개발환경_05_JWT.md)\r
\r
## SpringBoot\r
\r
### requestMatchers VS securityMatcher\r
\r
- 비교\r
\r
    | 구분 | requestMatchers | securityMatcher |\r
    |-----|-----------------|-----------------|\r
    | 주요 역할 | 권한 설정 (authorizeHttpRequests 블록 내) | SecurityFilterChain 적용 대상 지정 |\r
    | 사용 목적 | 특정 요청 경로에 접근 권한 (인증/인가)을 부여할 때 사용합니다. | 해당 필터 체인(Chain) | 이 작동할지 말지를 결정할 때 사용합니다. |\r
    | 적용 시점 | "이미 필터 체인이 요청을 처리하기로 결정한 이후에 | 인가 단계에서 작동합니다." | "요청이 들어오는 가장 초기에 | 어떤 SecurityFilterChain을 사용할지 결정할 때 작동합니다." |\r
    | Spring 6.1+ | authorizeHttpRequests 내부에서 필수적으로 사용됩니다. | **다중 SecurityFilterChain**을 구성할 때 주로 사용됩니다. (단일 체인에서는 생략 가능) |\r
\r
- requestMatchers 권한 설정\r
\r
    - requestMatchers는 요청 경로를 정의하고, 뒤따르는 .permitAll(), .hasRole("ADMIN"), .authenticated() 등을 통해 해당 경로에 대한 접근 규칙을 설정합니다.\r
\r
    \`\`\`kotlin\r
    @Bean\r
    fun apiSecurityFilterChain(http: HttpSecurity): SecurityFilterChain {\r
        http {\r
            // ... (CSRF, 세션 설정 등)\r
\r
            authorizeHttpRequests {\r
                // ① '/public/**' 경로는 인증 없이 누구나 접근 가능\r
                requestMatchers("/public/**").permitAll()\r
\r
                // ② '/admin/**' 경로는 'ADMIN' 역할을 가진 사용자만 접근 가능\r
                requestMatchers("/admin/**").hasRole("ADMIN")\r
\r
                // ③ 그 외 모든 요청은 인증만 필요\r
                requestMatchers("/**").authenticated() \r
            }\r
        }\r
        return http.build()\r
    }\r
    \`\`\`\r
\r
- securityMatcher 필터 체인 대상 지정\r
\r
    - securityMatcher는 요청이 들어왔을 때, 이 전체 SecurityFilterChain 자체가 적용되어야 할 대상 경로를 지정합니다.\r
    - 이 설정이 없으면 기본적으로 모든 요청에 해당 필터 체인이 적용됩니다.\r
    - **사용 시점**: 다중 SecurityFilterChain 구성\r
    - 프로젝트에 여러 종류의 보안 요구사항(예: API 인증, 웹 페이지 인증)이 있을 때, 각각 다른 필터 체인을 적용하기 위해 사용합니다.\r
\r
    - 사용 예시 (Kotlin DSL)\r
\r
        - 📝 시나리오:\r
        1. /api/** 경로는 Stateless (JWT) 인증을 사용해야 합니다.\r
        2. /web/** 경로는 Session-based (Form Login) 인증을 사용해야 합니다.\r
\r
        \`\`\`kotlin\r
        // 1. API용 SecurityFilterChain (높은 우선순위)\r
        @Bean\r
        @Order(1) // 이 체인을 먼저 검사하도록 순서 지정\r
        fun apiFilterChain(http: HttpSecurity): SecurityFilterChain {\r
            http {\r
                // 🔑 securityMatcher: /api/** 경로에만 이 필터 체인을 적용합니다.\r
                securityMatcher("/api/**") \r
                \r
                csrf { disable() } // API는 CSRF 비활성화\r
                sessionManagement { sessionCreationPolicy = SessionCreationPolicy.STATELESS } // 세션 미사용\r
                \r
                authorizeHttpRequests {\r
                    requestMatchers("/api/public").permitAll()\r
                    requestMatchers("/api/admin/**").hasRole("ADMIN")\r
                    requestMatchers("/api/**").authenticated()\r
                }\r
            }\r
            return http.build()\r
        }\r
\r
        // 2. Web용 SecurityFilterChain (기본 순서)\r
        @Bean\r
        fun webFilterChain(http: HttpSecurity): SecurityFilterChain {\r
            http {\r
                // securityMatcher가 없으면, 위의 Chain에 걸리지 않은 나머지 모든 요청에 기본 적용됩니다.\r
                // 혹은 명시적으로 securityMatcher("/**")를 지정할 수도 있습니다.\r
                \r
                csrf { } // 웹 환경이므로 CSRF 활성화 (기본값)\r
                formLogin { // 폼 로그인 설정\r
                    permitAll()\r
                }\r
                \r
                authorizeHttpRequests {\r
                    requestMatchers("/web/login", "/web/register").permitAll()\r
                    requestMatchers("/web/**").authenticated()\r
                }\r
            }\r
            return http.build()\r
        }\r
        \`\`\`\r
\r
        - /api/users로 요청이 오면, apiFilterChain의 securityMatcher("/api/**")에 의해 첫 번째 체인이 선택됩니다.\r
        - /web/home으로 요청이 오면, 첫 번째 체인에 걸리지 않으므로 두 번째 체인이 선택되어 폼 로그인이 적용됩니다.\r
`;export{r as default};
