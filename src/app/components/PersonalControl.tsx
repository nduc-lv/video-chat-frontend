import { useContext } from "react"
import { RoomContext } from "../context/RoomContext"
import Share from "./Share"
import { useRouter } from "next/navigation"
export default function PersonalControl({setWatchYoutube, setOpen, socket}){
    const router = useRouter()
    const {roomId, myStream} = useContext(RoomContext)
    const copyRoomId = (e) => {
        if (navigator){
            navigator.clipboard.writeText(roomId);
        }
    }
    const watchYoutube = (e) => {
        setWatchYoutube(e => !e);
    }
    const showRequests = (e) => {
        setOpen(e => !e)
    }
    const stopCall = (e) => {
        // emit event to clear room
        socket.emit("quit-room", roomId)
        myStream?.getTracks().forEach((track) => {
            track.stop();
            myStream.removeTrack(track);
        })
        console.log("close")
        router.push("/endCall");
    }
    // return <>
    //     <button onClick = {watchYoutube}>
    //         Watch Youtube
    //     </button>
    //     <button onClick = {copyRoomId}>
    //         Copy Room Id
    //     </button>
    // </>
    return (
    <>
    <div className="inline-flex rounded-md shadow-sm">
           <button onClick={stopCall} className="inline-flex items-center px-4 py-2 text-sm font-medium border rounded-s-lg hover:bg-gray-100 hover:text-blue-700 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white ">
               Quit
           </button>
           <button onClick={showRequests} className="inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b hover:bg-gray-100 hover:text-blue-700 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white">
               Requests
           </button>
           <button onClick={watchYoutube} className="inline-flex items-center px-4 py-2 text-sm font-medium border rounded-e-lg hover:bg-gray-100 hover:text-blue-700 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 dark:focus:text-white">
               <Share></Share>
               Watch Together
           </button>
    </div>   
   </>)
}