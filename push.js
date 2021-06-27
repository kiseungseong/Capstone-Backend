
const admin = require('firebase-admin')
let serAccount = require('../capstone_backend/key.json')

admin.initializeApp({
    credential: admin.credential.cert(serAccount),
})
const registrationToken = "TOKEN HERE";

const fs = require('fs');

function viewLog(){
    const log = fs.readFileSync("PUT-YOUR-LOG-DIR-HERE\\test.txt").toString().split("\r\n");
    const late_log = log[log.length-2].split(", ");
    class_detected = late_log[1]
    is_detected = late_log[2]
    if (class_detected == 0)
    {
        console.log(late_log)
        console.log("Fall Accident Detected");
    }
    else if(class_detected==1)
    {
        console.log(late_log)
        console.log("Help Sign Detected");
    }
    return late_log;
}

function automation()
{
    const loglog = viewLog();
    let class_detected = loglog[1]
    let is_detected = loglog[2]

    let payload;

        if(class_detected == 0) // 낙상 탐지됬을때
        {
            payload = {
                notification: {
                    title: "사용자의 낙상 탐지",
                    body: "낙상이 탐지되었습니다. 연락요망"
                }
            };
        }
        else if (class_detected == 1)  {
            payload = {
                notification: {
                    title: "사용자가 도움을 요청함",
                    body: "사용자의 도움이 탐지되었습니다. 연락요망"
                }
            };
        }
        else
        {
            return;
        }

    admin.messaging().sendToDevice(registrationToken, payload)
        .then(function (response) {
            console.log("Successfully Sent", response);
        })
        .catch(function (error) {
            console.log("Error Occurred", error);
        });
}

setInterval(automation, 7000);