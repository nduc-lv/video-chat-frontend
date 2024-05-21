// mic end cam

import { Button } from "antd";
import Mic from "./Mic";
import PhoneHang from "./PhoneHang";
import Cam from "./Cam";
import { useContext, useRef, useState, useEffect} from "react";
import { RoomContext } from "../context/RoomContext";
import socket from "../utils/socket/socketIndex";
import Share from "./Share";
import Message from "./Message";
import { UserContext } from "../context/UserContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Follow from "./Follow";
export default function Controls({dispatch, mode,width, height, setShare}:any) {
    const [video,setVideo] = useState<boolean>(true);
    const [audio, setAudio] = useState<boolean>(true);
    const {call, myStream} = useContext(RoomContext);
    const {roomId} = useContext(RoomContext)
    const {user, firestore} = useContext(UserContext)
    const followRef = firestore.collection('follow');
    
    const selectAudio = useRef<any>()
    const selectCamera = useRef<any>()
    // const addFollow =  async () => {
    //     socket.on("follow", async ())
    // }
    const toggleCamera = () => {
        if (video){
            // disable camera
            myStream?.getVideoTracks()[0].stop();
            myStream?.removeTrack(myStream.getVideoTracks()[0]);
            selectCamera.current?.classList.add("z-10", "ring-2","ring-blue-700", "text-blue-700");
            setVideo(false);
            socket.emit("toggle-camera", roomId, false)
        }
        else {
            // turn on camera
            if (typeof navigator === 'undefined') {
                return;
            }
            navigator.mediaDevices.getUserMedia({video: true})
            .then((stream) => {
                myStream?.addTrack(stream.getVideoTracks()[0]);
                call?.peerConnection.getSenders()[1].replaceTrack(stream.getVideoTracks()[0]);
                selectCamera.current?.classList.remove("z-10", "ring-2","ring-blue-700", "text-blue-700");
                setVideo(true);
                socket.emit("toggle-camera", roomId, true)
            })
        }
    }
    const toggleMic = () => {
        if (audio){
            // disable mic
            myStream!.getAudioTracks()[0].enabled = false;
            selectAudio.current?.classList.add("z-10", "ring-2","ring-blue-700", "text-blue-700");
            setAudio(false);
        }
        else{
            // enable mic
            selectAudio.current?.classList.remove("z-10", "ring-2","ring-blue-700", "text-blue-700");
            myStream!.getAudioTracks()[0].enabled = true;
            setAudio(true);
        }
    }
    const stopCall = () => {
        call?.close();
    }
    const shareVideo = () => {
        // some set state function here
        setShare(curr => !curr)
        socket.emit("share-video", roomId);
    }
    const toggleChat = () => {
        if (mode == "normal") {
            socket.emit("chat", roomId, "chat")
            dispatch({type: "chat"})
        }
        else if (mode == "chat"){
            socket.emit("chat", roomId, "normal")
            dispatch({type: "normal"})
        }
    }
    const follow = () => {
        // follow
        socket.emit("follow", user.uid, roomId)
    }
    return (
        <>
         <div className="inline-flex rounded-md shadow-sm">
                {/* Mic */}
                <button onClick={toggleMic} ref={selectAudio} className="inline-flex items-center px-4 py-2 text-sm font-medium border rounded-s-lg hover:bg-gray-100 hover:text-blue-700 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white ">
                    <Mic height={height} width={width}></Mic>
                    Mute
                </button>
                <button onClick={stopCall} className="inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b hover:bg-gray-100 hover:text-blue-700 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white">
                    <PhoneHang height={height} width={width}></PhoneHang>
                    End
                </button>
                <button onClick={toggleChat} className="inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b hover:bg-gray-100 hover:text-blue-700 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white">
                    <Message></Message>
                    Chat
                </button>
                <button onClick={toggleCamera} ref={selectCamera} className="inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b hover:bg-gray-100 hover:text-blue-700 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white">
                    <Cam height={height} width={width}></Cam>
                    Off
                </button>
                {!(user) || <button onClick={follow} className="inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b hover:bg-gray-100 hover:text-blue-700 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white">
                    <Follow></Follow>
                    Follow
                </button>}
                <button onClick={shareVideo} className="inline-flex items-center px-4 py-2 text-sm font-medium border rounded-e-lg hover:bg-gray-100 hover:text-blue-700 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 dark:focus:text-white">
                    <Share></Share>
                    Watch Together
                </button>
                {/* Exit */}
                {/* Cam */}
         </div>   
        </>
    )
}