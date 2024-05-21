'use client'
import { useSearchParams } from "next/navigation";
import socket from "../utils/socket/socketIndex";
import Peer from "peerjs";
import { useEffect, useRef, useContext, useReducer} from "react";
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
import VideoModeReducer from "../reducers/VideoModeReducer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// get peer Id

// const peer = new Peer(undefined, {host:"/", port: "9000"});
// const id = v4();

export default function VideoCall(){
    const myvideo = useRef<HTMLVideoElement>();
    const peervideo = useRef<HTMLVideoElement>();
    const {myStream, peerStream, roomId, checkInRoom} = useContext(RoomContext);
    const router = useRouter();
    const {userId, user, firestore} = useContext(UserContext);
    const [share, setShare] = useState(false);
    const [mode, dispatch] = useReducer(VideoModeReducer, "normal")
    const [toggleCam, setToggleCam] = useState(true);
    const followRef = firestore.collection('follow');
    useEffect(() => {
        socket.on("follow-dup", () => {
            toast(`You've already followed ${localStorage.getItem("peerName")}`, {type: "error", autoClose: 3000})
        })
        socket.on("follow-success", () => {
            toast(`Followed ${localStorage.getItem("peerName")}`, {type: "success", autoClose: 3000})
        })
        socket.on("follow-err", () => {

            toast(`${localStorage.getItem("peerName")} has not signed in`, {type: "error", autoClose: 3000})
        })
        socket.on("follow", async (uid) => {
            if (!user) {
                socket.emit("follow-err", roomId)
            }
            else {
                try {
                    await  Promise.all(
                        [followRef.where("uid-1", "==", user.uid).get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                // Access each document
                                const data = doc.data();
                                
                                const uid2 = data['uid-2']
                                if (uid2 == uid) {
                                    throw new Error("DUP")
                                }
                                
                            });
                        })
                    
                     , followRef.where("uid-2", "==", user.uid).get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                // Access each document
                                const data = doc.data();
                                const uid1 = data['uid-1']
                                if (uid == uid1) {
                                    throw new Error("DUP")
                                }
                                
                            });
                        })
                        ]
                    )
                    await followRef.add({
                            "uid-1": uid,
                            "uid-2": user.uid
                        }
                    )
                    toast(localStorage.getItem("peerName") + " followed you", {type: "info", autoClose: 2000})
                    socket.emit("follow-success", roomId)
                }
                catch(e) {
                    console.log(e)
                    if (e instanceof Error) {
                        if (e.message == "DUP") {
                            socket.emit("follow-dup", roomId)
                        }
                        else {
                            socket.emit("follow-failed", roomId)
                        }
                    }
                }
            }
            // await followRef.add({
            //     // something here
            // })
        })
        return (() => {
            socket.off("follow")
            socket.off("follow-success")
            socket.off("follow-err")
            socket.off("follow-dup")
        })
    }, [user])
    useEffect(() => {
        console.log("in room status", checkInRoom.current)
        if (!userId){
            console.log("this is userid in videopage", userId);
            return;
        }
        socket.on("sharing", () => {
            console.log("now sharing", share);
            setShare(curr => !curr)
        })
        socket.on("toggle-camera", (mode: boolean) => {
            console.log(mode)
            setToggleCam(curr => mode);
        })
        socket.on("chat", (mode:string) => {
            dispatch({type: mode})
        })
        if (checkInRoom.current == false){
            checkInRoom.current = true;
           
        }
        return (() => {
            socket.off("toggle-camera")
            socket.off("sharing")
            socket.off("chat")
        })
    }, [userId]);
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
            <ToastContainer></ToastContainer>
            {share == true ? 
            <div className="h-screen flex flex-row">
                <div style={{width: "75vw"}}>
                    <WatchTogether roomId={roomId}></WatchTogether>
                </div>
                <div style={{ backgroundColor:"#19202A"}} className="flex flex-col justify-between items-end grow">
                    <div style={{width:"20vw"}}>
                        <Video stream={peerStream} muted={false} width={"100%"} height={"100px"} toggle= {toggleCam}></Video>
                    </div>
                    <div style={{width: "23vw"}}>
                        <ChatSection roomId={roomId} socket={socket} userId={userId}></ChatSection>
                    </div>
                </div>
            </div> : 
            <>
            {!(mode == 'normal') || <VideosCanva myStream={myStream} toggle = {toggleCam} peerStream={peerStream} width={"100%"}></VideosCanva>}
            {!(mode == 'chat') || <div className="h-screen flex flex-row" style={{backgroundColor:"#19202A"}}>
                <div style={{width: "75vw"}} className="flex flex-col justify-center items-start">
                    <div>
                        <Video stream={peerStream} toggle={toggleCam}></Video>
                    </div>
                </div>
                <div style={{width: "23vw"}}  className="flex flex-col justify-end items-end grow">
                    <ChatSection roomId={roomId} socket={socket} userId={userId}></ChatSection>
                </div>
            </div>}
            </>
            }
            
            <div className="absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Controls dispatch={dispatch} mode={mode} setShare={setShare}width={"2rem"} height={"2rem"}></Controls>
            </div>
    </div>
    )
}