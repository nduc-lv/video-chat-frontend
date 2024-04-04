'use client'
import socket from "../utils/socket/socketIndex";
import { useState, useContext, useEffect, createContext, useRef} from "react";
import Peer from "peerjs";
import { UserContext } from "./UserContext";
import { useRouter } from "next/navigation";
import { MediaConnection } from "peerjs";
import { Dispatch, SetStateAction } from "react";
import { MutableRefObject } from "react";
interface RoomValue{
    myStream: MediaStream | undefined,
    peerStream: MediaStream | undefined,
    call: MediaConnection | undefined,
    roomId: string | undefined,
    setRoomId: any,
    checkInRoom: MutableRefObject<boolean>,
    setMyStream: any,
}

export const RoomContext = createContext<RoomValue>({})
export const RoomProvider = ({children}) => {
    const [myPeer, setMyPeer] = useState<Peer>();
    const [myStream, setMyStream] = useState<MediaStream>();
    const [peerStream, setPeerStream] = useState<MediaStream>();
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
        navigator.mediaDevices.getUserMedia({audio: true, video: true}).
        then((stream) => {
            setMyStream(stream);
        })
        .catch((err) => {
            console.log(err);
        })
    }, [userId])
    useEffect(() => {
        // only run when the userId change
        // create peer connection to the peer server
        console.log("connect to peer server and get media")
        if (!myStream){
            return;
        }
        const peer = new Peer(userId, {
            host: "localhost",
            port: 9000,
            config: {'iceServers': [
                { url: 'stun:stun1.l.google.com:19302' },
                { url: 'stun:stun2.l.google.com:19302'}
              ]} 
        });
        // listen for other peer's calling
        peer.on("call", (call) => {
            callSave.current = call;
            call.on("close", () => {
                myStream?.getTracks().forEach((track) => {
                    track.stop();
                    myStream.removeTrack(track);
                })
                peer.destroy();
                setMyPeer(null);
                checkInRoom.current = false; 
                console.log("close")
                router.push("/endCall");
            })
            callSave.current.on("stream", (incomingStream) => {
                setPeerStream(incomingStream);
            })
            callSave.current.answer(myStream);
        })
        setMyPeer(peer);
    }, [myStream]);
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
        // call peer
        // need be call first before emit
        socket.on("user-connected", (peerId) => {
            console.log("call");
            console.log("this guy");
            callSave.current = myPeer.call(peerId, myStream);
            if (!callSave.current){
                console.log(myPeer.call(peerId, myStream))
            }
            console.log(callSave.current);
            // console.log(callSave.current.dataChannel);
            callSave.current.on("close", () => {
                myStream.getTracks().forEach((track) => {
                    track.stop();
                    myStream.removeTrack(track);
                })
                setMyPeer(null);
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
        }}>
            {children}
        </RoomContext.Provider>
    )
}