import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../styles.css'; // 공통 스타일 import

const Profile = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch('/markdown/profile/Profile.md')
      .then((response) => response.text())
      .then((text) => setMarkdown(text));
  }, []);

  const components = {
    img: ({ node, ...props }: { node?: any; [key: string]: any }) => {
      // Check if src is a relative path
      if (props.src && !props.src.startsWith('http') && !props.src.startsWith('/')) {
        const baseUrl = '/markdown/profile/'; // Adjust this base URL if needed
        return <img {...props} src={baseUrl + props.src.replace('./', '')} />;
      }
      return <img {...props} />;
    },
  };

  return (
    <div className="profile-container mx-auto max-w-3xl py-8 px-4 sm:px-6 lg:px-8 prose bg-white rounded-lg shadow-md p-6 my-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default Profile;
