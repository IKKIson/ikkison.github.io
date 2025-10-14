// React 자체를 임포트. 최신 JSX 자동 변환이 활성화된 설정에서는 JSX 사용을 위해 반드시 필요하지는 않지만,
// 타입 참조나 일부 라이브러리 호환을 위해 명시적으로 가져오는 경우가 많음.
import React from 'react';

// 브라우저 DOM에 React 앱을 붙이기 위한 렌더러를 임포트.
// 'react-dom/client'의 createRoot API는 React의 동시성 기능과 현대적 루트 관리 방식을 사용하게 해줌.
import ReactDOM from 'react-dom/client';

// 앱의 최상위 컴포넌트. 실제 화면 구성과 라우팅을 이 컴포넌트에서 처리함.
// 상대 경로로 App 컴포넌트를 불러옴(확장자 .tsx는 생략 가능).
import App from './App';

// 전역 스타일(CSS)을 불러옴. Vite 번들러가 이 import를 처리해 빌드 시 CSS를 포함시킴.
// 여기서는 Tailwind 또는 사용자 정의 전역 스타일을 적용하는 파일일 가능성이 큼.
import './index.css';

// document.getElementById('root')로 root DOM 노드를 찾음.
// 타입스크립트의 '!'(non-null assertion)는 null이 아님을 컴파일러에 보장시키지만,
// 실제로 해당 id가 없으면 런타임에서 오류가 발생함(따라서 index.html에 <div id="root">가 있어야 함).
// createRoot(...)는 React 루트를 생성하고, 그 결과에 .render(...)로 React 컴포넌트를 마운트함.
ReactDOM.createRoot(document.getElementById('root')!).render(
  // React.StrictMode는 개발 환경에서 추가적인 검사(안전한 라이프사이클 패턴, 레거시 API 경고 등)를 수행.
  // 프로덕션 빌드에서는 별다른 부작용 없이 제거됨. 일부 훅/컴포넌트가 개발 중에 두 번 렌더링될 수 있음.
  <React.StrictMode>
    {/* 실제 애플리케이션의 진입점 컴포넌트를 렌더링 */}
    <App />
  </React.StrictMode>,
);