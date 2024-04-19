'use client'
import { useSearchParams } from "next/navigation";
import socket from "../utils/socket/socketIndex";
import Peer from "peerjs";
import { useEffect, useRef, useContext} from "react";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import { useState } from "react"
import { Button } from "antd";
import { v4 } from "uuid";
import { RoomContext, RoomProvider } from "../context/RoomContext";
import { UserContext, UserProvider } from "../context/UserContext";
import Video from "../components/Video";
import VideosCanva from "../components/VideoCanvaFull";
import Controls from "../components/Control";
import VideoSharingCanva from "../components/VideoSharingCanva";
import WatchTogether from "../components/WatchTogether";
import ChatSection from "../components/ChatSection";
// get peer Id

// const peer = new Peer(undefined, {host:"/", port: "9000"});
// const id = v4();

export default function VideoCall(){
    const myvideo = useRef<HTMLVideoElement>();
    const peervideo = useRef<HTMLVideoElement>();
    const {myStream, peerStream, roomId, checkInRoom} = useContext(RoomContext);
    const router = useRouter();
    const {userId} = useContext(UserContext);
    const [share, setShare] = useState(false);
    useEffect(() => {
        console.log("in room status", checkInRoom.current)
        if (!userId){
            console.log("this is userid in videopage", userId);
            return;
        }
        if (checkInRoom.current == false){
            checkInRoom.current = true;
            socket.on("sharing", () => {
                setShare(a => !a);
                console.log("now sharing", share);
            })
        }
    }, [userId]);
    useEffect(() => {
        console.log(share);
    }, [share])
    // const {userId} = useContext(UserContext);
    // const {roomId} = useContext(RoomContext);
    // if (roomId) {
    //     socket.emit("join-room", roomId, userId);
    // }
    return(
    <div className="relative bg-black">
            {/* <video ref={myvideo} style={{
                width: "500px", height: "500px" }} muted={true}></video> */}
            {/* <Video stream={myStream} width={"100%"}></Video> */}
            {/* <video ref={peervideo} style={{
                width: "500px", height: "500px" }} id="peerVideo"></video> */}
            {/* <Video stream={peerStream} width={"100%"}></Video> */}
            {share == true ? 
            <div className="h-screen flex flex-row">
                {/* <iframe src={`http://localhost:3000/watchTogether/${roomId}`} width="auto" className="grow"></iframe> */}
                <div style={{width: "75vw"}}>
                    <WatchTogether roomId={roomId}></WatchTogether>
                </div>
                <div style={{ backgroundColor:"#19202A"}} className="flex flex-col justify-between items-end grow">
                    <div style={{width:"20vw"}}>
                        <Video stream={peerStream} muted={false} width={"100%"} height={"100px"}></Video>
                    </div>
                    {/* chat section */}
                    <div style={{width: "23vw"}}>
                        <ChatSection roomId={roomId} socket={socket} userId={userId}></ChatSection>
                    </div>
                </div>
                {/* other peer */}
            </div> : 
            
                <VideosCanva myStream={myStream} peerStream={peerStream} width={"100%"}></VideosCanva>
            }
            <div className="absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Controls setShare={setShare} share={share} width={"2rem"} height={"2rem"}></Controls>
            </div>
    </div>
    )
}