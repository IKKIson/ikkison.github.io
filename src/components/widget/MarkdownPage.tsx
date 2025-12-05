// src/components/widget/MarkdownPage.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// --- 타입 정의 ---

type CustomCodeProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
};

type MarkdownRendererProps = {
  content: string;
  baseImagePath: string;
};

// --- 컴포넌트 ---

export default function RenderMarkdownPage({ content, baseImagePath }: MarkdownRendererProps) {
  return (
    <div className="w-full md:w-4/5 lg:max-w-4xl bg-white rounded-lg shadow-md border border-gray-200 prose prose-purple dark:prose-invert overflow-auto h-full min-h-0">
      <div className="p-6">
        <ReactMarkdown
          children={content}
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ node, ...props }) => {
              const src = props.src;
              // 외부 링크 (http/https) 또는 절대 경로 (/)는 그대로 사용
              if (src && (src.startsWith('http') || src.startsWith('/'))) {
                return <img {...props} className="max-w-full h-auto rounded-md" alt={props.alt || ''} />;
              }
              // 상대 경로 처리
              const finalSrc = `${baseImagePath}/${src.replace(/^\.?\//, '')}`;
              return <img {...props} src={finalSrc} className="max-w-full h-auto rounded-md" alt={props.alt || ''} />;
            },
            code: ({ node, inline, className, children, ...props }: CustomCodeProps) => {
              const match = /language-(\w+)/.exec(className || '');
              if (inline) {
                return <code {...props} className="bg-gray-100 dark:bg-gray-800 p-1 rounded-md text-sm break-words">{children}</code>;
              }
              return match ? (
                <SyntaxHighlighter
                  {...props}
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, padding: '1rem', borderRadius: '0.5rem' }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code {...props} className={className}>{children}</code>
              );
            },
          }}
        />
      </div>
    </div>
  );
}
