const r=`# 개발환경 Setup 01 PostgreSQL\r
\r
- **01 PostgreSQL**\r
- [02 SpringBoot](./03_개발환경_02_SpringBoot.md)\r
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
| list                | Spec |\r
|---------------------|-------------|\r
| **IDE**             | DataGrip |\r
| **Container**       | Docker |\r
| **Trusted content** | Docker Official Image |\r
| **Image Name**      | postgres |\r
| **Image Tag**       | 16 |\r
| | |\r
\r
---\r
\r
## PostgreSQL Docker Overview\r
\r
- Docker를 이용하여 PostgreSQL 을 사용\r
\r
- [Docker Hub](https://hub.docker.com/) 에서 PostgreSQL Docker Official Image 사용\r
\r
1. Docker Hub Search PostgreSQL\r
\r
    ![search_postgre_img](./03_setup_01_PostgreSQL/search_postgre_img.png)\r
\r
2. Docker Offical Image\r
\r
    ![select_postgre_img](./03_setup_01_PostgreSQL/select_postgre_img.png)\r
\r
3. Docker Offical Image\r
\r
    - Offical 이미지를 클릭\r
    - [PostgreSQL Docker Offical Image Page](https://hub.docker.com/_/postgres)\r
    - 해당 페이지에서 Docker 실행 방법과 계정 기본 설정, 환경 설정 등이 설명되어 있으니 상황에 맞게 사용.\r
\r
    ![select_postgre_img](./03_setup_01_PostgreSQL/overview_postgre_img.png)\r
\r
---\r
\r
## Docker Script\r
\r
- 아래의 스크립트는 실제로 사용하는 저의 스크립트의 기본 형태입니다.\r
- 자주 사용하는 형태를 스크립트로 만들어 재사용하고 있습니다.\r
- 최소 동작가능한 중요한 스크립트 내용만 설명하고 있으니, 입맛대로 자유롭게 변경해가며 사용하면 됩니다.\r
\r
1. 이미지 받기\r
\r
    \`\`\`shell\r
    #!/bin/bash\r
\r
    DOCKER_IMAGE_NAME=postgres\r
    DOCKER_IMAGE_TAG="16"\r
\r
    # 이미지 받기\r
    docker pull \${DOCKER_IMAGE_NAME}:\${DOCKER_IMAGE_TAG}\r
\r
    # 이미지 목록 확인\r
    docker images\r
    \`\`\`\r
\r
2. 도커 실행\r
\r
    \`\`\`shell\r
    #!/bin/bash\r
\r
    DOCKER_IMAGE_NAME=postgres\r
    DOCKER_IMAGE_TAG="16"\r
\r
    DOCKER_CONTAINER_NAME=\${DOCKER_IMAGE_NAME}_\${DOCKER_IMAGE_TAG}\r
    DOCKER_CONTAINER_NAME=\${DOCKER_CONTAINER_NAME//-/"."} # 버전에 "." 혹은 "-" 이 포함된 문자열이면 제거\r
\r
    LOG_DRIVER=none     # none, json-file, syslog, journald, gelf, fluentd, awslogs, splunk, etwlogs, gcplogs\r
    LOG_OPT_MAX_SIZE=1m # 각 로그 파일 최대 크기\r
    LOG_OPT_MAX_FILE=1  # Rotate, 최대 로그 파일 개수\r
\r
    HOST_PORT=5432      # 포트포워딩 : Host Post\r
    CONTAINER_PORT=5432 # 포트포워딩 : Guest Post\r
    TIMEZONE=Asia/Seoul # Container OS's TZ\r
    POSTGRES_PASSWORD=P@ssw0rd # postgres 비밀번호\r
    # POSTGRES_CONF : /var/lib/postgresql/data/postgresql.conf\r
    HOST_DATA=./data                       # container에 저장되는 postgre 데이터 공유\r
    POSTGRES_DATA=/var/lib/postgresql/data # container에 저장되는 postgre 데이터 공유\r
\r
    RUN_OPT=""\r
    RUN_OPT=\${RUN_OPT}" --rm" # container stop 시 container 자동 삭제\r
    RUN_OPT=\${RUN_OPT}" -d" # container daemon(-d) / foreground(-it)\r
    RUN_OPT=\${RUN_OPT}" --cidfile .container_id" # container id 값을 ".container_id" 파일로 저장하여 stop/exec 등 해당 container 작업 시 용이\r
\r
    # PostgreSQL 도커 실행\r
    docker run $RUN_OPT \\\r
        --log-driver \${LOG_DRIVER} \\\r
        --name \${DOCKER_CONTAINER_NAME} \\\r
        -p \${HOST_PORT}:\${CONTAINER_PORT} \\\r
        -e TZ=\${TIMEZONE} \\\r
        -e POSTGRES_PASSWORD=\${POSTGRES_PASSWORD} \\\r
        -v \${HOST_DATA}:\${POSTGRES_DATA} \\\r
        \${DOCKER_IMAGE_FULL_NAME}\r
\r
    # !!! 주의 !!!\r
    # --log-driver 가 none 인경우 --log-opt 를 사용하면 안됩니다.\r
    # none 아닌 경우에만 추가합니다.\r
    # --log-opt max-size=\${LOG_OPT_MAX_SIZE} \\\r
    # --log-opt max-file=\${LOG_OPT_MAX_FILE} \\\r
\r
    # 실행 중인 container 확인\r
    docker ps\r
\r
    # 전체 container 확인\r
    docker ps -a\r
\r
    # PostgreSQL도커 container id 가 저장되었는지 확인\r
    cat ./container_id\r
\r
    \`\`\`\r
\r
    - **--log-driver** 가 **none** 인 이유\r
        - 저는 container 안에서 실행되는 실제 서버/프로세스의 로그를 **-v** 옵션으로 Host 와 공유하여 관리하는 것을 선호합니다.\r
        - **--log-opt**의 경우 예시 설명을 위해 굳이 추가하였습니다.\r
        - **--log-driver** 값을 판단해 **RUN_OPT** 에 **--log-opt** 들을 자동으로 append 할 수 있지만, 현재 포스팅 의도와 크게 벗어나는 내용이므로 제외합니다.\r
    - HOST_DATA, POSTGRES_DATA\r
        - HOST_DATA 와 POSTGRES_DATA 를 공유하여 Container가 바뀌거나 이관/통합 등의 상황에서 실제 저장된 data들을 그대로 사용하기 위해 -v 옵션으로 공유하여 Host에서 관리할 수 있도록 합니다.\r
        - 데이터 뿐만 아니라 PostgreSQL서버의 설정파일 역시 위에 POSTGRES_DATA 경로에 저장됩니다.\r
            - postgresql.conf 경로 : /var/lib/postgresql/data/postgresql.conf\r
\r
3. 도커 중지\r
\r
    \`\`\`shell\r
    #!/bin/bash\r
\r
    DOCKER_IMAGE_NAME=postgres\r
    DOCKER_IMAGE_TAG="16"\r
\r
    DOCKER_CONTAINER_NAME=\${DOCKER_IMAGE_NAME}_\${DOCKER_IMAGE_TAG}\r
    DOCKER_CONTAINER_NAME=\${DOCKER_CONTAINER_NAME//-/"."}\r
\r
    # is exists .container_id file\r
    if [ ! -f "./.container_id" ]; then\r
        echo ".container_id 파일을 찾을 수 없습니다. 컨테이너가 실행 중인지 확인하세요?"\r
        docker ps --filter "name=\${DOCKER_CONTAINER_NAME}" --format "table {{.ID}}\\t{{.Names}}\\t{{.Status}}" \r
        exit 1\r
    fi\r
\r
    # is empty .container_id file\r
    CONTAINER_ID=$(cat "./.container_id")\r
    if [ -z "\${CONTAINER_ID}" ]; then\r
        echo ".container_id 파일에 값이 없습니다. 컨테이너가 실행 중인지 확인하세요?"\r
        docker ps --filter "name=\${DOCKER_CONTAINER_PREFIX_NAME}" --format "table {{.ID}}\\t{{.Names}}\\t{{.Status}}" \r
        exit 1\r
    fi\r
\r
    # Container 중지\r
    docker stop \${CONTAINER_ID}\r
\r
    docker ps\r
\r
    docker ps -a\r
    \`\`\`\r
\r
4. 도커 컨테이너 진입(/bin/bash 터미널 접속)\r
\r
    \`\`\`shell\r
    #!/bin/bash\r
\r
    DOCKER_IMAGE_NAME=postgres\r
    DOCKER_IMAGE_TAG="16"\r
\r
    DOCKER_CONTAINER_NAME=\${DOCKER_IMAGE_NAME}_\${DOCKER_IMAGE_TAG}\r
    DOCKER_CONTAINER_NAME=\${DOCKER_CONTAINER_NAME//-/"."}\r
\r
    # is exists .container_id file\r
    if [ ! -f "./.container_id" ]; then\r
        echo ".container_id 파일을 찾을 수 없습니다. 컨테이너가 실행 중인지 확인하세요?"\r
        docker ps --filter "name=\${DOCKER_CONTAINER_NAME}" --format "table {{.ID}}\\t{{.Names}}\\t{{.Status}}" \r
        exit 1\r
    fi\r
\r
    # is empty .container_id file\r
    CONTAINER_ID=$(cat "./.container_id")\r
    if [ -z "\${CONTAINER_ID}" ]; then\r
        echo ".container_id 파일에 값이 없습니다. 컨테이너가 실행 중인지 확인하세요?"\r
        docker ps --filter "name=\${DOCKER_CONTAINER_PREFIX_NAME}" --format "table {{.ID}}\\t{{.Names}}\\t{{.Status}}" \r
        exit 1\r
    fi\r
\r
    docker exec -it \${CONTAINER_ID} /bin/bash\r
    \`\`\`\r
\r
5. 도커 컨테이너 로그\r
\r
    \`\`\`shell\r
    #!/bin/bash\r
\r
    DOCKER_IMAGE_NAME=postgres\r
    DOCKER_IMAGE_TAG="16"\r
\r
    DOCKER_CONTAINER_NAME=\${DOCKER_IMAGE_NAME}_\${DOCKER_IMAGE_TAG}\r
    DOCKER_CONTAINER_NAME=\${DOCKER_CONTAINER_NAME//-/"."}\r
\r
    # is exists .container_id file\r
    if [ ! -f "./.container_id" ]; then\r
        echo ".container_id 파일을 찾을 수 없습니다. 컨테이너가 실행 중인지 확인하세요?"\r
        docker ps --filter "name=\${DOCKER_CONTAINER_NAME}" --format "table {{.ID}}\\t{{.Names}}\\t{{.Status}}" \r
        exit 1\r
    fi\r
\r
    # is empty .container_id file\r
    CONTAINER_ID=$(cat "./.container_id")\r
    if [ -z "\${CONTAINER_ID}" ]; then\r
        echo ".container_id 파일에 값이 없습니다. 컨테이너가 실행 중인지 확인하세요?"\r
        docker ps --filter "name=\${DOCKER_CONTAINER_PREFIX_NAME}" --format "table {{.ID}}\\t{{.Names}}\\t{{.Status}}" \r
        exit 1\r
    fi\r
\r
    docker logs -f \${CONTAINER_ID}\r
    \`\`\`\r
\r
    - **docker run** 시 **--log-driver none** 인 경우 로그가 없으므로 **docker logs** 명령어를 사용할 수 없습니다.\r
\r
---\r
\r
## 마치며\r
\r
- 추후 배포/운영 환경까지 고려하여 간단한게 Docker 이미지를 활용하는 것을 선호합니다.\r
- 특히, H2 보다는 실제 DBMS와 연동하여 개발하는 것을 좋아합니다.\r
- PostgreSQL 도커 이미지 네이밍과 명령어를 고려할 때, **"postgres"** 라고 네이밍 하는것이 용이해 보입니다.\r
`;export{r as default};
