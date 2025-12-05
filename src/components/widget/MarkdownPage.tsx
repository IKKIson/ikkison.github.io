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
              // // 외부 링크 (http/https) 또는 절대 경로 (/)는 그대로 사용
              // if (src && (src.startsWith('http') || src.startsWith('/'))) {
              //   return <img {...props} className="max-w-full h-auto rounded-md" alt={props.alt || ''} />;
              // }
              // // 상대 경로 처리
              // const finalSrc = `${baseImagePath}/${src.replace(/^\.?\//, '')}`;
              // return <img {...props} src={finalSrc} className="max-w-full h-auto rounded-md" alt={props.alt || ''} />;
              
              // 1. src가 없으면 (undefined나 null이면) null이나 기본값을 반환하여 런타임 오류 방지
              if (!src) {
                // 이미지가 없거나 src 속성이 누락된 경우입니다.
                return null; 
              }

              // 2. 외부 링크 (http/https) 또는 절대 경로 (/)는 그대로 사용
              if (src.startsWith('http') || src.startsWith('/')) {
                return <img {...props} className="max-w-full h-auto rounded-md" alt={props.alt || ''} />;
              }
              
              // 3. 상대 경로 처리 (src가 문자열임이 1번 if문에서 보장됨)
              // 이제 TypeScript는 src가 확실히 문자열임을 알기 때문에 오류가 해결됩니다.
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
