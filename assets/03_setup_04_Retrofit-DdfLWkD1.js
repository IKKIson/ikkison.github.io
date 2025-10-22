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

## Server also Client?

- Java, Koltin 에서 HTTP IPC를 하기위해 여러 Client 들을 사용하게된다.
- Spring의 경우 백엔드 서버로써 Service를 Serving 하지만, Service, 프로세스 시나리오 상 Server To Server 로 정보를 요청을 하는 입장이 될 수 도 있다.
- 즉, Spring이 Server 가 아닌 Client가 되어야한다.

## Hello, Retrofit

- Retrofit 은 모바일 개발 생태계에서 활발하게 활동하는 Square 사 에서 개발한 라이브러리 입니다.
- Java와 Android 위한 **"type-safe HTTP client"** 로 등장하였습니다.
- 특징
  - 타입 안정성: 인터페이스를 정의하여 HTTP API를 쉽고 빠르게 개발 가능하고, 컴파일 시점에서 오류를 잡아낼 수 있습니다.
  - 간결성
    - HTTP Request, Response를 처리하는 복잡한 과정을 추상화하여, 개발자가 더 적은 코드로 API 통신을 구현할 수 있게 합니다.
    - 복잡한 AsyncTask나 HttpURLConnection 대신 인터페이스 선언만으로 네트워크 통신을 처리할 수 있게 해주어 개발의 간결성을 극대화했습니다.
  - RESTful API 지원: RESTful 웹 서비스와 간편하게 통신하도록 설계되었습니다.
  - JSON/XML 변환 지원: Gson, Jackson, Moshi 등 변환기 라이브러리를 함께 사용하여 JSON이나 XML 데이터를 자바/코틀린 객체로 자동 변환해줍니다.
  - OkHttp 기반
    - 내부적으로 OkHttp 라이브러리를 활용하여 실제 네트워크 요청을 처리합니다.
    - OkHttp 역시 Square 에서 개발한 라이브러리로 JVM 기반의 강력하고 유연한 HTTP 클라이언트 라이브러리입니다.
  - 모바일
    - 안드로이드 개발 시 네트워크 통신을 비동기 처리와 간결성으로 개발 시 최적화된 라이브러리입니다.
  - 백엔드
    - 이후 코틀린이 Spring Boot 같은 백엔드에서 사용되며, 코루틴(suspend fun) 지원으로 MSA 간 통신이나 외부 HTTP 연동 시 강력한 대안이 되었습니다.

---

## HttpClients for Spring

| 특징 | Retrofit | Spring WebClient | Spring RestClient |
|-----|-----------|-----------------|-------------------|
| 개발 스타일    | "선언적 인터페이스 (@GET, @POST 애너테이션 사용)" | 유창한 체이닝 API (Fluent API)                      | 유창한 체이닝 API (Fluent API) |
| 비동기 지원    | Kotlin Coroutines (suspend)                  | "Reactive Streams (Mono, Flux)"                   | Blocking (기본) / Coroutines (별도 확장) |
| 기반 클라이언트 | OkHttp (뛰어난 성능과 인터셉터)                 | "Reactor Netty, Jetty 등"                         | "OkHttp, Apache HttpClient 등" |
| 주요 장점      | "코드 간결성, 타입 안전성, 코루틴과의 쉬운 통합"   | "리액티브 프로그래밍에 최적화, Spring 생태계 통합 용이" | "RestTemplate의 후속작, 간단한 동기 호출에 적합" |
| | | | |

---

## 의존성 추가와 호환

- 우선, 제가 사용할 Retrofit 의존성은 4가지입니다.

\`\`\`kts
// ========================
// ====    Retrofit    ====
// ========================
// core
implementation("com.squareup.retrofit2:retrofit:2.11.0")
// Jackson converter
implementation("com.squareup.retrofit2:converter-jackson:2.
11.0")
// okhttp
implementation("com.squareup.okhttp3:okhttp:4.12.0")
// coroutines
implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")

\`\`\`

### Retrofit 과 Kotlin

- Retrofit 공식 홈페이지나 Github Release 에는 모든 버전의 Kotlin/Retrofit/OkHttp 호환성을 정리한 공식 정보는 없습니다.

- 널리 사용되는 버전은 Retrofit(2.9.0) 입니다.

    ![mvnrepo_retrofit](./03_setup_04_Retrofit/mvnrepo_retrofit.png)

  - 그러나, Retrofit(2.9.0)은 2020년에 커밋된 버전이먀, **2.9.0** 의 의존성에서 **보안 취약점**이 발견되어있습니댜.

    ![mvnrepo_retrofit](./03_setup_04_Retrofit/mvnrepo_retrofit_2.9.0_01.png)

    ![mvnrepo_retrofit](./03_setup_04_Retrofit/mvnrepo_retrofit_2.9.0_02.png)

- 2025년 9월 기준으로 이후 버전에서는 보안 취약점이 보고되지 않은 상태 발견되지 않았습니다.

- 어떤 의존성이든 지속적인 확인은 필수 있습니다.

### sequare의 retrofit

- retrofit core와 retrofit을 위해 sequare에서 배포한 Jackson, Gson 등은 서로 같은 버전으로 의존성을 추가하면됩니다.

  \`\`\`kt
  // Retrofit core
  implementation("com.squareup.retrofit2:retrofit:2.12.0")

  // Retrofit Jackson JSON 컨버터
  implementation("com.squareup.retrofit2:converter-jackson:2.12.0")
  \`\`\`

### Coroutines

- Retrofit 2.6.0 부터 suspend 함수를 직접 지원하기에 별도의 코루틴 의존성을 추가하지 않고 Kotlin Coroutines 버전과의 호환성만 주의하면 됩니다.
  - 추가 안함 : retrofit-kotlin-coroutines-adapter
  - 확인 필요 : kotlinx-coroutines-core

- 예를 들어 [kotlinx-coroutines-core releases 1.8.0](https://github.com/Kotlin/kotlinx.coroutines/releases) 과 같이 릴리스 페이지에서는 버전별로 호환성이 정리되어 있지 않고, 코틀린 버전 업데이트를 간단하게 언급하고 있습니다.

    \`\`\`text
    1.8.0
    ...
    Major Kotlin version update: was 1.8.20, became 1.9.21
    ...
    \`\`\`

- 1.8.1 같이 kotlin 버전을 언급이 없는 태그도 있네요.

### OkHttp

- Retrofit 내부에서 OkHttp 라는 HTTP 클라이언트를 사용합니다.
- Spring 공식 클라이언트(WebClient, RestClient)가 제공하는 것 이상의 세밀한 제어 및 확장성을 제공합니다.

  - 인터셉터 (Interceptors): OkHttp의 인터셉터 메커니즘을 사용하여 로깅, 인증(OAuth/JWT 토큰 주입), 캐싱, 헤더 추가 등의 공통 로직을 매우 쉽게 처리할 수 있습니다. 이는 마이크로서비스 간 통신에서 인증 토큰을 일괄적으로 처리하거나, 상세 로깅이 필요할 때 매우 유용합니다.

  - 다양한 컨버터 지원: JSON (Jackson, Moshi, Gson), XML 등 다양한 데이터 형식을 위한 컨버터 라이브러리를 공식적으로 지원합니다.

- Retrofit에서 사용하는 OkHttp 의 버전 역시 정리되어 있지 않고, 간단하게 언급하고 있네요.
  - [retrofit releases 3.0.0](https://github.com/square/retrofit/releases)

    \`\`\`text
    3.0.0
    Changed
    - Upgrade to OkHttp 4.12 (from 3.14).
    ...
    \`\`\`

---
`;export{n as default};
