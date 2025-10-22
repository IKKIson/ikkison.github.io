# Development

## setup

```shell
npm create vite@7 ikkison.github.io --template react-ts
cd my-app

npm install
npm run dev

npm install gh-pages --save-dev

npm install -D tailwindcss@3.4.17 postcss autoprefixer
npx tailwindcss init -p
```

## Structure

```shell
ikkison.github.io/
│
├─ src/
│  ├─ components/      # 재사용 UI 컴포넌트
│  │   ├─ Card.tsx
│  │   ├─ Header.tsx
│  │   └─ Footer.tsx
│  │
│  ├─ pages/           # 각 기능별 페이지
│  │   ├─ Home.tsx          # 나의 Github-pages 의 main/Home 페이지
│  │   ├─ Profile.tsx       # 자기소개
│  │   ├─ Portfolio.tsx     # 포트폴리오
│  │   └─ Blog.tsx          # 블로그
│  │
│  ├─ App.tsx          # 라우터 포함
│  └─ main.tsx
│
├─ index.html
```

## Dist

### 일반 배포 (Development Server)

이 프로젝트는 Vite 기반이므로, 빌드된 결과물(`dist` 폴더)을 정적 파일 서버로 제공하여 배포할 수 있습니다.

1.  **프로젝트 빌드:**
    ```shell
    npm run build
    ```
    이 명령은 프로젝트를 빌드하고 모든 정적 파일을 `dist` 디렉토리에 생성합니다.

2.  **정적 파일 서버로 제공:**

    *   **`serve` 패키지 사용 (권장 - 모든 OS에서 작동):**
        `serve`는 로컬 개발 및 테스트를 위한 간단한 정적 파일 서버입니다.
        ```shell
        npm install -g serve  # serve 패키지 전역 설치 (최초 1회)
        serve -s dist         # dist 디렉토리의 파일을 서비스
        ```
        명령 실행 후 터미널에 표시되는 URL (예: `http://localhost:3000`)로 접속합니다.

    *   **Python Simple HTTP Server 사용 (대부분의 OS에 Python 설치 시):**
        ```shell
        cd dist                 # dist 디렉토리로 이동
        python -m http.server   # Python 3.x 버전
        # python -m SimpleHTTPServer # Python 2.x 버전
        ```
        이후 `http://localhost:8000`으로 접속합니다.

    *   **Nginx 또는 Apache (프로덕션 환경 - Linux):**
        실제 프로덕션 환경에서는 Nginx나 Apache와 같은 웹 서버를 사용하여 `dist` 디렉토리를 서비스하는 것이 일반적입니다. 이는 더 복잡한 설정이 필요하므로 관련 문서를 참조하시기 바랍니다.

### Github Pages 배포

이 프로젝트는 GitHub Pages를 통해 웹사이트를 호스팅하도록 설정할 수 있습니다.

1.  **`package.json` 설정:**
    `package.json` 파일에 다음 항목들을 추가 또는 수정합니다.

    *   `homepage`: GitHub Pages URL을 지정합니다. `username.github.io/repository-name` 형식입니다.
    *   `scripts`: 배포를 위한 `predeploy`와 `deploy` 스크립트를 추가합니다.

    ```json
    {
      "name": "ikkison.github.io",
      "private": true,
      "version": "0.0.0",
      "type": "module",
      "homepage": "https://ikkison.github.io/ikkison.github.io/",
      "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
        "preview": "vite preview",
        "predeploy": "npm run build",
        "deploy": "gh-pages -d dist"
      },
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-markdown": "^9.0.1",
        "react-router-dom": "^6.21.1",
        "rehype-raw": "^7.0.0",
        "remark-gfm": "^4.0.0"
      },
      "devDependencies": {
        "@types/react": "^18.2.43",
        "@types/react-dom": "^18.2.17",
        "@typescript-eslint/eslint-plugin": "^6.14.0",
        "@typescript-eslint/parser": "^6.14.0",
        "@vitejs/plugin-react-swc": "^3.5.0",
        "autoprefixer": "^10.4.17",
        "eslint": "^8.55.0",
        "eslint-plugin-react-hooks": "^4.6.0",
        "eslint-plugin-react-refresh": "^0.4.5",
        "gh-pages": "^6.1.1",
        "postcss": "^8.4.33",
        "tailwindcss": "^3.4.1",
        "typescript": "^5.2.2",
        "vite": "^5.0.8"
      }
    }
    ```

    *주의:* `homepage` URL은 GitHub 사용자 이름과 저장소 이름에 맞게 수정해야 합니다. 예를 들어, `your-username.github.io/your-repository-name/`과 같이 됩니다. 현재 프로젝트는 `ikkison.github.io`이므로, `https://ikkison.github.io/ikkison.github.io/`가 됩니다.

2.  **`gh-pages` 패키지 설치:**
    개발 의존성으로 `gh-pages` 패키지가 설치되어 있어야 합니다. `setup` 섹션에 이미 이 명령어가 포함되어 있습니다.
    ```shell
    npm install gh-pages --save-dev
    ```

3.  **프로젝트 배포:**
    `package.json`에 추가된 `deploy` 스크립트를 실행합니다.
    ```shell
    npm run deploy
    ```
    이 명령은 `predeploy` 스크립트(`npm run build`)를 먼저 실행하여 프로젝트를 빌드하고, 그 다음 `dist` 디렉토리의 내용을 `gh-pages` 브랜치로 푸시하여 GitHub Pages에 배포합니다. 배포가 완료되면 `homepage`에 설정된 URL로 웹사이트에 접근할 수 있습니다.

    *주의:* `gh-pages` 브랜치는 자동으로 생성되므로 수동으로 생성할 필요는 없습니다.

3.  **깃허브 레파지토리 설정 변경**

- 아래 단계를 따라 GitHub 레포지토리 설정을 변경해 주세요:

    1. GitHub 레포지토리 접속: 먼저 웹 브라우저를 열고 사용자의 GitHub 레포지토리 (https://github.com/IKKIson/ikkison.github.io/)로 이동합니다.
    2. Settings (설정) 탭 클릭: 레포지토리 페이지에서 상단 메뉴 바에 있는 Settings 탭을 클릭합니다.
    3. Pages (페이지) 메뉴 선택: 왼쪽 사이드바 메뉴에서 Code and automation 섹션 아래에 있는 Pages를 클릭합니다.
    4. Source (소스) 설정:
      - GitHub Pages 섹션에서 Source 드롭다운 메뉴를 찾습니다.
      - 이 드롭다운을 클릭하여 gh-pages 브랜치를 선택합니다. (만약 gh-pages 브랜치가 없다면, npm run deploy 명령어를 먼저 성공적으로 실행하여 gh-pages 브랜치를 생성해야 합니다.)
    5. Folder (폴더) 설정:
      - Source 드롭다운 메뉴 바로 옆에 있는 /root 드롭다운 메뉴를 클릭합니다.
      - 여기서 /(root)를 선택합니다.
    6. Save (저장) 버튼 클릭: 위 두 가지 설정을 변경한 후, 반드시 Save 버튼을 클릭하여 변경 사항을 저장합니다.
  
- 설정을 저장한 후, GitHub Pages가 변경 사항을 적용하는 데 몇 분 정도 시간이 걸릴 수 있습니다. 잠시 기다린 후 https://ikkison.github.io/에 다시 접속하여 웹사이트가 정상적으로 표시되는지 확인해 주세요.
