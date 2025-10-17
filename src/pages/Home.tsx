// 공통 CSS import (Tailwind + 카드 스타일 포함)
import '../styles.css';

// 재사용 카드 컴포넌트 import
import Card from '../components/Card';

// 홈 화면에서 보여줄 카드 데이터 정의
// title, description, link, color, icon, tags 포함
const cards = [
  {
    title: 'Profile',
    description: '안녕하세요, 저를 소개합니다.',
    link: '/profile',
    color: 'card-purple',
    icon: '👤',
    tags: ['자기소개서', '이력서', 'CV', '경력기술서'],
  },
  {
    title: 'Portfolio',
    description: '내가 만든 프로젝트를 볼 수 있습니다.',
    link: '/portfolio',
    color: 'card-pink',
    icon: '💻',
    tags: ['포트폴리오', '프로젝트', '연구개발', '서비스'],
  },
  {
    title: 'Blog',
    description: '학습/개발 기록과 경험을 기록한 블로그',
    link: '/blog',
    color: 'card-yellow',
    icon: '📝',
    tags: ['기록', '개발', '학습', '취미', '생활'],
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
    // bg-opacity-80: 배경 투명도
    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 bg-opacity-80">
      
      {/* 페이지 제목 */}
      {/* text-4xl: 글자 크기, font-bold: 글자 굵게, mb-8: 아래 여백, text-center: 가운데 정렬 */}
      {/* <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-8 text-center leading-tight">
        IKKIson Online.
      </h3> */}

      {/* 배터 이미지 */}
      <img
        src="/img/IKKIson_online_banner_02.png"
        alt="IKKIson_online_banner_02"
        // className="w-60 h-60 rounded-full mx-auto mb-8 shadow-lg object-cover"
        className="h-40 rounded-lg mx-auto mb-8 shadow-lg object-cover"
      />

      {/* 나의 사진/이미지 */}
      <img
        src="/img/ikkison_ai_01.png"
        alt="IKKIson AI Portrait"
        // className="w-60 h-60 rounded-full mx-auto mb-8 shadow-lg object-cover"
        className="w-42 h-60 rounded-lg mx-auto mb-8 shadow-lg object-cover"
      />

      {/* 반응형 그리드 */}
      {/* grid-cols-1: 모바일 1열, sm:grid-cols-2: 작은 화면 이상 2열, lg:grid-cols-3: 큰 화면 이상 3열 */}
      {/* gap-6: 카드 사이 간격 */}
      {/* w-full max-w-6xl: 최대 너비 제한 */}
      {/* justify-items-center: 그리드 아이템 가로 중앙 정렬 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto justify-items-center">

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
      </div> {/* 그리드 종료 */}
      {/* 홈페이지 테마 색상 코드 시작 */}
      <div style={{ padding: '8px' }}>
        <hr style={{ margin: '8px 0' }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ backgroundColor: 'var(--color-purple)', color: '#fff', padding: '8px', borderRadius: '4px' }}> #845ec2</div>
          <div style={{ backgroundColor: 'var(--color-purple-grey)', color: '#fff', padding: '8px', borderRadius: '4px' }}> #998fcc</div>
          <div style={{ backgroundColor: 'var(--color-pink)', color: '#fff', padding: '8px', borderRadius: '4px' }}> #d65db1</div>
          <div style={{ backgroundColor: 'var(--color-red)', color: '#fff', padding: '8px', borderRadius: '4px' }}> #ff6f91</div>
          <div style={{ backgroundColor: 'var(--color-orange)', color: '#fff', padding: '8px', borderRadius: '4px' }}> #ff9671</div>
          <div style={{ backgroundColor: 'var(--color-yellow)', color: '#fff', padding: '8px', borderRadius: '4px' }}> #ffc75f</div>
          <div style={{ backgroundColor: 'var(--color-light-yellow)', color: '#fff', padding: '8px', borderRadius: '4px' }}> #f9f871</div>
        </div> {/* 색상코드 내부 종료 */}
      </div> {/* 색상코드 종료 */}
      {/* 홈페이지 테마 색상 코드 종료 */}
    </div> /* 최상위 컨테이너 종료 */
  );
}
