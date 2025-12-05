# Entity Id

## Long Type 과 UUID V7 의 차이

### Long (IDENTITY)
- 생성 위치
  - Long Type Entity id의 생성 주체는 데이터베이스이다.
  - IDENTITY 전략은 DB가 다음 번호를 자동으로 할당하도록 지시한다.
    ```kt
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    var id: Long? = null
    ```
  - MySQL의 AUTO_INCREMENT, PostgreSQL의 SERIAL

- 생성 시점
  - 엔티티 객체가 생성될 때는 ID가 null
  - 실제 DB에 INSERT 쿼리를 실행한 직후에 ID가 채워진다
    ```kt
    @Transactional
    fun signUp(email: String, password: String): SignUpResult {
        // ...
        val member = Member.signUp(email, password) // id == null
        member.hashPassword(passwordEncoder)
        memberRepository.save(member) // <- !!! id == 1L
        // ...
    }
    ```
  - 즉, DB에 Insert 하는 시점에 생성되므로 내부적으로 select를 하는 것이다.

- 결과
  - ID를 사용하려면 DB 저장이 완료될 때까지 기다려야 한다.
  - 엔티티 객체를 생성하자마자 **ID를 활용한 비즈니스 로직**(예: 다른 객체와의 관계 설정)을 수행할 수 없다.

### UUID V7
- 생성 위치
  - 애플리케이션 (Kotlin 코드의 생성자 또는 초기화 블록)
    ```kt
    @Transactional
    fun signUp(email: String, password: String): SignUpResult {
        // ...
        val member = Member.signUp(email, password) // id == null
        member.hashPassword(passwordEncoder)
        memberRepository.save(member) // <- !!! id == 1L
        // ...
    }
    ```

- 생성 시점
  - 엔티티 객체가 메모리에서 생성되는 즉시 ID가 할당
  - DB 저장과 관계없이 ID를 사용 가능

- 결과
  - ID가 UUID 타입으로 Non-nullable
  - 객체 생성 시점부터 ID를 활용한 비즈니스 로직(예: 캐싱, 도메인 이벤트 발행)을 안전하게 수행 가능

---
