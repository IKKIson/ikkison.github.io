const r=`# deepSame 다국어 음성복제 립싱크 서비스\r
\r
- **소속 :** 엘솔루 / 연구개발본부 / 음성AI 개발팀 / 주임연구원\r
- **기간 :** 2024.08 ~ 2025.02\r
\r
## 프로젝트 설명\r
\r
- 동영상 화자의 다국어 발화 및 립싱크 AI 서비스\r
- 다국어 자동 자막 생성\r
- 다국어 TTS 변환\r
- 다국어 TTS 에 맞춘 화자 립싱크 변환\r
\r
---\r
\r
## 담당 개발\r
\r
1. 다국어 음성인식을 위한 Whipser 서빙 개발\r
2. 자사 솔루션 및 AI서버를 위한 Gateway 서버 개발\r
3. Mintlify API 서버 도입\r
4. 립싱크를 고려한 Syllable 기반 LLM번역 방식 적용\r
5. AWS EC2 구축\r
\r
### 1. 다국어 음성인식을 위한 Whipser 서빙 개발\r
\r
**기술 스택:** Python3, FastAPI, Whisper(WhisperX, Faster-Whisper)\r
\r
#### Problem 01. Speech Language Detection Performance\r
\r
- 상황\r
  - 동영상에서 추출된 오디오의 발화 언어를 인지하여 한국어는 자사 STT 엔진(AITranscribe) , 그외 언어는 Whisper로 STT 추론. 이후 자사 NMT 엔진으로 다국어 대응.\r
  - STT엔진 분기를 위해 언어 감지 필요.\r
  - 자연스러운 Language Detection을 위해서는 최소한 EPD 문장 단위로 인지 필요.\r
- 문제\r
  - 자사 솔루션을 활용하여 Language Deteciton 전용 Voice Activity Detection 방법론?\r
    - 자사 E2E STT의 경우 한국어 음성인식만 가능하며, 외국어 오디오를 강제로 Decoding 할 경우 TimeStamp 정보가 보장되지 않음.\r
    - 자사 Hybrid STT의 경우 한국어, 영어 음성인식만 가능하고 TimeStamp의 정확도가 매우 높지만, 외국어 오디오를 강제로 Decoding 할 경우 TimeStamp 정보가 보장되지 않음.\r
  - 최초 버전으로써 Whisper에서 transcribe 직전 내부에서 사용되는 detection_language을 별도 구현 필요.\r
- 해결 방안\r
  - \r
- 해결/결과\r
  - faster_whisper 내부 소스를 활용하여 입력 오디오의 Language Deteciton 구현 및 RestAPI 설계\r
- 개선 과제\r
  - 발화구간 추출\r
    - Pyannote, silero-vad 등 별도 VAD 도입 여부 평가\r
    - 다국어 TimeStamp를 위한 WhisperX 성능 및 스펙 평가\r
  - 발화구간 내 감지 구간 최적화\r
- Reference\r
\r
#### Problem 02. Faster-Whisper TimeStamp\r
\r
- 상황\r
  - [faster-whisper](https://github.com/SYSTRAN/faster-whisper) 최초 서빙 후 TimeStamp 정확도가 떨어짐\r
  - faster-whisper 내 silero-vad가 상용화 수준의 성능이 아님.\r
  - silero-vad 미사용 시 Rule Based로 Align이 생성되는데, 동일 오디오를 여러번 추론시 간투사가 인식이 일관적이지 않은(인식되다 안되다) 상황에서, Align이 이를 고려하지 않음.\r
- 문제\r
  - 한국어 오디오에서 silero-vad의 평가가 필요하며, 실데이터 디코딩 및 비교하는데 비용(작업시간 + AWS EC2)이 발생함.\r
- 해결방안\r
   1. AcousticModel/lacttice/laxicon 기반 Alignment의 경우 성능이 높고 상용화검증이 되었지만, 언어별 개발이 필요함.\r
   2. \r
- 해결/결과\r
  -\r
\r
### 2. 자사 솔루션 및 AI서버를 위한 Gateway 서버 개발\r
\r
**기술 스택:**\r
\r
### 3. Mintlify API 서버 도입\r
\r
**기술 스택:**\r
\r
### 4. 립싱크를 고려한 Syllable 기반 LLM번역 방식 적용\r
\r
**기술 스택:**\r
\r
### 5. AWS EC2 구축\r
\r
**기술 스택:**\r
`;export{r as default};
