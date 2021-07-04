const express = require("express");
const logger = require("morgan");
const socketio = require("socket.io");
const http = require("http");
const path = require("path")
const port = process.env.PORT || 4001;
const cors = require("cors");
const { dirname } = require("path");
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
    }
});

app.use(cors());
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, '/client')))

app.get('/', (req, res) => {
    res.sendFile((path.join(__dirname,'../', 'client', 'index.html')))
})

app.get('/script.js', (req, res) => {
    res.sendFile((path.join(__dirname,'../', 'client', 'script.js')))
})

app.get('/style.css', (req, res) => {
    res.sendFile((path.join(__dirname,'../', 'client', 'style.css')))
})

io.on('connection', (socket) => {
    console.log('New user connection')

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})

// let interval;

// io.on("connection", (socket) => {
//   console.log("New client connected");
//   if (interval) {
//     clearInterval(interval);
//   }
//   interval = setInterval(() => getApiAndEmit(socket), 1000);

//   socket.on("connect_error", (err) => {
//     console.log(`connect_error due to ${err.message}`);
//   });

//   socket.on('join', ({ name, room }, callback) => {
//     const { error, user } = addUser({ id: socket.id, name, room });

//     if (error) return callback(error);

//     socket.emit('message', { user: 'admin', text: `Welcome to the chat ${user.name}` });
//     socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined the chat!` })
//     socket.join(user.room);

//     io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
//     callback();
//   });

//   socket.on("disconnect", () => {
//     const user = removeUser(socket.id);

//     if(user){
//       io.to(user.room).emit('message', {user:'admin', text:`${user.name} disconnected...`})
//     }

//     clearInterval(interval);
//   });
// });

// const getApiAndEmit = socket => {
//   const response = new Date();
//   // Emitting a new message. Will be consumed by the client
//   socket.emit("FromAPI", response);
// };

server.listen(port, () => console.log(`Listening on port ${port}`));