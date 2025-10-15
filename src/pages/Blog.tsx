import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaChevronRight, FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import '../styles.css';

type BlogFile = {
  path: string[];
  filename: string;
  content: string;
};

type TreeNode = {
  name: string;
  children?: TreeNode[];
  post?: BlogFile;
  isOpen?: boolean;
};

export default function Blog() {
  // const [posts, setPosts] = useState<BlogFile[]>([]);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogFile | null>(null);
  const [portfolioReadmeContent, setBlogReadmeContent] = useState(''); // Readme.md 내용 상태 추가
  const [searchText, setSearchText] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let readmeContent = '';

    // Readme.md 파일 불러오기 (비동기적으로 먼저 시작)
    const fetchReadmePromise = fetch('/markdown/blog/Readme.md')
      .then((response) => {
        if (!response.ok) throw new Error('Readme.md not found');
        return response.text();
      })
      .then((text) => {
        setBlogReadmeContent(text);
        readmeContent = text; // 로컬 변수에 저장하여 Promise.all 후 사용
      })
      .catch((error) => console.error("Error loading Portfolio Readme.md:", error));

    // Vite import.meta.glob으로 blog 하위 모든 .md 파일 불러오기
    const modules = import.meta.glob('/public/markdown/blog/**/*.md', { as: 'raw' });

    const postEntries: Promise<BlogFile>[] = Object.entries(modules).map(
      async ([path, resolver]) => {
        try {
          const content = await resolver();
          const trimmedPath = path.replace('/public/markdown/blog/', '');
          const parts = trimmedPath.split('/');
          const filename = parts.pop()!.replace(/\.md$/, '');
          return { path: parts, filename, content };
        } catch (error) {
          console.error(`Error loading blog markdown file: ${path}`, error);
          return Promise.reject(new Error(`Failed to load ${path}`));
        }
      }
    );

    Promise.all([fetchReadmePromise, Promise.all(postEntries)])
      .then(([_, files]) => {
        console.log("Raw blog files loaded:", files);
        const filteredFiles = files.filter(file => file.filename.toLowerCase() !== 'readme');
        console.log("Filtered files (excluding Readme.md):", filteredFiles);
        files.sort((a, b) => a.filename.localeCompare(b.filename));
        // setPosts(files);
        setTree(buildTree(files));
        console.log("Blog tree built:", buildTree(files));


        // [초기 화면 로드 로직 시작]
        // 페이지가 처음 로드될 때 (isInitialLoad가 true일 때만 실행)
        // 1. Readme.md 내용이 성공적으로 로드되었다면 (readmeContent), 이를 기본 selectedPost로 설정합니다.
        // 2. Readme.md가 없거나 로드되지 않았다면, 필터링된 파일 목록의 첫 번째 프로젝트를 selectedPost로 설정합니다.
        // 3. 초기 로드 완료 플래그(isInitialLoad)를 false로 설정하여 이 로직이 다시 실행되지 않도록 합니다.
        if (isInitialLoad) {
          if (readmeContent) { // readmeContent가 성공적으로 로드되었다면
            setSelectedPost({
              path: [],
              filename: 'Readme',
              content: readmeContent
            });
          } else if (filteredFiles.length > 0) {
            setSelectedPost(filteredFiles[0]);
          }
          setIsInitialLoad(false);
        }
      })
      .catch((error) => {
        console.error("Error during Promise.all in Blog useEffect:", error);
        setTree([]);
        setSelectedPost(null);
      });
  }, []);

  const buildTree = (files: BlogFile[]): TreeNode[] => {
    console.log("buildTree input files for blog:", files);
    const root: TreeNode[] = [];
    files.forEach((file) => {
      let currentLevel = root;
      file.path.forEach((segment) => {
        let node = currentLevel.find((n) => n.name === segment);
        if (!node) {
          node = { name: segment, children: [], isOpen: true };
          currentLevel.push(node);
        }
        currentLevel = node.children!;
      });
      currentLevel.push({ name: file.filename, post: file });
    });
    console.log("buildTree output root for blog:", root);
    return root;
  };

  // ================================
  // 트리 노드 클릭 이벤트 처리
  // ================================
  const handleNodeClick = (node: TreeNode) => {
    if (node.post) {
      // 파일 클릭 시 선택 상태 업데이트
      setSelectedPost(node.post);
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
      if (node.name.toLowerCase() === 'readme' && node.post && node.post.path.length === 0) {
        return null;
      }
      const hasChildren = node.children && node.children.length > 0;
      return (
        <div key={node.name + depth} className="flex flex-col">
          <button
            onClick={() => handleNodeClick(node)}
            className={`w-full flex items-center gap-2 p-2 rounded-lg font-medium transition-all duration-300
              ${node.post === selectedPost
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
    // <div className="flex flex-col gap-6 p-6 w-full mx-auto relative h-[calc(100vh-64px-100px)]">
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
            데스크톱 버튼 영역 (Blog 버튼 및 사이드바 토글)
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
          {/* Blog 버튼 */}
          <button
            onClick={() => {
              if (portfolioReadmeContent) {
                setSelectedPost({
                  path: [],
                  filename: 'Readme',
                  content: portfolioReadmeContent
                });
              }
            }}
            className={`flex items-center gap-2 p-2 rounded-lg font-medium transition-all duration-300
              ${selectedPost?.filename.toLowerCase() === 'readme' && selectedPost?.path.length === 0
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'}
              `}
          >
            Blog
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
                  placeholder="Search posts..."
                  className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded-lg"
                >
                  X
                </button>
              </div>

              {/* 데스크톱 검색바 */}
              <div className="hidden md:block mb-2">
                <input
                  type="text"
                  placeholder="Search posts..."
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
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

          {/* =========================
              Markdown 내용 영역
          ========================= */}
          {/* <div
          className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 prose prose-purple dark:prose-invert overflow-auto mx-auto max-w-4xl h-full"
          style={{}}
        > */}

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
              {selectedPost ? (
                <ReactMarkdown
                  children={selectedPost.content} // 선택된 포스트 Markdown 내용
                  remarkPlugins={[remarkGfm]} // GitHub flavored Markdown 지원
                  components={{
                    // 이미지 렌더링 커스터마이징
                    img: ({ node, ...props }: { node?: any;[key: string]: any }) => {
                      if (props.src && !props.src.startsWith('http') && !props.src.startsWith('/')) {
                        const baseUrl = '/markdown/blog/';
                        return <img {...props} src={baseUrl + props.src.replace('./', '')} className="max-w-full h-auto rounded-md" alt={props.alt || ''} />;
                      }
                      return <img {...props} className="max-w-full h-auto rounded-md" alt={props.alt || ''} />;
                    },
                    // 코드 블록 렌더링 커스터마이징
                    code: ({ node, ...props }) => (
                      <code
                        {...props}
                        className="bg-gray-100 dark:bg-gray-800 p-1 rounded-md text-sm break-words"
                      />
                    ),
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
                <p>Loading blog posts...</p> // 로딩 중 메시지
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
