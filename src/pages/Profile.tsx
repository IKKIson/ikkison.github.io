import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../styles.css'; // 공통 스타일 import

const Profile = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch('/ikkison.github.io/markdown/profile/Profile.md')
      .then((response) => response.text())
      .then((text) => setMarkdown(text));
  }, []);

  return (
    <div className="profile-container mx-auto max-w-3xl py-8 px-4 sm:px-6 lg:px-8 prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default Profile;
