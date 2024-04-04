import * as socketio from "socket.io-client";

//connect to server
const socket:socketio.Socket = socketio.io("http://localhost:3001");



export default socket;