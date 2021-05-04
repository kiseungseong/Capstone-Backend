# Capstone Server(Back-end)
캡스톤디자인 백앤드서버 Repository

## Details
### Programming languages used
* Node.js (For Each Modules)
* Node.js Express (For Deployment)

## 요구사항 명세

## 명세된 요구사항 모듈화


## push.js 정리
Role : Object Detecter에서 탐지하여 로깅한 기록을 받아들여 Push Alarm을 위해 FCM에 이를 전달하는 역활 

## 중간발표 이후 진행예정사항 정리
* 이미지 교환 서버 구축 (파일 업로드&다운로드 서버를 구축하는 것, 프론트에서 REST Form으로 요청하면 받을 수 있게)
* 탐지 결과, 스냅톡 DB 구축 & 그룹 구분을 위한 정보 저장 필요 
* 구현 모듈 Docker Container화(Docker, Kubernetes 사전지식 필요)
* Latency 원인 탐색 및 최소화
  - CCTV가 무선 연결
  - 연산 돌리는 컴퓨터가 무선 연결
  - Computing Power가 딸림(CPU 동작)
* 개인정보보호를 위한 대책 마련 (주간계획 쓸 거 없을 때 써두자)
  - DB 암호화(Secure DB?)
* 구현 모듈 단위 테스트 및 통합 테스트
* Naver Cloud에 Deploy
  - 배포 프레임워크(Express) 사용법 숙지

## 우선순위 배정

Express에 대한 학습, Latency 한번 유선으로 한번 해보는걸로...<br>
if 해결되면 이걸로 끝, elif 안되면 세연테크에다가 메일을 보내보는 걸로...<br>
DB(NoSQL)에 대한 학습(병행), 기존 프로토타입에다가 연결하기(로그)
