// React Icons에서 이메일과 GitHub 아이콘 import
import { FaEnvelope, FaGithub } from 'react-icons/fa';

// 공통 CSS import (Footer 스타일 + 테마 색상 포함)
import '../../styles.css';

export default function Footer() {
  return (
    // 최상위 footer 태그
    // className="footer" → common.css에서 배경색, 글자색, padding, margin-top 관리
    <footer className="footer">

      {/* Footer 내부 컨테이너 */}
      {/* .footer-container → 중앙 정렬 + 최대 너비 관리 */}
      <div className="footer-container"> 
        
        {/* 상단 Flex 그룹: 연락처 + Copyright */}
        {/* .footer-flex → 모바일: flex-col(세로), md 이상: flex-row(가로), justify-between 적용 */}
        <div className="footer-flex"> 
          
          {/* 1. 연락처 / 링크 그룹 */}
          {/* .footer-links → 모바일: 세로 정렬, md 이상: 가로 정렬 */}
          <div className="footer-links">
            {/* 이메일 링크 */}
            {/* className="footer-link" → flex, 아이템 간격, hover 색상, transition 적용 */}
            <a href="mailto:shout2517@gmail.com" 
               className="footer-link">
              {/* 아이콘 */}
              <FaEnvelope className="footer-icon" />
              {/* 이메일 텍스트 */}
              <span>shout2517@gmail.com</span>
            </a>
            
            {/* GitHub 링크 */}
            {/* target="_blank" → 새 창에서 열기 */}
            {/* rel="noopener noreferrer" → 보안/성능 권장 */}
            <a href="https://github.com/ikkison" target="_blank" rel="noopener noreferrer" 
               className="footer-link">
              <FaGithub className="footer-icon" />
              <span>GitHub</span>
            </a>

            {/* GitHub Repository 링크 */}
            {/* target="_blank" → 새 창에서 열기 */}
            {/* rel="noopener noreferrer" → 보안/성능 권장 */}
            <a href="https://github.com/IKKIson/ikkison.github.io" target="_blank" rel="noopener noreferrer" 
               className="footer-link">
              <FaGithub className="footer-icon" />
              <span>Repository</span>
            </a>
          </div>

          {/* 2. Copyright 정보 */}
          {/* .footer-copyright → 모바일/데스크톱 모두 중앙/오른쪽 정렬 */}
          <div className="footer-copyright">
            &copy; 2025 ikkison.github.io. All rights reserved.
          </div>
          
        </div> {/* .footer-flex 종료 */}

      </div> {/* .footer-container 종료 */}

    </footer> /* footer 종료 */
  );
}
