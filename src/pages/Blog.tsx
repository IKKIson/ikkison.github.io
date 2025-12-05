// src/pages/Blog.tsx
import MarkdownMultiPage from '../components/layout/body/MarkdownMultiPage';

export default function Blog() {
  return (
    <MarkdownMultiPage
      basePath="/markdown/blog"
      pageTitle="Blog"
      searchPlaceholder="Search posts..."
      loadingMessage="Loading blog posts..."
      sortByDate={false}
    />
  );
}
