import { useContext } from "react"
import { RoomContext } from "../context/RoomContext"
import Share from "./Share"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function PersonalControl({setWatchYoutube, setOpen, socket}: any){
    const router = useRouter()
    const {myStream, roomId} = useContext(RoomContext)
    const copyRoomId = (e) => {
        const url = `https://helloworld-wgvjjemjya-de.a.run.app/joinRoom/${socket.id}`
        if (navigator){
            navigator.clipboard.writeText(url);
        }
        toast("Copy room's invite link", {type: "success", autoClose: 5000, hideProgressBar: false})
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
           <button onClick={copyRoomId} className="inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b hover:bg-gray-100 hover:text-blue-700 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white">
               Copy room URL
           </button>
           <button onClick={watchYoutube} className="inline-flex items-center px-4 py-2 text-sm font-medium border rounded-e-lg hover:bg-gray-100 hover:text-blue-700 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 dark:focus:text-white">
               <Share></Share>
               Watch Together
           </button>
    </div>   
   </>)
}