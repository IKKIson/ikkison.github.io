// app.tsx

// react-router-dom에서 BrowserRouter, Routes, Route를 가져옴.
// BrowserRouter를 Router로 alias해서 사용하고 있음.
// - BrowserRouter: HTML5 history API를 사용해 SPA 라우팅을 처리함.
// - Routes: 라우트 집합을 감싸는 컨테이너(react-router v6+ 방식).
// - Route: 경로(path)와 렌더링할 요소(element)를 매핑함.
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 각 페이지 컴포넌트들을 상대 경로로 임포트.
// 파일 구조는 보통 src/pages/Home.tsx 등으로 구성됨을 가정.
import Home from './pages/Home';
import Profile from './pages/Profile';
// TODO : not yet todo app
// import TodoApp from './pages/TodoApp';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';

// 공통 UI 컴포넌트(Header, Footer)를 임포트.
// 이 컴포넌트들은 페이지 간에 재사용되는 네비게이션/푸터 역할을 함.
import Header from './components/Header';
import Footer from './components/Footer';

// 함수형 컴포넌트로 App을 정의하고 기본 export함.
// 이 컴포넌트가 애플리케이션의 최상위 레이아웃이자 라우팅 진입점 역할을 함.
export default function App() {
  return (
    // Router로 전체 앱을 감싸면 내부의 Route/Link가 동작함.
    // basename 속성은 앱이 호스팅되는 "베이스 경로"를 지정 (예: GitHub Pages의 repo 경로).
    // 만약 사용자 페이지(username.github.io)처럼 root에서 제공된다면 basename은 '/' 또는 생략 가능.
    <Router basename="/">
      {/* Tailwind를 이용한 레이아웃 컨테이너 */}
      {/* flex flex-col: 수직 방향 플렉스 레이아웃으로 Header, main, Footer를 쌓음 */}
      {/* min-h-screen: 화면 전체 높이 확보 -> 푸터를 하단에 고정시키는 'sticky footer' 패턴에 사용 */}
      <div className="flex flex-col min-h-screen">
        {/* 공통 헤더: 일반적으로 네비게이션 바, 로고, 링크 등을 포함 */}
        <Header />

        {/* main 태그는 문서의 주요 콘텐츠를 의미하는 시맨틱 태그 */}
        {/* flex-1: 플렉스 컨테이너에서 남은 공간을 차지하게 하여 푸터가 하단에 위치하도록 함 */}
        <main className="flex-1 overflow-hidden">
          {/* Routes 내부에 여러 Route를 정의하여 경로별로 페이지 컴포넌트를 매핑 */}
          <Routes>
            {/* "/" 루트 경로에 Home 컴포넌트 연결 */}
            <Route path="/" element={<Home />} />

            {/* "/profile" 경로에 Profile 컴포넌트 연결 */}
            <Route path="/profile" element={<Profile />} />

            {/* TODO : not yet todo app*/}
            {/* <Route path="/todo" element={<TodoApp />} /> */}

            {/* 기타 페이지들: 포트폴리오, 블로그 등 */}
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </main>

        {/* 공통 푸터: 저작권, 링크, 연락처 등을 표시 */}
        <Footer />
      </div>
    </Router>
  );
}
