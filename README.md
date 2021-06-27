# Capstone Server(Back-end)

### How-to Run

1. Clone this repository to your computer(Node.js, Python is required)

2. Create .env file & put your mongoose ID, Password 

3. Modify app_server.js(Server Env) or app_test.js(Desktop Env)

   * IP address(10.0.2.2 if localhost) with 'url' & 'MONGO_URI'

4. Add your app's key.json file to repository dir(if FCM needed)

   * Modify log directory path & file name to yours

5. Add your model's weights, cfg file(if FCM needed)

   * Modify RTSP url to yours

6. Run  app_server.js(Server Env) or app_test.js(Desktop Env)

7. Run push.js & Detection.py(if FCM needed)

   

### PL & Programs used

* Node.js, Express(Backend Architecture, Deployment)

* Python(For Detecting, OpenCV)

  MongoDB & Mongoose(Database)

  

#### Required Specific Module Version

* Socket.io: Ver. 2.2.0 required(connection with android app written in Kotlin)



#### Difficulties in Developing

* Socket.io didn't work with our android application

  &rarr; Problem fixed with using specific version of server-side Socket.io

* Latency occured in object detecting(since CPU based detecting)

  &rarr; Optimized Camera Settings to non-GPU detecting Environment

  * GOP Structure : 60 &rarr; 15
  * FPS : 30 &rarr; 5
  * Resolution : 1080p &rarr; 320p
  * TCP-based &rarr; UDP-based

* Detection Program terminated unintentionally (stacked up too many frames , frame lost)

  &rarr; modified detection process to multi-thread :

  * Extracts frames from streaming media

  * Analyzes each frame 

  * Writes analyzed results to log

    

## Description(Kor)

#### 요약

*  YOLO-v4 기반 객체 탐지 모델과 IP 카메라를 이용하여 실시간으로 위험 상황(낙상사고, 화재, 침입) 탐지

* 탐지된 결과를 기반으로 상황에 따른 위험상황 알림 메시지를 전송
* one to one 텍스트, 이미지 채팅 지원

#### 목적

* AI를 이용하여 원격으로 대상의 안전을 관리하고, 간단한 소통이 가능하도록 채팅 기능 지원 

#### 기대효과(프로젝트 전반)

* 원격 안전 관리 & 부모-자녀 간 소통 증진 & 사용자 친화적 UI(Front-end)

#### 차별점(프로젝트 전반)

* AI 기반 행동 탐지로 기존 어플 대비 사생활침해 우려가 전혀 존재하지 않음
* 같은 이유로 자동적이고 신속하게 위험 알림이 가능
* 카메라만 설치되어 있다면 누구나 가지고 있는 스마트폰으로 쉽게 이용 가능

#### 간략화한 서버 구성도

![project_env](https://github.com/byungkookkoo/Capstone-Backend/blob/main/project-env.png)
