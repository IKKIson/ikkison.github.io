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

type BlogTreeNode = {
  name: string;
  children?: BlogTreeNode[];
  post?: BlogFile;
  isOpen?: boolean;
};

export default function Blog() {
  // const [posts, setPosts] = useState<BlogFile[]>([]);
  const [tree, setTree] = useState<BlogTreeNode[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogFile | null>(null);
  const [searchText, setSearchText] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modules = import.meta.glob('/public/markdown/blog/**/*.md', { as: 'raw' });

    const postEntries: Promise<BlogFile>[] = Object.entries(modules).map(
      async ([path, resolver]) => {
        const content = await resolver();
        const trimmedPath = path.replace('/public/markdown/blog/', '');
        const parts = trimmedPath.split('/');
        const filename = parts.pop()!.replace(/\.md$/, '');
        return { path: parts, filename, content };
      }
    );

    Promise.all(postEntries).then((files) => {
      files.sort((a, b) => a.filename.localeCompare(b.filename));
      // setPosts(files);
      setTree(buildTree(files));

      if (isInitialLoad) {
        if (files.length > 0) {
          setSelectedPost(files[0]);
        }
        setIsInitialLoad(false);
      }
    });
  }, []);

  const buildTree = (files: BlogFile[]): BlogTreeNode[] => {
    const root: BlogTreeNode[] = [];
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
    return root;
  };

  const handleNodeClick = (node: BlogTreeNode) => {
    if (node.post) {
      setSelectedPost(node.post);
      setIsSidebarOpen(false);
    } else if (node.children) {
      node.isOpen = !node.isOpen;
      setTree([...tree]);
    }
  };

  const renderTree = (nodes: BlogTreeNode[], depth = 0) =>
    nodes.map((node) => {
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
            }}
          >
            {hasChildren && (
              <span className="flex-shrink-0 flex items-center justify-center w-4 text-gray-500">
                {node.isOpen ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            )}
            <span>{node.name}</span>
          </button>
          {hasChildren && node.isOpen && renderTree(node.children!, depth + 1)}
        </div>
      );
    });

  return (
    <div className="flex flex-col gap-6 p-6 w-full mx-auto relative h-[calc(100vh-64px-100px)]">
      {/* 모바일/태블릿 사이드바 열기 버튼 */}
      <div className="md:hidden mb-4 flex justify-end">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium shadow-md"
        >
          Show Posts
        </button>
      </div>

      {/* 데스크톱 버튼 영역 (사이드바 토글) */}
      <div className="hidden md:flex flex-row items-center justify-end gap-2 mb-4 w-full">
        {/* 데스크톱 사이드바 토글 버튼 */}
        <button
          onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          className="p-2 bg-gray-200 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-300"
          aria-label={isDesktopSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isDesktopSidebarOpen ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* 메인 콘텐츠 및 사이드바 영역을 감싸는 div */}
      <div className="flex flex-col md:flex-row-reverse flex-1 gap-6">
        {/* 사이드바 영역 */}
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

        {/* Markdown 내용 영역 */}
        <div
          className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 prose prose-purple dark:prose-invert overflow-auto mx-auto max-w-4xl h-full"
          style={{}}
        >
          {selectedPost ? (
            <ReactMarkdown
              children={selectedPost.content}
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ node, ...props }) => {
                  if (props.src && !props.src.startsWith('http') && !props.src.startsWith('/')) {
                    const baseUrl = '/ikkison.github.io/markdown/blog/';
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
            <p>Loading blog posts...</p>
          )}
        </div>
      </div>
    </div>
  );
}
