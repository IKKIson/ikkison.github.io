// src/components/widget/ScrollButtons.tsx
import { useLocation } from 'react-router-dom';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
// import '../../styles.css'; // TODO : apply

export default function ScrollButtons() {
  const location = useLocation();

  // 홈페이지에서는 버튼을 렌더링하지 않음
  if (location.pathname === '/') {
    return null;
  }

  // 페이지 최상단으로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // 부드러운 스크롤 효과
    });
  };

  // 페이지 최하단으로 스크롤하는 함수
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth', // 부드러운 스크롤 효과
    });
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
      <button
        onClick={scrollToTop}
        className="p-3 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-colors duration-300"
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
      <button
        onClick={scrollToBottom}
        className="p-3 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition-colors duration-300"
        aria-label="Scroll to bottom"
      >
        <FaArrowDown />
      </button>
    </div>
  );
}
