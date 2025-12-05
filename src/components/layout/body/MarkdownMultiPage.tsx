import { useEffect, useState, useRef } from 'react';
// import { useEffect, useState, useRef, type ImgHTMLAttributes } from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
import { FaChevronRight, FaChevronDown, FaChevronLeft } from 'react-icons/fa';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../../../styles.css';

import RenderMarkdownPage from '../../widget/MarkdownPage';

type MarkdownFile = {
  path: string[];
  filename: string;
  content: string;
  date?: string; // Optional date for sorting
};

type TreeNode = {
  name: string;
  children?: TreeNode[];
  post?: MarkdownFile;
  isOpen?: boolean;
};

// type CustomCodeProps = {
//   node?: React.ReactNode;
//   inline?: boolean;
//   className?: string;
//   children?: React.ReactNode;
// };

type MarkdownMultiPageProps = {
  basePath: string; // e.g., '/markdown/blog'
  pageTitle: string; // e.g., 'Blog'
  searchPlaceholder: string; // e.g., 'Search posts...'
  loadingMessage: string; // e.g., 'Loading blog posts...'
  sortByDate?: boolean; // Whether to sort by date
};

export default function MarkdownMultiPage({
  basePath,
  pageTitle,
  searchPlaceholder,
  // loadingMessage,
  sortByDate = false,
}: MarkdownMultiPageProps) {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [selectedPost, setSelectedPost] = useState<MarkdownFile | null>(null);
  const [readmeContent, setReadmeContent] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let readme = '';

    const fetchReadmePromise = fetch(`${basePath}/Readme.md`)
      .then((response) => {
        if (!response.ok) throw new Error('Readme.md not found');
        return response.text();
      })
      .then((text) => {
        setReadmeContent(text);
        readme = text;
      })
      .catch((error) => console.error(`Error loading ${pageTitle} Readme.md:`, error));

    const modules = import.meta.glob('/public/**/*.md', { as: 'raw' });
    const postEntries: Promise<MarkdownFile>[] = Object.entries(modules)
    .filter(([path]) => path.startsWith(`/public${basePath}`))
    .map(
      async ([path, resolver]) => {
        try {
          const content = await resolver();
          const trimmedPath = path.replace(`/public${basePath}/`, '');
          const parts = trimmedPath.split('/');
          const filename = parts.pop()!.replace(/\.md$/, '');
          const dateMatch = filename.match(/^(\d{8})/);
          const date = dateMatch ? dateMatch[1] : '00000000';
          return { path: parts, filename, content, date };
        } catch (error) {
          console.error(`Error loading markdown file: ${path}`, error);
          return Promise.reject(new Error(`Failed to load ${path}`));
        }
      }
    );

    Promise.all([fetchReadmePromise, Promise.all(postEntries)])
      .then(([, files]) => {
        const filteredFiles = files.filter(file => file.filename.toLowerCase() !== 'readme');
        if (sortByDate) {
          filteredFiles.sort((a, b) => (a.date! < b.date! ? 1 : -1));
        } else {
          filteredFiles.sort((a, b) => a.filename.localeCompare(b.filename));
        }
        setTree(buildTree(filteredFiles));

        if (isInitialLoad) {
          if (readme) {
            setSelectedPost({
              path: [],
              filename: 'Readme',
              content: readme
            });
          } else if (filteredFiles.length > 0) {
            setSelectedPost(filteredFiles[0]);
          }
          setIsInitialLoad(false);
        }
      })
      .catch((error) => {
        console.error(`Error during Promise.all in ${pageTitle} useEffect:`, error);
        setTree([]);
        setSelectedPost(null);
      });
  }, [basePath, pageTitle, sortByDate, isInitialLoad]);

  const buildTree = (files: MarkdownFile[]): TreeNode[] => {
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
    return root;
  };

  const handleNodeClick = (node: TreeNode) => {
    if (node.post) {
      setSelectedPost(node.post);
      setIsSidebarOpen(false);
      listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (node.children) {
      node.isOpen = !node.isOpen;
      setTree([...tree]);
    }
  };

  const renderTree = (nodes: TreeNode[], depth = 0) =>
    nodes.map((node) => {
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
    <div className="flex flex-col flex-1 w-full mx-auto py-6 px-4 md:px-6">
      <div className="flex-1 flex flex-col gap-6 p-6">
        {/* Mobile-only "Show" button */}
        <div className="md:hidden mb-4 flex justify-end">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium shadow-md"
          >
            Show
          </button>
        </div>

        {/* Main container for content and sidebar */}
        <div className="flex flex-col md:flex-row flex-1 gap-6 justify-center">
          {/* Markdown Content Area */}
            {selectedPost ? (
                <RenderMarkdownPage 
                content={selectedPost.content}
                baseImagePath={`${basePath}/${selectedPost.path.join('/')}`}
                />
            ) : (
                <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <p>Loading content...</p>
                </div>
            )}
          {/* Right-hand column (Buttons + Sidebar) for Desktop */}
          <div className="hidden md:flex flex-col gap-4">
            {/* Control Buttons */}
            <div className="flex flex-row items-center justify-end gap-2 w-full">
              <button
                onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
                className="p-2 bg-gray-200 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-300"
                aria-label={isDesktopSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              >
                {isDesktopSidebarOpen ? <FaChevronRight /> : <FaChevronLeft />}
              </button>
              <button
                onClick={() => {
                  if (readmeContent) {
                    setSelectedPost({
                      path: [],
                      filename: 'Readme',
                      content: readmeContent
                    });
                  }
                }}
                className={`flex items-center gap-2 p-2 rounded-lg font-medium transition-all duration-300
                  ${selectedPost?.filename.toLowerCase() === 'readme' && selectedPost?.path.length === 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'}
                  `}
              >
                {pageTitle}
              </button>
            </div>
            {/* Control Buttons */}

            {/* Sidebar List */}
            <div
              className={`
                transition-all duration-300 overflow-hidden
                ${isDesktopSidebarOpen ? 'md:max-w-64 md:w-64' : 'md:max-w-0 md:w-0'}
              `}
            >
              <div
                className="p-4 flex flex-col gap-2 h-full bg-white shadow-md rounded-lg overflow-y-auto"
                ref={listRef}
              >
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                {renderTree(tree)}
              </div>
            </div>
            {/* Sidebar List */}

          </div>
        </div>

        {/* Mobile slide-out sidebar */}
        <div
          className={`
            fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white shadow-xl rounded-lg z-50 transform transition-transform duration-300
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
            md:hidden
          `}
        >
          <div className="p-4 flex flex-col gap-2 h-full">
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                placeholder={searchPlaceholder}
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
            {renderTree(tree)}
          </div>
        </div>

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </div>
    </div>
  );
}
