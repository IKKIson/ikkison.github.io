const n=`# 개발환경 Setup 02 SpringBoot

- [01 PostgreSQL](./03_setup_01_PostgreSQL.md)
- [02 SpringBoot](./03_setup_02_SpringBoot.md)
- [03 Logger](./03_setup_03_Logger.md)
- [04 Retrofit](./03_setup_04_Retrofit.md)
- [05 Swagger](./03_setup_05_Swagger.md)
- [06 SpringSecurity](./03_setup_06_SpringSecurity.md)
- [07 H2](./03_setup_07_H2.md)
- [08 JWT](./03_setup_08_JWT.md)
- [09 queryDSL](./03_setup_09_queryDSL.md)

## SpringBoot

### requestMatchers VS securityMatcher

- 비교

    | 구분 | requestMatchers | securityMatcher |
    |-----|-----------------|-----------------|
    | 주요 역할 | 권한 설정 (authorizeHttpRequests 블록 내) | SecurityFilterChain 적용 대상 지정 |
    | 사용 목적 | 특정 요청 경로에 접근 권한 (인증/인가)을 부여할 때 사용합니다. | 해당 필터 체인(Chain) | 이 작동할지 말지를 결정할 때 사용합니다. |
    | 적용 시점 | "이미 필터 체인이 요청을 처리하기로 결정한 이후에 | 인가 단계에서 작동합니다." | "요청이 들어오는 가장 초기에 | 어떤 SecurityFilterChain을 사용할지 결정할 때 작동합니다." |
    | Spring 6.1+ | authorizeHttpRequests 내부에서 필수적으로 사용됩니다. | **다중 SecurityFilterChain**을 구성할 때 주로 사용됩니다. (단일 체인에서는 생략 가능) |

- requestMatchers 권한 설정

    - requestMatchers는 요청 경로를 정의하고, 뒤따르는 .permitAll(), .hasRole("ADMIN"), .authenticated() 등을 통해 해당 경로에 대한 접근 규칙을 설정합니다.

    \`\`\`kotlin
    @Bean
    fun apiSecurityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http {
            // ... (CSRF, 세션 설정 등)

            authorizeHttpRequests {
                // ① '/public/**' 경로는 인증 없이 누구나 접근 가능
                requestMatchers("/public/**").permitAll()

                // ② '/admin/**' 경로는 'ADMIN' 역할을 가진 사용자만 접근 가능
                requestMatchers("/admin/**").hasRole("ADMIN")

                // ③ 그 외 모든 요청은 인증만 필요
                requestMatchers("/**").authenticated() 
            }
        }
        return http.build()
    }
    \`\`\`

- securityMatcher 필터 체인 대상 지정

    - securityMatcher는 요청이 들어왔을 때, 이 전체 SecurityFilterChain 자체가 적용되어야 할 대상 경로를 지정합니다.
    - 이 설정이 없으면 기본적으로 모든 요청에 해당 필터 체인이 적용됩니다.
    - **사용 시점**: 다중 SecurityFilterChain 구성
    - 프로젝트에 여러 종류의 보안 요구사항(예: API 인증, 웹 페이지 인증)이 있을 때, 각각 다른 필터 체인을 적용하기 위해 사용합니다.

    - 사용 예시 (Kotlin DSL)

        - 📝 시나리오:
        1. /api/** 경로는 Stateless (JWT) 인증을 사용해야 합니다.
        2. /web/** 경로는 Session-based (Form Login) 인증을 사용해야 합니다.

\`\`\`kotlin
        
@Configuration     // 이 클래스가 구성 정보를 담고 있음을 나타냄
@EnableWebSecurity // Spring Security 활성화, 웹 보안 설정 가능하게함.
class SecurityConfig {

    /**
     * 1. SecurityFilterChain Bean 정의
     * - 보안 필터 체인 설정
     * - SecurityFilterChain은 여러 개일 수 있음
     *     - @Order(n) 어노테이션을 이용하여 실행되는 SecurityFilterChain의 순서를 지정할 수 있
     *     -
     * - TODO : Throws 필요없나? (authorizeRequests/authorizeHttpRequests)
     */
    @Bean
    fun securityFilterChain(http: HttpSecurity, corsConfigurationSource: CorsConfigurationSource): SecurityFilterChain {
        http
            // H2 콘솔용 프레임 옵션 비활성화
            // H2 콘솔이 iframe 내에서 작동하도록 허용
            .headers {
                it.frameOptions { opt ->
                    opt.disable()
                    opt.sameOrigin()
                }
            }

            // (1) CSRF 보호 비활성화
            // - API 서버 / Stateless API에서 일반적으로 비활성화
            // - csrf() : Deprecated - 삭제예정, 7부터 없어짐
            .csrf {
                it.disable()
                it.ignoringRequestMatchers("/h2-console/**")
            }

            // (2) 요청 권한 설정
            // - authorizeRequests, authorizeRequests()
            //     - Deprecated - 삭제예정, 7부터 없어짐
            //     - authorizeHttpRequests 대체
            // - antMatchers : 경로 패턴에 일치하면 요청을 처리할 수 있음
            // - mvcMatchers
            //     - Spring MVC 컨트롤러에 매핑되는 URL 패턴과 유사하게 동작
            //     - antMatchers와 비슷
            //     - 스프링 MVC의 패턴 기능을 더 많이 활용할 수 있어 특정 HTTP 메서드에 대한 접근을 제한하고 싶을 때
            // - requestMatchers
            //     - 요청 매처(request matcher)를 사용하여 요청을 매칭
            //     - 좀 더 유연한 매칭이 가능
            //     - 특정한 http 메서드 (GET, POST 등)나 특정한 요청 파라미터 등을 고려하여 매칭할 수 있음
            //     -  HttpServletRequestMatcher 객체를 인자로 받음
            // - securityMatchers :
            //     - 특정 자원 보호가 필요한 경로
            //     - 클라이언트 요청을 최초 필터링
            //     - 지정한 경로패턴 이외에는 요청 무시
            //     - AntPathRequestMatcher, MvcRequestMatcher 등의 구현체를 사용 가능
            // - requestMatchers vs securityMatchers
            //     - securityMatcher 로 특정한 경로로만 보안기능을 작동하도록 한 다음 이 경로안에서 보안심사를 하고자 할 때 requestMatcher 를 사용
            //     - SecurityFilterChain은 여러 개일 수 있음
            //     - @Order(n) 어노테이션을 이용하여 실행되는 SecurityFilterChain의 순서를 지정할 수 있고, requestMatcher에서 더 좁은 범위를 먼저 선언하는 것처럼 더 좁은 범위의 SecurityFilterChain을 먼저 선언하지 않으면 사용자의 의도대로 실행되지 않음
            // - TODO : hasRole 별도의 RoleEnum 를 만들면 어떻게 쓰면될까?
            .authorizeHttpRequests { auth ->
                auth
                    // '/public/**' 경로는 인증 없이 누구나 접근 가능
                    // - 예: 로그인, 회원가입 등 인증 불필요 경로
                    // - TODO : permit 수준별로 별도로 관리안되나? api/controller 랑 묶어서...
                    // - TODO : properties 별로 uri 목록 제어 가능한가?
                    .requestMatchers(
                        "/public/**",
                        "/swagger-ui/**",  // openapi - swagger
                        "/v3/api-docs/**", // openapi
                        "/api/auth/**",
                        "/h2-console/**", // H2
                        "/health",
                        "/error"
                    ).permitAll()
                    // .requestMatchers("/").permitAll()

                    // external api by retrofit
                    .requestMatchers("/ext/jph/**").permitAll()

                    // '/admin/**' 경로는 'ADMIN' 역할을 가진 사용자만 접근 가능
                    // .requestMatchers("/admin/**").hasRole("ADMIN")

                    // 그 외 모든 요청은 인증만 필요
                    // .requestMatchers("/**").authenticated()
                    .anyRequest().authenticated()
            }
            
            // CORS 설정
            // TODO : 공부해야됨
//            .cors { it.configurationSource(corsConfigurationSource()) }

            // (3) 폼 기반 로그인 설정 (기본 로그인 페이지 사용 시)
//            .formLogin {
//                // 커스텀 로그인 페이지 설정 (필요에 따라)
//                // .loginPage("/login")
//                // .permitAll()
//                it.disable() // 예시로 폼 로그인을 비활성화
//            }

            // (4) HTTP Basic 인증 설정
            // HTTP Basic 인증 비활성화
            // .httpBasic()
//          // .httpBasic(HttpBasicConfigurer::disable)

            // (5) 세션 관리 설정
            // .sessionManagement { sessionCreationPolicy = SessionCreationPolicy.STATELESS }

            // (etc)
            // 사용자 상세 정보 로드 : UserDetailsService)
            // 인증 방식(JWT, OAuth2 등)
        return http.build()
    }

    /**
     * 2. PasswordEncoder Bean 정의
     * 암호 인코더 설정
     */
    @Bean
    fun passwordEncoder(): PasswordEncoder {
        // BCrypt 해싱 사용
        return BCryptPasswordEncoder()
    }
}
\`\`\`

        - /api/users로 요청이 오면, apiFilterChain의 securityMatcher("/api/**")에 의해 첫 번째 체인이 선택됩니다.
        - /web/home으로 요청이 오면, 첫 번째 체인에 걸리지 않으므로 두 번째 체인이 선택되어 폼 로그인이 적용됩니다.
`;export{n as default};
