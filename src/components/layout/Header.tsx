// React의 useState 훅을 임포트
// 컴포넌트 내부에서 상태(state)를 관리할 수 있음
import { useState } from 'react';

// React Router의 Link 임포트
// SPA 환경에서 페이지 이동 시 새로고침 없이 URL 변경
import { Link } from 'react-router-dom';

// React Icons에서 햄버거 메뉴(FaBars)와 닫기 아이콘(FaTimes) 임포트
import { FaBars, FaTimes } from 'react-icons/fa';

// 공통 CSS import (색상, 카드, Header 스타일 등)
import '../../styles.css';

export default function Header() {

  // 모바일 메뉴 열림/닫힘 상태를 관리하는 state
  // 초기값 false -> 메뉴 닫힘
  const [isOpen, setIsOpen] = useState(false);

  // 메뉴 토글 함수
  // 클릭할 때마다 isOpen 상태를 반전
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    // 최상위 header 태그
    // className="header" → common.css에서 배경색, 글자색, 패딩, 그림자 관리
    <header className="header">

      {/* 헤더 내부 컨테이너 */}
      {/* container mx-auto → 중앙 정렬, 최대 너비 지정 */}
      {/* flex justify-between items-center → 좌우 배치 및 수직 가운데 정렬 */}
      <div className="container mx-auto flex justify-between items-center">
        
        {/* 로고 / 사이트 제목 */}
        {/* Link to="/" → 홈페이지로 이동 */}
        {/* Tailwind 클래스 적용: text-2xl, font-bold, hover 효과, transition */}
        <Link to="/" className="text-2xl font-bold hover:text-gray-200 transition duration-300">
          IKKIson
        </Link>

        {/* 1. 데스크톱 메뉴 (MD 이상 화면에서만 보임) */}
        {/* hidden md:flex → 기본 숨김, md 이상에서 flex */}
        {/* space-x-6 → 메뉴 아이템 사이 간격 */}
        <nav className="hidden md:flex space-x-6">
          {/* 홈화면 */}
          <Link to="/" className="header-nav-link">Home</Link>
          {/* 프로필 화면 */}
          <Link to="/profile" className="header-nav-link">Profile</Link>
          {/* 포트폴리오 화면 */}
          <Link to="/portfolio" className="header-nav-link">Portfolio</Link>
          {/* 블로그 화면 */}
          <Link to="/blog" className="header-nav-link">Blog</Link>
          {/* GitHub 링크 */}
          <Link to="https://github.com/ikkison" className="header-nav-link" target="_blank">GitHub</Link>
        </nav>

        {/* 2. 모바일 메뉴 버튼 */}
        {/* md:hidden → MD 이상 화면에서는 숨김 */}
        {/* text-2xl → 아이콘 크기 */}
        {/* onClick → 클릭 시 toggleMenu() 실행 */}
        {/* aria-label → 접근성(스크린 리더용) */}
        <button 
          className="header-mobile-btn" 
          onClick={toggleMenu} 
          aria-label="Toggle navigation menu"
        >
          {/* 메뉴 열림 상태에 따라 아이콘 변경 */}
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* 3. 모바일 메뉴 */}
      {/* md:hidden → MD 이상 화면에서는 숨김 */}
      {/* mt-4 → 상단 여백 */}
      {/* transition-all duration-300 ease-in-out → 애니메이션 */}
      {/* isOpen 상태에 따라 open / closed 클래스 적용 → CSS에서 max-height와 opacity 조절 */}
      <nav className={`header-mobile-menu ${isOpen ? 'open' : 'closed'}`} aria-expanded={isOpen}>
        
        {/* 모바일 메뉴 아이템 컨테이너 */}
        {/* flex flex-col → 세로 방향 정렬 */}
        {/* space-y-2 → 아이템 간 세로 간격 */}
        <div className="flex flex-col space-y-2">
          {/* 각 메뉴 링크 */}
          {/* 클릭 시 toggleMenu 호출 → 메뉴 닫힘 */}
          {/* className="header-mobile-link" → hover 색상, padding, rounded 등 common.css에서 관리 */}
          <Link to="/" onClick={toggleMenu} className="header-mobile-link">Home</Link>
          <Link to="/profile" onClick={toggleMenu} className="header-mobile-link">Profile</Link>
{/* TODO : not yet todo app */}
          {/* <Link to="/todo" onClick={toggleMenu} className="header-mobile-link">Todo</Link> */}
          <Link to="/portfolio" onClick={toggleMenu} className="header-mobile-link">Portfolio</Link>
          <Link to="/blog" onClick={toggleMenu} className="header-mobile-link">Blog</Link>
        </div>
      </nav>

    </header>
  );
}