// src/pages/Portfolio.tsx
import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown'; // Markdown 내용을 React 컴포넌트로 렌더링
import remarkGfm from 'remark-gfm'; // GitHub flavored Markdown (테이블, 체크박스 등 지원)
import { FaChevronRight, FaChevronDown, FaChevronLeft } from 'react-icons/fa'; // 트리 접기/펼치기 아이콘

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// --- 테마 Import ---
// dark 테마 예시 (가장 많이 사용됨)
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; 
// light 테마 예시
// import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

import '../styles.css'; // 공통 스타일 import

// Portfolio Markdown 파일 타입 정의
type PortfolioFile = {
  path: string[]; // 하위 디렉토리 경로 배열, 예: ['2025', 'React']
  filename: string; // 파일 이름 (확장자 제거)
  content: string; // Markdown 내용
  date: string; // 파일에서 추출한 날짜 (YYYYMMDD 형식) 추가
};

// 트리 구조의 노드 타입 정의
type TreeNode = {
  name: string; // 폴더 또는 파일 이름
  children?: TreeNode[]; // 하위 노드 배열
  project?: PortfolioFile; // 실제 프로젝트 파일이면 project에 저장
  isOpen?: boolean; // 폴더 접기/펼치기 상태
};

type CustomCodeProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  // children을 필수(required)에서 선택적(optional)으로 변경하여 TS2322 오류 해결
  children?: React.ReactNode; 
  [key: string]: any; // 나머지 모든 HTML 속성을 허용
};

