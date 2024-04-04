'use client'
import { useContext, useEffect } from "react";
import { RoomContext } from "../context/RoomContext";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { UserContext } from "../context/UserContext";

export default function EndCall(){
    const {setMyStream, setRoomId, checkInRoom} = useContext(RoomContext)
    const {setUserId} = useContext(UserContext);
    useEffect(() => {
        setMyStream(null);
        setRoomId(null);
        setUserId(null);
        checkInRoom.current = false;
    });
    const router = useRouter()
    return (
        <>
            <div className="flex flex-col h-full items-stretch justify-center items-center text-center px-[30%]">
                <div>
                    <div className="text-6xl">CALL ENDED</div>
                </div>
                <div className="mt-8">
                    <button onClick={() => router.push("/")} className="bg-blue-500 text-white text-2xl px-24 text-center py-4 rounded-md hover:bg-blue-700">HOME PAGE</button>
                </div>
            </div>
        </>
    ) 
}