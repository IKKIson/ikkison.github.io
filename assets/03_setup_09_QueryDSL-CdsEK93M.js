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

## QueryDSL

- JPA 와 Specification 은 복잡한 조건의 select query를 다루기 어렵다.
- 저 같은 경우에 sql을 직접 때려 박는 하드코딩을 굉장히 지양하고 기피하기에 JPA와 Specification 보다 자유도와 표현력이 좋은 라이브러리를 찾을 필요가 있다.

## Setup

\`\`\`kts
// build.gradle.kts

plugins {
    // ... 생략 ...
    kotlin("kapt") version "1.9.25"
    // QueryDSL 사용을 위한 kapt(Kotlin annotation processing) 플러그인 추가
    // jvm, plugin.spring, plugin.jpa 와 같은 버전으로 명시
}

dependencies {
    // ... 생략 ...

    // QueryDSL - JPA 구현체 (runtime 시 필요)
    implementation("com.querydsl:querydsl-jpa:5.1.0:jakarta")
    // QueryDSL - APT (Annotation Processor Tool)
    // 컴파일 시점에 QClass(정적 타입)를 생성하는 데 필요
    kapt("com.querydsl:querydsl-apt:5.1.0:jakarta")
    // QueryDSL - QClass 생성 시 필요한 JPA API 의존성
    // Spring Boot 3.x 기준
    kapt("jakarta.persistence:jakarta.persistence-api")
    kapt("jakarta.annotation:jakarta.annotation-api")

    // ... 생략 ...
}

// ... 생략 ...

////////////////////////
////    QueryDSL    ////
////////////////////////
// (QueryDSL 설정부 - start)
val generated = file("src/main/generated")
// QueryDSL QClass 파일 생성 위치를 지정
tasks.withType<JavaCompile> {
    options.generatedSourceOutputDirectory.set(generated)
}
// kotlin source set 에 QueryDSL QClass 위치 추가
sourceSets {
    main {
        // opt 1
        kotlin.srcDirs += generated

        // opt 2 - build/ 에 생성할 경우.
//        kotlin {
//            srcDir(layout.buildDirectory.dir("generated/source/kapt/main"))
//        }

        // opt 3 - not use
//        sourceSets["main"].withConvention(org.jetbrains.kotlin.gradle.plugin.KotlinSourceSet::class) {
//            kotlin.srcDir("build/generated/querydsl")
//        }

    }
}

// gradle clean 시에 QClass 디렉토리 삭제
tasks.named("clean") {
    doLast {
        generated.deleteRecursively()
    }
}

//kapt {
//    generateStubs = true
//}
// (QueryDSL 설정부 - end)

// ... 생략 ...

\`\`\`

---

## 마치며

- 나는 JVM 기반 언어의 라이브러리를 추가할때, 공식홈페이지, 공식Github, Maven Repository를 찾아보는 것을 좋아한다.
- QueryDSL 을 Maven Repository를 검색해보니 취약점이 단한번도 없었던 적이 없다....
- 16년 이후에는 패치 주기가 길어진것도 그렇고 취약점도 그렇고 Spring이라는 거대한 생태계에서 이렇게 편한 라이브러리가 이러한 상황에 놓인 것이 아쉽다.
`;export{n as default};
