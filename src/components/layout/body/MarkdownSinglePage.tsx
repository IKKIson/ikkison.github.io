// src/components/widget/MarkdownSinglePage.tsx
import { useEffect, useState } from 'react';
import RenderMarkdownPage from '../../widget/MarkdownPage';

import '../../../styles.css';

type MarkdownSinglePageProps = {
  filePath: string; // 예: "/markdown/profile/Profile.md"
};

// --- 컴포넌트 ---

export default function MarkdownSinglePage({ filePath }: MarkdownSinglePageProps) {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMarkdownContent(null); // 파일 경로 변경 시 콘텐츠 초기화
    setError(null); // 에러 초기화

    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load markdown file: ${response.statusText}`);
        }
        return response.text();
      })
      .then((text) => {
        setMarkdownContent(text);
      })
      .catch((err) => {
        console.error("Error loading markdown file:", err);
        setError("Failed to load content. Please try again later.");
      });
  }, [filePath]);

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (markdownContent === null) {
    return <div className="p-6 text-gray-500">Loading content...</div>;
  }

  const baseDir = filePath.substring(0, filePath.lastIndexOf('/'));

  return (
    <RenderMarkdownPage content={markdownContent} baseImagePath={baseDir} />
  );
}
