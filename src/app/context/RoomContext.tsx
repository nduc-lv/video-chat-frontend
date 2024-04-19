'use client'
import socket from "../utils/socket/socketIndex";
import { useState, useContext, useEffect, createContext, useRef} from "react";
// import Peer from "peerjs";
import { UserContext } from "./UserContext";
import { useRouter } from "next/navigation";
import { MediaConnection } from "peerjs";
import { MutableRefObject } from "react";
interface RoomValue{
    myStream: MediaStream | undefined,
    peerStream: MediaStream | undefined,
    call: MediaConnection | undefined,
    roomId: string | undefined,
    setRoomId: any,
    checkInRoom: MutableRefObject<boolean>,
    setMyStream: any,
    setConnect: any,
}
let Peer:any;
if (typeof navigator !== "undefined") {
    Peer = require("peerjs").default
}
export const RoomContext = createContext<any>({})
export const RoomProvider = ({children}:any) => {
    const [myPeer, setMyPeer] = useState();
    const [myStream, setMyStream] = useState<MediaStream>();
    const [peerStream, setPeerStream] = useState<MediaStream>();
    const [isConnect, setConnect] = useState(false);
    const {interests, setInterests, userId, setUserId} = useContext(UserContext);
    const [dataChannel, setDataChannel] = useState<RTCDataChannel | undefined>();
    const [roomId, setRoomId] = useState<string | undefined>();
    const checkInRoom = useRef<boolean>(false);
    const router = useRouter();
    let callSave = useRef<MediaConnection>()
    let currStream;
    // 2 things need to do
    // return myStream
    // return peerStream
    useEffect(() => {
        if (!userId){
            return;
        };
        if (typeof navigator !== 'undefined'){
            navigator.mediaDevices.getUserMedia({audio: true, video: true}).
            then((stream) => {
                setMyStream(stream);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }, [userId])
    useEffect(() => {
        // only run when the userId change
        // create peer connection to the peer server
        console.log("connect to peer server and get media")
        if (!myStream){
            return;
        }
        if (!isConnect){
            return;
        }
        const peer = new Peer(userId, {
            host: "peerserver.adaptable.app",
            port: 443,
            config: {iceServers: [
                    {url:'stun:stun.l.google.com:19302'},
                    {url:'stun:stun1.l.google.com:19302'},
                    {url:'stun:stun2.l.google.com:19302'},
                    {url:'stun:stun3.l.google.com:19302'},
                    {url:'stun:stun4.l.google.com:19302'},
                    {
                        url: "stun:stun.relay.metered.ca:80",
                      },
                      {
                        url: "turn:standard.relay.metered.ca:80",
                        username: "4133888f4501dc86e9225127",
                        credential: "KkpzqFDpkTsODb+r",
                      },
                      {
                        url: "turn:standard.relay.metered.ca:80?transport=tcp",
                        username: "4133888f4501dc86e9225127",
                        credential: "KkpzqFDpkTsODb+r",
                      },
                      {
                        url: "turn:standard.relay.metered.ca:443",
                        username: "4133888f4501dc86e9225127",
                        credential: "KkpzqFDpkTsODb+r",
                      },
                      {
                        url: "turns:standard.relay.metered.ca:443?transport=tcp",
                        username: "4133888f4501dc86e9225127",
                        credential: "KkpzqFDpkTsODb+r",
                    },
              ]}
        });
        peer.on("open", () => {
            console.log("peer-success");
            socket.emit("peer-success", socket.id);
        })
        peer.on("error", (err) => {
            console.log("peer-fail", err);
            socket.emit("peer-fail");
        })
        // listen for other peer's calling
        peer.on("call", (call) => {
            console.log("received call")
            socket.emit("connection-ebstablished", socket.id);
            callSave.current = call;
            call.on("close", () => {
                myStream?.getTracks().forEach((track) => {
                    track.stop();
                    myStream.removeTrack(track);
                })
                peer.destroy();
                setMyPeer((e:any) => undefined);
                checkInRoom.current = false; 
                console.log("close")
                router.push("/endCall");
            })
            callSave.current.on("stream", (incomingStream) => {
                setPeerStream(incomingStream);
            })
            console.log("this guy answer", peer);
            callSave.current.answer(myStream);
        })
        setMyPeer(e => peer);
    }, [myStream, isConnect]);
    // stream
    useEffect(() => {
        // run when peer and stream change (set is invoked)
        console.log("add listener");
        console.log("my peer", myPeer);
        if (!myPeer){
            return;
        }
        if (!myStream){
            return;
        }
        // })
        // after an user join-room -> call that user
        socket.on("user-connected", (peerId) => {
            console.log("done matching, now calling...")
            setTimeout(() =>{
                callSave.current = myPeer.call(peerId, myStream);
                callSave.current.on("error", () => {
                    console.log("something went wrong")
                    socket.emit("connection-failed", socket.id);
                })
                callSave.current.on("stream", () => {
                    socket.emit("connection-ebstablished",socket.id);
                })
                // if (!callSave.current){
                //     console.log(myPeer.call(peerId, myStream))
                // }
                // console.log(callSave.current.dataChannel);
                callSave.current.on("close", () => {
                    myStream.getTracks().forEach((track) => {
                        track.stop();
                        myStream.removeTrack(track);
                    })
                    setMyPeer(e => undefined);
                    myPeer.destroy();
                    checkInRoom.current = false;
                    console.log("close");
                    router.push("/endCall");
                })
                setDataChannel(callSave.current.dataChannel);
                // console.log(myStream.getTracks());
                callSave.current.on("stream", (incomingStream) => {
                    setPeerStream(incomingStream);
                })
            }, 1000);
        })
        
        return () => {
            socket.off("user-connected");
        }
    }, [myPeer, myStream, userId]);
   
    return (
        <RoomContext.Provider value={{
            myStream,
            peerStream,
            call: callSave.current,
            roomId,
            setRoomId,
            checkInRoom,
            setMyStream,
            setConnect
        }}>
            {children}
        </RoomContext.Provider>
    )
}