export default function Portfolio() {
  // Markdown 프로젝트 파일 배열 상태
  // const [projects, setProjects] = useState<PortfolioFile[]>([]);
  // 트리 구조 상태
  const [tree, setTree] = useState<TreeNode[]>([]);
  // 현재 선택된 프로젝트
  const [selectedProject, setSelectedProject] = useState<PortfolioFile | null>(null);
  const [portfolioReadmeContent, setPortfolioReadmeContent] = useState(''); // Readme.md 내용 상태 추가
  // 사이드바 검색어
  const [searchText, setSearchText] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true); // 초기 로드 상태 추가
  // 모바일/태블릿 사이드바 열림 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true); // 데스크톱 사이드바 열림/닫힘 상태 추가
  // 사이드바 스크롤 영역 참조
  const listRef = useRef<HTMLDivElement>(null);

  // ================================
  // Markdown 파일 불러오기 & 트리 생성
  // ================================
  useEffect(() => {
    let readmeContent = '';

    // Readme.md 파일 불러오기 (비동기적으로 먼저 시작)
    const fetchReadmePromise = fetch('/markdown/portfolio/Readme.md')
      .then((response) => {
        if (!response.ok) throw new Error('Readme.md not found');
        return response.text();
      })
      .then((text) => {
        setPortfolioReadmeContent(text);
        readmeContent = text; // 로컬 변수에 저장하여 Promise.all 후 사용
      })
      .catch((error) => console.error("Error loading Portfolio Readme.md:", error));

    // Vite import.meta.glob으로 portfolio 하위 모든 .md 파일 불러오기
    const modules = import.meta.glob('/public/markdown/portfolio/**/*.md', { as: 'raw' });

    const projectEntries: Promise<PortfolioFile>[] = Object.entries(modules).map(
      async ([path, resolver]) => {
        try {
          const content = await resolver(); // 파일 내용을 문자열로 읽음
          const trimmedPath = path.replace('/public/markdown/portfolio/', ''); // 기본 경로 제거
          const parts = trimmedPath.split('/'); // 하위 폴더 분리
          const filename = parts.pop()!.replace(/\.md$/, ''); // 파일 이름만 추출

          // 파일 이름에서 날짜 추출 (YYYYMMDD 형식)
          const dateMatch = filename.match(/^(\d{8})/);
          const date = dateMatch ? dateMatch[1] : '00000000'; // 날짜가 없으면 가장 오래된 날짜로 간주

          return { path: parts, filename, content, date }; // PortfolioFile 객체 생성
        } catch (error) {
          console.error(`Error loading markdown file: ${path}`, error);
          return Promise.reject(new Error(`Failed to load ${path}`)); // 실패 시 Promise.all이 전체를 거부하도록 함
        }
      }
    );

    // 모든 파일 및 Readme.md 로드 완료 후 처리
    Promise.all([fetchReadmePromise, Promise.all(projectEntries)])
      .then(([_, files]) => {
        console.log("Raw project files loaded:", files);
        const filteredFiles = files.filter(file => file.filename.toLowerCase() !== 'readme');
        console.log("Filtered files (excluding Readme.md):", filteredFiles);
        // 날짜를 기준으로 내림차순 정렬 (최신순)
        filteredFiles.sort((a, b) => (a.date < b.date ? 1 : -1));
        // setProjects(filteredFiles); // 전체 프로젝트 state 설정
        setTree(buildTree(filteredFiles)); // 트리 구조 생성 (Readme.md 제외)

        // [초기 화면 로드 로직 시작]
        // 페이지가 처음 로드될 때 (isInitialLoad가 true일 때만 실행)
        // 1. Readme.md 내용이 성공적으로 로드되었다면 (readmeContent), 이를 기본 selectedProject로 설정합니다.
        // 2. Readme.md가 없거나 로드되지 않았다면, 필터링된 파일 목록의 첫 번째 프로젝트를 selectedProject로 설정합니다.
        // 3. 초기 로드 완료 플래그(isInitialLoad)를 false로 설정하여 이 로직이 다시 실행되지 않도록 합니다.
        if (isInitialLoad) {
          if (readmeContent) { // readmeContent가 성공적으로 로드되었다면
            setSelectedProject({
              path: [],
              filename: 'Readme',
              content: readmeContent,
              date: '00000000', // Readme.md의 기본 날짜 추가
            });
          } else if (filteredFiles.length > 0) {
            setSelectedProject(filteredFiles[0]);
          }
          setIsInitialLoad(false); // 초기 로드 완료
        }
      })
      .catch((error) => {
        console.error("Error during Promise.all in Portfolio useEffect:", error);
        // 에러 발생 시 트리 초기화 또는 로딩 상태 유지
        setTree([]);
        setSelectedProject(null);
      });
  }, []); // 초기 로드 시 한 번만 실행되도록 빈 의존성 배열

  // ================================
  // 프로젝트 배열을 트리 구조로 변환
  // ================================
  const buildTree = (files: PortfolioFile[]): TreeNode[] => {
    console.log("buildTree input files:", files);
    const root: TreeNode[] = []; // 루트 배열
    files.forEach((file) => {
      let currentLevel = root; // 루트에서 시작
      file.path.forEach((segment) => {
        // 폴더가 이미 존재하는지 확인
        let node = currentLevel.find((n) => n.name === segment);
        if (!node) {
          // 존재하지 않으면 새 폴더 노드 생성
          node = { name: segment, children: [], isOpen: true };
          currentLevel.push(node);
        }
        currentLevel = node.children!; // 다음 depth로 이동
      });
      // 실제 파일 노드 추가
      currentLevel.push({ name: file.filename, project: file });
    });
    console.log("buildTree output root:", root);
    return root;
  };

  // ================================
  // 트리 노드 클릭 이벤트 처리
  // ================================
  const handleNodeClick = (node: TreeNode) => {
    if (node.project) {
      // 파일 클릭 시 선택 상태 업데이트
      setSelectedProject(node.project);
      // 모바일이면 사이드바 닫기
      setIsSidebarOpen(false);
      // 선택된 프로젝트로 스크롤 이동
      listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      // 콘텐츠 영역 최상단으로 스크롤 이동 (선택된 프로젝트가 바뀔 때마다)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (node.children) {
      // 폴더 클릭 시 open/close 토글
      node.isOpen = !node.isOpen;
      setTree([...tree]); // 상태 강제 갱신
    }
  };

  // ================================
  // 트리 렌더링 (재귀)
  // ================================
  const renderTree = (nodes: TreeNode[], depth = 0) =>
    nodes.map((node) => {
      // Readme.md는 목록에 표시하지 않음
      if (node.name.toLowerCase() === 'readme' && node.project && node.project.path.length === 0) {
        return null;
      }
      const hasChildren = node.children && node.children.length > 0; // 하위 노드 존재 여부
      return (
        <div key={node.name + depth} className="flex flex-col">
          <button
            onClick={() => handleNodeClick(node)}
            className={`w-full flex items-center gap-2 p-2 rounded-lg font-medium transition-all duration-300
              ${node.project === selectedProject
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'}
              `}
            style={{
              paddingLeft: `${depth * 1.5}rem`,
              whiteSpace: 'nowrap',
            }} // depth에 따라 들여쓰기
          >
            {/* 폴더일 경우 아이콘 표시 */}
            {hasChildren && (
              <span className="flex-shrink-0 flex items-center justify-center w-4 text-gray-500">
                {node.isOpen ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            )}
            <span>{node.name}</span> {/* 파일 또는 폴더 이름 표시 */}
          </button>
          {hasChildren && node.isOpen && renderTree(node.children!, depth + 1)} {/* 재귀 호출 */}
        </div>
      );
    });

  // ================================
  // JSX 반환 (렌더링)
  // ================================
  return (
    <div className="flex flex-col flex-1 w-full mx-auto py-6 px-4 md:px-6">
      <div className="flex-1 flex flex-col gap-6 p-6">
        {/* =========================
            모바일/태블릿 사이드바 열기 버튼
        ========================= */}
        <div className="md:hidden mb-4 flex justify-end">
          {/* 사이드바가 닫혀있거나 열린 상태 상관없이 버튼 항상 렌더링 */}
          <button
            onClick={() => setIsSidebarOpen(true)} // 클릭 시 사이드바 열기
            className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium shadow-md"
          >
            Show
          </button>
        </div>

        {/* =========================
            데스크톱 버튼 영역 (Portfolio 버튼 및 사이드바 토글)
        ========================= */}
        <div className="hidden md:flex flex-row items-center justify-end gap-2 mb-4 w-full">
          {/* 데스크톱 사이드바 토글 버튼 */}
          <button
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            className="p-2 bg-gray-200 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-300"
            aria-label={isDesktopSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isDesktopSidebarOpen ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
          {/* Portfolio 버튼 */}
          <button
            onClick={() => {
              if (portfolioReadmeContent) {
                setSelectedProject({
                  path: [],
                  filename: 'Readme',
                  content: portfolioReadmeContent,
                  date: '00000000', // Readme.md의 기본 날짜 추가
                });
              }
            }}
            className={`flex items-center gap-2 p-2 rounded-lg font-medium transition-all duration-300
              ${selectedProject?.filename.toLowerCase() === 'readme' && selectedProject?.path.length === 0
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'}
              `}
          >
            Portfolio
          </button>
        </div>

        {/* =========================
            메인 콘텐츠 및 사이드바 영역을 감싸는 div
        ========================= */}
        <div className="flex flex-col md:flex-row-reverse flex-1 gap-6">
          {/* =========================
              사이드바 영역
          ========================= */}
          
          <div
            // fixed: 고정 위치
            // top-0, right-0: 화면 우측 상단에 위치
            // h-full: 세로 전체 (화면 높이 100%)
            // w-3/4: 너비를 화면의 75% 3/4 (모바일)
            // max-w-xs: 최대 너비를 Tailwind의 xs (약 20rem ≒ 320px)로 제한
            // bg-white: 배경 흰색
            // shadow-xl: 그림자 효과 (크고 진한 그림자)
            // rounded-lg: 둥근 모서리
            // z-50: z-index 50 (다른 요소 위에 표시)
            // transform transition-transform duration-300: 변환 및 애니메이션 효과
            // translate-x-0: 열림 상태 (원래 위치)
            // translate-x-full: 닫힘 상태 (화면 밖으로 이동)
            // md:relative md:top-0 md:right-0: 데스크톱에서는 상대 위치
            // md:max-w-64 md:w-64: 데스크톱에서는 너비 16rem
            // md:h-full: 데스크톱에서는 높이 100%
            // md:translate-x-0: 데스크톱에서는 항상 열림 상태
            // md:flex-shrink-0: 데스크톱에서는 축소하지 않음
            // md:overflow-y-auto: 데스크톱에서는 세로 스크롤 가능
            // md:transition-all md:duration-300: 데스크톱에서는 모든 속성에 대해 애니메이션 효과
            className={`
              fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white shadow-xl rounded-lg z-50 transform transition-transform duration-300
              ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
              md:relative md:top-0 md:right-0 ${isDesktopSidebarOpen ? 'md:max-w-64 md:w-64' : 'md:max-w-0 md:w-0 md:overflow-hidden'} md:h-full md:translate-x-0 md:flex-shrink-0 md:overflow-y-auto md:transition-all md:duration-300
            `}
          >
            <div className="p-4 flex flex-col gap-2 h-full" ref={listRef}>
              {/* 모바일 검색바 */}
              <div className="flex justify-between items-center mb-2 md:hidden">
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <button
                  onClick={() => setIsSidebarOpen(false)} // X 버튼 클릭 시 닫기
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded-lg"
                >
                  X
                </button>
              </div>

              {/* 데스크톱 검색바 */}
              <div className="hidden md:block mb-2">
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              {/* 트리 렌더링 */}
              {renderTree(tree)}
            </div>
          </div>

          {/* 모바일 오버레이 */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
              onClick={() => setIsSidebarOpen(false)} // 오버레이 클릭 시 닫기
            ></div>
          )}

          {/* =========================
              Markdown 내용 영역
          ========================= */}
          <div
            // flex-1: 남은 공간 모두 차지.
            // bg-white: 배경 흰색.
            // rounded-lg: 둥근 모서리.
            // shadow-md: 중간 정도 그림자 효과 (박스 그림자).
            // border border-gray-200: 테두리를 얇게 주고, 회색(gray-200) 색상 사용.
            // prose: Tailwind CSS Typography 플러그인 적용.
            // prose-purple: a, h1, h2 등의 텍스트 컬러를 보라색 계열로 적용.
            // dark:prose-invert: 사용자가 다크모드를 사용할 경우, 색상을 반전해서 잘 보이도록 함 (흰 배경이 검정, 검정 글자가 흰 글자 등).
            // overflow-auto: 내용이 넘치면 스크롤이 생기도록 함.
            // mx-auto: 수평 중앙 정렬.
            // max-w-4xl: 최대 너비를 4xl로 제한.
            // h-full: 부모 요소의 높이를 100% 차지.
            // min-h-0: flexbox 컨테이너 내에서 올바르게 크기가 조정되도록 함.
            className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 prose prose-purple dark:prose-invert overflow-auto mx-auto max-w-4xl h-full min-h-0"
            style={{}}
          >
            <div className="p-6">
              {selectedProject ? (
                <ReactMarkdown
                  children={selectedProject.content} // 선택된 프로젝트 Markdown 내용
                  remarkPlugins={[remarkGfm]} // GitHub flavored Markdown 지원
                  components={{
                    /* img 랜더링 커스터마이징 시작 */
                    // img: ({ node, ...props }: { node?: any;[key: string]: any }) => {
                    //   if (props.src && !props.src.startsWith('http') && !props.src.startsWith('/')) {
                    //     const baseUrl = '/markdown/portfolio/';
                    //     return <img {...props} src={baseUrl + props.src.replace('./', '')} className="max-w-full h-auto rounded-md" alt={props.alt || ''} />;
                    //   }
                    //   return <img {...props} className="max-w-full h-auto rounded-md" alt={props.alt || ''} />;
                    // },
                    /* img 랜더링 커스터마이징 시작 */
                    img: ({ node, ...props }: { node?: any;[key: string]: any }) => {
                      const src = props.src;

                      // 1. 외부 링크 (http/https), 절대 경로 (/)는 그대로 사용
                      if (src && (src.startsWith('http') || src.startsWith('/'))) {
                        return <img {...props} className="max-w-full h-auto rounded-md" alt={props.alt || ''} />;
                      }

                      // 2. 상대 경로 처리 (로컬 이미지)
                      // 기본 경로를 설정. 파일들이 public/markdown/portfolio/ 아래에 있다고 가정.
                      // selectedProject.path는 파일의 디렉토리 경로 배열입니다.
                      const pathSegments = selectedProject.path.join('/');
                      
                      // ex) 파일 경로: public/markdown/portfolio/category/post.md
                      // 상대 경로 이미지: ./image.png
                      // 최종 경로: /markdown/portfolio/category/image.png
                      // pathSegments가 있으면 디렉토리 구분자 '/' 추가
                      const directoryPath = pathSegments ? `${pathSegments}/` : '';
                      
                      // src의 './' 또는 '../'를 제거하고, 파일의 기본 디렉토리 경로를 앞에 붙입니다.
                      const cleanSrc = src.replace(/^\.?\//, ''); // ./ 제거
                      
                      // 최종 이미지 경로: /markdown/portfolio/[폴더 경로]/[이미지 파일 이름]
                      const finalSrc = `/markdown/portfolio/${directoryPath}${cleanSrc}`;

                      return <img {...props} src={finalSrc} className="max-w-full h-auto rounded-md" alt={props.alt || ''} />;
                    },
                    /* img 랜더링 커스터마이징 끝 */
                    /* 코드블록 랜더링 커스터마이징 시작 */                    
                    code: ({ node, inline, className, children, ...props }: CustomCodeProps) => {
                      const match = /language-(\w+)/.exec(className || '');
                      
                      // 1. 인라인 코드 처리 (예: `const a = 1;`)
                      if (inline) {
                        return (
                          <code
                            {...props}
                            className="bg-gray-100 dark:bg-gray-800 p-1 rounded-md text-sm break-words"
                          >
                            {children}
                          </code>
                        );
                      }

                      // 2. 블록 코드 (fence, ```) 처리
                      // match가 있으면 언어 지정이 된 블록 코드입니다.
                      return match ? (
                        <SyntaxHighlighter
                          {...props}
                          style={oneDark} // 원하는 테마를 선택합니다.
                          language={match[1]}
                          PreTag="div" // <div> 태그로 감싸서 Markdown Prose 스타일이 적용되지 않도록 합니다.
                          customStyle={{ 
                            margin: 0, 
                            padding: '1rem', 
                            borderRadius: '0.5rem', 
                          }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        // 언어 지정이 안된 일반 코드 블록 처리 (필요시 <SyntaxHighlighter>로 대체)
                        <code {...props} className={className}>
                          {children}
                        </code>
                      );
                    },
                  /* 코드블록 랜더링 커스터마이징 끝 */
                  }}
                />
              ) : portfolioReadmeContent ? (
                <ReactMarkdown
                  children={portfolioReadmeContent} // Readme.md가 있으면 기본으로 표시
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ node, ...props }: { node?: any;[key: string]: any }) => {
                      if (props.src && !props.src.startsWith('http') && !props.src.startsWith('/')) {
                        const baseUrl = '/markdown/portfolio/';
                        return <img {...props} src={baseUrl + props.src.replace('./', '')} className="max-w-full h-auto rounded-md" alt={props.alt || ''} />;
                      }
                      return <img {...props} className="max-w-full h-auto rounded-md" alt={props.alt || ''} />;
                    },
                    code: ({ node, ...props }) => (
                      <code
                        {...props}
                        className="bg-gray-100 dark:bg-gray-800 p-1 rounded-md text-sm break-words"
                      />
                    ),
                  }}
                />
              ) : (
                <p>Loading portfolio...</p> // 로딩 중 메시지
              )}
            </div> {/* p-6: 내부 패딩 추가 */}
          </div>  {/* Markdown 내용 영역 끝 */}
        </div> {/* 메인 콘텐츠 및 사이드바 영역 끝 */}
      </div> {/* 전체 패딩 및 레이아웃 끝 */}
    </div> /* 최상위 컨테이너 끝 */
  );
}
