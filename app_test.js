require('dotenv').config();
const express = require('express')
const app = express()
app.use(express.static('images')) // images 폴더를 읽도록 함
const server = require('http').createServer(app);
const io = require('socket.io')(server)
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const url = "http://10.0.2.2:80/"

// mongodb 연결 부분

const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env;
const MONGO_URI = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@49.50.162.112:27017/test`;

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to mongodb'))
    .catch(e => console.error(e));

// room schema & model statement
const roomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
});

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
});

const chatSchema = new mongoose.Schema({
    room: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Room',
    },
    from : {
        type: String,
        required: true,
    },
    type : String,
    content : String,
    sendTime : String,
});
module.exports = mongoose.model('Chat', chatSchema);
module.exports = mongoose.model('Room', roomSchema);
module.exports = mongoose.model('Token', tokenSchema);


const Chat = mongoose.model('Chat', chatSchema);
const Room = mongoose.model('Room', roomSchema);
const Token = mongoose.model('Token', tokenSchema);



const multer = require('multer')
const randomstring = require('randomstring')
const imageUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `${__dirname}/images`) // images 폴더에 저장
        },
        filename: (req, file, cb) => {
            var fileName = randomstring.generate(25); // 랜덤 25자의 파일 이름
            var mimetype;
            switch (file.mimetype) {
                case 'image/jpeg':
                    mimeType = 'jpg';
                    break;
                case 'image/png':
                    mimeType = 'png';
                    break;
                case 'image/gif':
                    mimeType = 'gif';
                    break;
                case 'image/bmp':
                    mimeType = 'bmp';
                    break;
                default:
                    mimeType = 'jpg';
                    break;
            }
            cb(null, fileName + '.' + mimeType);
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,  // 5MB 로 크기 제한
    },
})

// 이미지 업로드
app.post('/upload', imageUpload.single('image'), (req, res) => {
    console.log(req.file)

    const imageData = {
        result : 1,
        imageUri : res.req.file.filename
    }
    res.send(JSON.stringify(imageData))
})

// 소켓 연결 코드
io.sockets.on('connection', (socket) => {
    console.log(`Socket connected : ${socket.id}`)

    socket.on('enter', async(data) => {
        const roomData = JSON.parse(data)
        const username = roomData.username
        const roomNumber = roomData.roomNumber
        try {
            let roomid = await Room.findOne({title: roomNumber});
            if(!roomid){
                await Room.create({
                    title : roomNumber,
                });
                roomid = await Room.findOne({title: roomNumber});
            }
            const myroomid = roomid._id;
            const msgs = await Chat.find({room : myroomid});
            for (i in msgs)
            {
                const msgdata = {
                    content : msgs[i].content,
                    from : msgs[i].from,
                    sendTime : msgs[i].sendTime,
                    to : roomid.title,
                    type: msgs[i].type
                }
                socket.emit('update', JSON.stringify(msgdata));
            }
            socket.join(`${roomNumber}`)
            console.log(`[Username : ${username}] entered [room number : ${roomNumber}]`)

            const enterData = {
                type : "ENTER",
                content : `${username} entered the room`
            }
            socket.broadcast.to(`${roomNumber}`).emit('update', JSON.stringify(enterData))
        } catch(error){
            console.error(error);
        }
    })

    socket.on('left', (data) => {
        const roomData = JSON.parse(data)
        const username = roomData.username
        const roomNumber = roomData.roomNumber

        socket.leave(`${roomNumber}`)
        console.log(`[Username : ${username}] left [room number : ${roomNumber}]`)

        const leftData = {
            type : "LEFT",
            content : `${username} left the room`
        }
        socket.broadcast.to(`${roomNumber}`).emit('update', JSON.stringify(leftData))
    })

    socket.on('newMessage', async(data) => {
        const messageData = JSON.parse(data);
        const myRoom = await Room.findOne({title: messageData.to});
        await Chat.create({
            room : myRoom,
            type : messageData.type,
            from : messageData.from,
            content : messageData.content,
            sendTime : messageData.sendTime,
        });
        console.log(`[Room Number ${messageData.to}] ${messageData.from} : ${messageData.content}`)
        socket.broadcast.to(`${messageData.to}`).emit('update', JSON.stringify(messageData))
    })

    socket.on('newImage', async (data) => {
        const messageData = JSON.parse(data)
        const myRoom = await Room.findOne({title: messageData.to});

        // 안드로이드 에뮬레이터 기준으로 url은 10.0.2.2, 스마트폰에서 실험해보고 싶으면 자신의 ip 주소로 해야 한다.
        messageData.content = url + messageData.content
        await Chat.create({
            room : myRoom,
            type : messageData.type,
            from : messageData.from,
            content : messageData.content,
            sendTime : messageData.sendTime,
        });
        console.log(`[Room Number ${messageData.to}] ${messageData.from} : ${messageData.content}`)
        socket.broadcast.to(`${messageData.to}`).emit('update', JSON.stringify(messageData))
    })


    socket.on('disconnect', () => {
        console.log(`Socket disconnected : ${socket.id}`)
    })

    socket.on('token', async (data) => {
        const tokenRaw = JSON.parse(data)
        const token = tokenRaw.token
        const user = tokenRaw.user
        try {
            const tokens = await Token.findOne({token: token});
            if(!tokens){
                await Token.create({
                    token : token,
                });
            }
            console.log(`[Token : ${token}] added`)
        } catch(error){
            console.error(error);
        }
    })

})

server.listen(80, () => {
    console.log(`Server listening at`.concat(" ", url))
})

module.exports = server;