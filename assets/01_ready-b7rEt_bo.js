const r=`# 준비\r
\r
## 백엔드는 어떻게 공부할까?\r
\r
1. 요구사항을 데이터 모델링 하는 능력(ERD, Class Diagram)\r
    - 요구사항을 ERD, Class Diagram 으로 표현하고 그려야함.\r
    - 적절히 잘 모듈화해야함.\r
        - 한 class에 다때려박으면 추후 관리하기 불편함.\r
        - 네이밍 씹창나서 존나 길어김.\r
\r
2. DB를 능숙하게 다루는 능력.\r
    - 하이버네이트(JPA)\r
    - queryDSL\r
        - JPA가 동적 쿼리가 안됨. 필터같은거\r
        - JPA는 정적인것만 처리함.\r
        - where 2중 3중 같은거를 queryDSL가 잘한다.\r
    - 병행해서 JPA 기본 CRUD, queryDSL은 복잡한 필터 등을 이용한 search\r
    > mybatis 는 query를 low 영역에서 딥하게 쓸수 있음. old-legacy or 통계쪽에서 많이 쓸듯\r
\r
3. 프론트엔드를 고려해서 API를 짜는 능력\r
    - API문서화\r
        - swagger 같은 OpenAPI 는 필수\r
        - API 별로 에러코드 분명하고 디테일하게\r
        - Toss Error code 처럼은 옵션 (업무, 협업 상황 고려)\r
    - 피그마 같은 화면설계서를 보고\r
        - CRUD 같이 backend와 frontend가 어떤걸 주고 받게되는지 구상해야함.\r
        - 하나의 게시판 하나를 조회해도\r
            - 게시글 상세, 댓글 등등을 분리하는게 좋음.\r
            - 해당게시글의 댓글 상세 화면에서 조회할때 같은 API로 재사용가능.\r
\r
        \`\`\`text\r
        DDD 에서 해당 domain 의 Root를 이용해서 팔다리몸통 class들을 제어하고 외부에서 접근할 수 없게해야함.\r
        그리고 domain의 Root와 팔다리몸통을 설계할때 게시판(root)의 댓글(팔다리몸통) 처럼 무한정의 늘어나는 경우와 게시판(root)의 메타정보(팔다리몸통) 처럼 끽해야 10개도 안되는 instance 들을 구분해야함.\r
        무한정으로 늘어난 속성의 팔다리몸통들은 eager와 같이 root 조회시 한번에 가져올 필요도 없고 API를 해당부분을 나눠주고, 댓글전용/상세 게시판 같은 페이지가 있으면 분리한 API를 재사용할 수 있다.\r
        \`\`\`\r
\r
4. API를 추상화시켜 불필요한 중복 API를 만들지 않아야함.\r
    - 그리고 domain의 Root와 팔다리몸통을 설계할때 게시판(root)의 댓글(팔다리몸통) 처럼 무한정의 늘어나는 경우와 게시판(root)의 메타정보(팔다리몸통) 처럼 끽해야 10개도 안되는 instance 들을 구분해야함.\r
    - 무한정으로 늘어난 속성의 팔다리몸통들은 eager와 같이 root 조회시 한번에 가져올 필요도 없고 API를 해당부분을 나눠주고, 댓글전용/상세 게시판 같은 페이지가 있으면 분리한 API를 재사용할 수 있다.\r
    - 같은 댓글이여도 도메인이 다른 경우 "여행상품 댓글" + "게시판 댓글" 과 같은 경우는 서로 다른 API 이니까 각각 필요함.\r
    - 단, 위와 같이 한 도메인에서 같은 기능일뿐 댓글전용/상세 와같은 화면의 차이 이므로 추상화를 잘해서 재사용해야함.\r
\r
5. 클린코드 클린 아키텍쳐, DD 등을 통해 유지보수 가능한 코드를 구축하는 능력.\r
\r
    - S3 에 direct upload 같은 상황에서 api controller 를 domain 으로 묵지 안고 별도 api/ 디렉토리 구현\r
    - VO는 root entity 에서 1개여야함. List와 같이 여러개가 나올 수 없음.\r
        - id 가 있으면 entity, id 가 없으면 VO(왜냐, 1개만 있으니 ID가 필요없으니)\r
        - Entity 처럼 내부 func을 Root 에서 한번감싸면 되니까 외부에서 호출할 때 편해짐.\r
\r
## Spring 은 어떻게 공부할까?\r
\r
### Tech Stack\r
\r
- Spring Boot\r
- Kotlin\r
- Security\r
  - Spring Security(FWT, JWT, PasswordEncoder)\r
- DB\r
  - H2\r
  - JPA(하이버네이트), QueryDSL\r
  - PostgreSQL, MySQL 5 <-> MariaDB\r
  - MongoDB 는 IO 속도 때문에 채팅서버정도?\r
- API 호출\r
  - Retrofit server to server\r
- 리프레쉬 토큰은 나중에\r
\r
### Component\r
\r
- Backend 배포\r
  - AWS(유료), Cafe24, Gabia\r
  - Oracle(Free tier 무제한)\r
  - GCP(무제한 구림)\r
- Storage\r
  - Cloudflare\r
- DB\r
  - Neon DB(PostgreSQL를 통으로 사용할 수 있음, FullConnection)\r
  - Supabase(Serverless 라서 Spring 에서는 계속 붙어있어서 끊어져버리)\r
- Frontend\r
  - NextJS\r
  - Vercel : 무료 요금제, Serverless로 배포 (프로젝트 3개 까지?)\r
`;export{r as default};
