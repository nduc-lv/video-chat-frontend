// mic end cam

import { Button } from "antd";
import Mic from "./Mic";
import PhoneHang from "./PhoneHang";
import Cam from "./Cam";
import { useContext, useRef, useState, useEffect} from "react";
import { RoomContext } from "../context/RoomContext";
import socket from "../utils/socket/socketIndex";
import Share from "./Share";

export default function Controls({setShare, share,width, height}:any) {
    const [video,setVideo] = useState<boolean>(true);
    const [audio, setAudio] = useState<boolean>(true);
    const {call, myStream} = useContext(RoomContext);
    const {roomId} = useContext(RoomContext)
    const selectAudio = useRef<HTMLElement>()
    const selectCamera = useRef<HTMLElement>()
    const toggleCamera = () => {
        if (video){
            // disable camera
            myStream?.getVideoTracks()[0].stop();
            myStream?.removeTrack(myStream.getVideoTracks()[0]);
            selectCamera.current?.classList.add("z-10", "ring-2","ring-blue-700", "text-blue-700");
            setVideo(false);
        }
        else {
            // turn on camera
            navigator.mediaDevices.getUserMedia({video: true})
            .then((stream) => {
                myStream?.addTrack(stream.getVideoTracks()[0]);
                call?.peerConnection.getSenders()[1].replaceTrack(stream.getVideoTracks()[0]);
                selectCamera.current?.classList.remove("z-10", "ring-2","ring-blue-700", "text-blue-700");
                setVideo(true);
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
        setShare(!share);
        socket.emit("share-video", roomId);
    }
    return (
        <>
         <div className="inline-flex rounded-md shadow-sm">
                {/* Mic */}
                <button onClick={toggleMic} ref={selectAudio} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white ">
                    <Mic height={height} width={width}></Mic>
                    Mute
                </button>
                <button onClick={stopCall} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                    <PhoneHang height={height} width={width}></PhoneHang>
                    End
                </button>
                <button onClick={toggleCamera} ref={selectCamera} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                    <Cam height={height} width={width}></Cam>
                    Off
                </button>
                <button onClick={shareVideo} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                    <Share></Share>
                    Share
                </button>
                {/* Exit */}
                {/* Cam */}
         </div>   
        </>
    )
}