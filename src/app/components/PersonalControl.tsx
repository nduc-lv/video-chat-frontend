import { useContext } from "react"
import { RoomContext } from "../context/RoomContext"

export default function PersonalControl({setWatchYoutube}){
    const {roomId} = useContext(RoomContext)
    const copyRoomId = (e) => {
        if (navigator){
            navigator.clipboard.writeText(roomId);
        }
    }
    const watchYoutube = (e) => {
        setWatchYoutube(e => !e);
    }
    return <>
        <button onClick = {watchYoutube}>
            Watch Youtube
        </button>
        <button onClick = {copyRoomId}>
            Copy Room Id
        </button>
    </>
}