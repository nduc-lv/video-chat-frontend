"use client"
import Image from "next/image";
import {Peer} from "peerjs";
import { Button } from 'antd';
import socket from "./utils/socket/socketIndex";
import { useRouter } from "next/navigation";
import {v4} from "uuid";
import { useContext, useEffect } from "react";
import { UserContext} from "./context/UserContext";
import { RoomContext } from "./context/RoomContext";


interface Interests{

}
interface Offer{
  id: string,
  interests: Interests
}



export default function Home() {
  // check if already in a room
  const router = useRouter();
  // const {userId, setUserId, interests, setInterests} = useContext(UserContext);
  // const {setRoomId, setMyStream, roomId, myStream} = useContext(RoomContext);
  // useEffect(() => {
  //   if (!userId){
  //     return;
  //   }
  //   else{
  //     const offer: Offer = {
  //       id: userId,
  //       interests,
  //     }
  //     console.log("my id", userId);
  //     socket.emit("match-user", offer);
  //     // change to room id
  //     socket.on("found-peer", (roomId:string) => {
  //       setRoomId(roomId);
  //       router.push("/videoCall");
  //     });
  //   }
  //   return () => {socket.off("found-peer")};
  // }, [userId])
  // // move match to another page
  // const match = () => {
  //   const id = v4();
  //   setUserId(id);
  // }
  return (
    <>
      <div className="flex flex-col h-full items-stretch justify-center items-center text-center px-[30%]">
        <div>
          <div className="text-6xl">Welcome</div>
        </div>
        <div>
          <p style={{color:"#6B6666"}} className="text-2xl my-8">Connect with random people sharing the same interests as you</p>
        </div>
        <div>
          <button onClick={() => router.push("/profileSetup")} className="bg-blue-500 text-white text-2xl px-24 text-center py-4 rounded-md hover:bg-blue-700">FIND A MATCH</button>
        </div>
      </div>
    </>
  );
}
