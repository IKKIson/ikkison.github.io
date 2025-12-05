// react-router-dom에서 Link 임포트
// SPA 환경에서 페이지 이동 시 새로고침 없이 URL 변경 가능
import { Link } from 'react-router-dom';

// 공통 CSS import (카드 공통 스타일, 색상, 태그 스타일 포함)
import '../../styles.css';

// CardProps 타입 정의
// TypeScript를 사용하여 props의 타입 안정성 확보
interface CardProps {
  title: string;       // 카드 제목
  description: string; // 카드 설명
  link: string;        // 카드 클릭 시 이동할 URL
  color: string;       // common.css에서 정의한 배경색 클래스
  icon?: string;       // 선택적 카드 아이콘 (이모지나 문자)
  tags?: string[];     // 선택적 카드 태그 배열
}

// 재사용 Card 컴포넌트 정의
export default function Card({ title, description, link, color, icon, tags }: CardProps) {
  return (
    // Link: SPA 라우팅, 클릭 시 지정된 link로 이동
    // className: 공통 카드 스타일(card) + 배경색(color)
    <Link to={link} className={`card ${color}`}>
      
      {/* 아이콘 표시 (선택적) */}
      {/* text-4xl: 아이콘 크기, mb-2: 아래 여백 */}
      {icon && <div className="text-4xl mb-2">{icon}</div>}

      {/* 카드 제목 */}
      {/* text-xl: 글자 크기, font-bold: 굵게, mb-2: 아래 여백 */}
      <h2 className="text-xl font-bold mb-2">{title}</h2>

      {/* 카드 설명 */}
      {/* text-sm: 작은 글자, mb-2: 아래 여백 */}
      <p className="text-sm mb-2">{description}</p>

      {/* 카드 태그 표시 (선택적) */}
      {/* flex flex-wrap: 여러 태그 가로로 정렬 후 필요시 줄 바꿈 */}
      {/* gap-2: 태그 사이 간격 */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            // 개별 태그 span
            // className="card-tag": common.css에서 배경색, 글자색, padding, rounded 관리
            <span key={tag} className="card-tag">{tag}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
