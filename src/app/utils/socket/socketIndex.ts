import * as socketio from "socket.io-client";

//connect to server
const socket:socketio.Socket = socketio.io("https://backend-server-419313.de.r.appspot.com", {transports: ['websocket']});

//https://backend-server-419313.de.r.appspot.com
//http://localhost:3001

export default socket;