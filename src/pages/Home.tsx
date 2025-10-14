// 공통 CSS import (Tailwind + 카드 스타일 포함)
import '../styles.css';

// 재사용 카드 컴포넌트 import
import Card from '../components/Card';

// 홈 화면에서 보여줄 카드 데이터 정의
// title, description, link, color, icon, tags 포함
const cards = [
  {
    title: 'Profile',
    description: '안녕하세요, 자기소개 페이지입니다.',
    link: '/profile',
    color: 'card-purple',
    icon: '👤',
    tags: ['개인', '소개'],
  },
  {
    title: 'Portfolio',
    description: '내가 만든 프로젝트를 볼 수 있습니다.',
    link: '/portfolio',
    color: 'card-pink',
    icon: '💻',
    tags: ['프로젝트', '개발'],
  },
  {
    title: 'Blog',
    description: '학습/개발 기록과 경험을 기록한 블로그',
    link: '/blog',
    color: 'card-yellow',
    icon: '📝',
    tags: ['기록', '개발', '학습'],
  },
];

// Home 컴포넌트 정의
export default function Home() {
  return (
    // 최상위 컨테이너
    // flex flex-col: 세로 방향 레이아웃
    // items-center: 가로 중앙 정렬
    // justify-center: 세로 중앙 정렬
    // min-h-screen: 화면 전체 높이 확보
    // p-4: padding
    // bg-gray-100: 배경색
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      
      {/* 페이지 제목 */}
      {/* text-4xl: 글자 크기, font-bold: 글자 굵게, mb-8: 아래 여백, text-center: 가운데 정렬 */}
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to IKKIson</h1>

      {/* 반응형 그리드 */}
      {/* grid-cols-1: 모바일 1열, sm:grid-cols-2: 작은 화면 이상 2열, lg:grid-cols-3: 큰 화면 이상 3열 */}
      {/* gap-6: 카드 사이 간격 */}
      {/* w-full max-w-6xl: 최대 너비 제한 */}
      {/* justify-items-center: 그리드 아이템 가로 중앙 정렬 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl justify-items-center">

        {/* cards 배열 반복 렌더링 */}
        {cards.map((card) => (
          // Card 컴포넌트 사용
          // key: 반복 렌더링 시 고유 키
          // props: 카드 데이터 전달
          <Card
            key={card.title}
            title={card.title}
            description={card.description}
            link={card.link}
            color={card.color}
            icon={card.icon}
            tags={card.tags}
          />
        ))}
      </div>
    </div>
  );
}
