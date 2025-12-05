// src/pages/Portfolio.tsx
import MarkdownMultiPage from '../components/layout/body/MarkdownMultiPage';

export default function Portfolio() {
  return (
    <MarkdownMultiPage
      basePath="/markdown/portfolio"
      pageTitle="Portfolio"
      searchPlaceholder="Search projects..."
      loadingMessage="Loading portfolio..."
      sortByDate={true}
    />
  );
}
