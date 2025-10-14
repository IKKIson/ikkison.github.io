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
│  │   ├─ Header.tsx
│  │   ├─ Footer.tsx
│  │   └─ TodoItem.tsx
│  │
│  ├─ pages/           # 각 기능별 페이지
│  │   ├─ Profile.tsx       # 자기소개
│  │   ├─ TodoApp.tsx       # TODO 앱
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
