import cv2
import numpy as np
import time
import queue
import threading
import os
os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;udp"

q = queue.Queue()

# YOLO 가중치 파일과 CFG 파일 로드
YOLO_net = cv2.dnn.readNet("yolov4-obj_best.weights", "yolov4-obj.cfg")
io_log = open('test.txt', mode='a')

# 파라미터 불러오기
# YOLO NETWORK 재구성
classes = []
with open("obj.names", "r") as f:
    classes = [line.strip() for line in f.readlines()]
layer_names = YOLO_net.getLayerNames()
output_layers = [layer_names[i[0] - 1] for i in YOLO_net.getUnconnectedOutLayers()]


def Receive():
    print("Receiving...")
    # 웹캠 신호 받기
    url1 = "rtsp://root:root@PUT-YOUR-IP-HERE:9080//cam0_0"
    url2 = "rtsp://root:root@PUT-YOUR-IP-HERE:9080//cam0_0"
    videofile = "test.mp4"
    VideoSignal = cv2.VideoCapture(url1, cv2.CAP_FFMPEG)
    # VideoSignal.set(cv2.CAP_PROP_BUFFERSIZE, 3) # Setting buffer size
    ret, frame = VideoSignal.read()
    q.put(frame)
    while ret:
        ret, frame = VideoSignal.read()
        q.put(frame)


def Detect():
    print("Detecting...")
    # 객체 검출 단계
    while True:
        if q.empty() != True:
            frame = q.get()
            h, w, c = frame.shape
            cv2.imshow("Object Detector-Prototype", frame)

            # YOLO 입력
            blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
            YOLO_net.setInput(blob)
            outs = YOLO_net.forward(output_layers)

            class_ids = []
            confidences = []
            boxes = []

            # NMS를 통한 최종 검출정보 최적화

            for out in outs:

                for detection in out:

                    scores = detection[5:]
                    class_id = np.argmax(scores)
                    confidence = scores[class_id]

                    if confidence > 0.75:
                        # Object detected msg, msg logging...
                        tt = time.strftime('%Y-%m-%d', time.localtime(time.time()))
                        log = "%s, %d, %d\n" % (tt, int(class_id), 0)
                        print(log)
                        io_log.write(log)

                        center_x = int(detection[0] * w)
                        center_y = int(detection[1] * h)
                        dw = int(detection[2] * w)
                        dh = int(detection[3] * h)
                        # Rectangle coordinate
                        x = int(center_x - dw / 2)
                        y = int(center_y - dh / 2)
                        boxes.append([x, y, dw, dh])
                        confidences.append(float(confidence))
                        class_ids.append(class_id)
                    io_log.flush()  # 강제로 출력하게 한다

            indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.45, 0.4)
        # 최종적으로 도출된 경계상자와 클래스정보를 이미지에 투영
            for i in range(len(boxes)):
                if i in indexes:
                    x, y, w, h = boxes[i]
                    label = str(classes[class_ids[i]])
                    score = confidences[i]

                    # 경계상자와 클래스 정보 이미지에 입력
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 5)
                    cv2.putText(frame, label, (x, y - 20), cv2.FONT_ITALIC, 0.5,
                    (255, 255, 255), 1)

            if cv2.waitKey(500) > 0:    # 15초 기달려도 실행이 안되면...
                break


if __name__ == '__main__':
    p1 = threading.Thread(target = Receive)
    p2 = threading.Thread(target = Detect)
    p1.start()
    p2.start()
