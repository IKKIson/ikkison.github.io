# GithubPages 구글 검색엔진 등록하기

## TODO : Google Research Console Sitemaps

- Google Research Console Sitemaps 에서 githubpages url을 등록을 위해서는 sitemap.xml 를 등록해야함.
  - JekyII 의 경우 sitemap.xml 가 자동으로 있음.
  - egs : 등록할 url 형태 예시
    - https://ikki.github.io/sitemap.xml
    - https://ikki.github.io/blog/sitemap.xml
- 현재 React.js + Vite.js + Typescript + TailWindCSS 로 직접 구현하는 경우, 아래와 같은 문제가 있으며 해결을 위해 게시글들을 경로로 라우팅해야함.

```markdown
## 1. SEO 및 사이트맵 관련 판단 (Critical)

제일 중요한 것은 현재 구조가 검색엔진 최적화와 사이트맵에 어떤 영향을 미치는지입니다.

### A. 클라이언트 측 렌더링 (CSR) 및 SEO 문제 (가장 중요)

- 현재 구조 (CSR/SPA): 게시글 목록 로드부터 Markdown 렌더링까지 모두 브라우저(클라이언트)에서 JavaScript를 통해 이루어집니다. 이는 전형적인 SPA(Single Page Application) 방식입니다.

- 문제점:
    - Google 검색 노출 지연/누락 가능성: Google은 JavaScript를 렌더링하지만, 초기 로드 시 HTML 소스에는 블로그 게시글의 실제 내용(텍스트)이 없습니다. 이는 Google이 콘텐츠를 발견하고 인덱싱하는 것을 지연시키거나, 심지어 일부 콘텐츠를 완전히 놓치게 할 수 있습니다.
    - 개별 페이지 URL 부재: 모든 게시글이 $https://ikki.github.io/blog 이라는 단일 URL에서 로드됩니다. 개별 게시글마다 고유한 URL(예: $https://ikki.github.io/blog?post=post-title-1)을 사용하더라도, 이는 경로가 아닌 쿼리 매개변수이므로 검색엔진이 '별개의 페이지'로 인식하고 크롤링하는 데 어려움이 있습니다.
    - 사이트맵 비효율성: 사이트맵에 $https://ikki.github.io/blog/post-title-1와 같은 URL을 제출하더라도, Googlebot이 해당 URL로 접속하면 항상 동일한 SPA index.html 파일만 받게 되어 사이트맵의 이점이 크게 상실됩니다.

- 개선 방향:
    - 고유 URL 구현: React Router (또는 유사 라우터)를 사용하여 각 게시글에 대해 **고유한 경로(Path)**를 부여해야 합니다.
        - 예: $https://ikki.github.io/blog/post-title-1
        - 이 URL을 통해 접속하면 Blog.tsx 컴포넌트가 해당 경로에서 게시글 제목(post-title-1)을 추출하여 로드하도록 해야 합니다.
    - 정적 생성 (SSG) 또는 서버 측 렌더링 (SSR) 고려: GitHub Pages 환경에서는 SSR이 불가능하므로, **SSG(Static Site Generation)**가 최적의 대안입니다.
        - Vite를 사용하는 경우, Astro, Next.js (Export), Gatsby 또는 Vite 플러그인을 사용하여 빌드 시점에 각 Markdown 파일에서 개별 HTML 파일을 미리 생성해야 합니다. 이렇게 하면 Googlebot은 이미 콘텐츠가 채워진 HTML 파일을 받게 됩니다.

### B. 사이트맵 생성과의 연관성

- 현재 구조: 현재 마크다운 파일 목록을 성공적으로 불러오고 있습니다 (import.meta.glob).

- 추천: 이 목록(files)을 기반으로 정확한 sitemap.xml을 생성하는 것은 필수입니다.
    - vite-plugin-sitemap을 사용하더라도, 라우팅을 고유 URL로 먼저 수정하지 않으면 사이트맵 제출은 큰 효과를 보기 어렵습니다.

---

## 2. 코드 구조 및 기능 판단 (Excellent)

기능 구현 자체는 매우 깔끔하고 잘 되어 있습니다.

### A. 마크다운 처리 및 구문 강조 (매우 좋음)

- ReactMarkdown, remarkGfm, react-syntax-highlighter 조합은 표준적이고 강력한 구현입니다.

- oneDark 테마 사용은 널리 인정받는 선택입니다.

- 코드 블록 커스터마이징 (code 컴포넌트): 인라인 코드와 블록 코드를 명확히 분리하고, <SyntaxHighlighter>에 PreTag="div"를 사용하여 스타일 충돌을 방지한 것은 매우 모범적인 구현입니다.

### B. 이미지 상대 경로 처리 (훌륭함)

- img 컴포넌트 커스터마이징을 통해 상대 경로(./image.png) 이미지를 프로젝트의 정적 경로(/markdown/blog/[폴더 경로]/[이미지 파일 이름])로 올바르게 변환하는 로직은 복잡하지만 정확하게 구현되어 있습니다. GitHub Pages 환경에서 마크다운 파일을 사용하는 경우 필수적인 작업입니다.

### C. 트리 및 데이터 관리 (좋음)

- import.meta.glob을 사용하여 모든 마크다운 파일을 로드하고, buildTree 함수를 통해 파일 시스템 구조를 재구성한 것은 훌륭한 접근 방식입니다.

- 폴더 토글 (node.isOpen) 기능을 구현하고 setTree([...tree])로 상태 갱신을 강제하는 것도 정확합니다.

### D. UX/반응형 디자인 (좋음)

- 데스크톱/모바일 사이드바 상태(isSidebarOpen, isDesktopSidebarOpen)를 분리하고, TailwindCSS의 반응형 유틸리티를 사용하여 전환 효과를 준 것은 좋은 사용자 경험을 제공합니다.

- 모바일에서 포스트 클릭 시 사이드바를 닫고( setIsSidebarOpen(false) ), 스크롤을 최상단으로 이동시키는( window.scrollTo ) 로직은 사용자 친화적입니다.

--

## 최종 권장 사항 요약

현재 코드는 기능적으로는 완벽하지만, 검색 노출이라는 목적을 달성하기 위해서는 구조적인 변화가 필요합니다.

    1. ⭐ (필수) 라우팅 수정: React Router (또는 유사 라우터)를 사용하여 각 게시글에 고유한 URL 경로를 부여하세요.
        - 예: App.tsx 또는 라우터 설정에서 /blog/:postPath* 와 같은 경로를 설정하여 Blog.tsx 컴포넌트가 URL 매개변수를 읽도록 수정해야 합니다.

    2. ⭐ (필수) Search Console 재점검: 위 1번을 완료한 후, 사이트맵을 다시 제출하고, Google Search Console의 URL 검사 도구에서 개별 게시글 URL(https://ikki.github.io/blog/post-title-1)을 테스트하여 **"Google이 렌더링한 페이지"**에 실제 게시글 내용이 포함되어 있는지 확인해야 합니다.

    3. ⭐ (권장) SSG 도입 고려: 장기적으로 블로그 SEO 성능을 극대화하려면, React 기반의 SSG(정적 사이트 생성) 프레임워크를 도입하는 것을 고려해 보세요. GitHub Pages에서 호스팅하기에 가장 이상적인 방식입니다.
```

## ref

- https://mino1982.tistory.com/35
