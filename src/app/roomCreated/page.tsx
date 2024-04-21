'use client'
import { useContext, useEffect, useRef, useState} from "react"
import Video from "../components/Video"
import { RoomContext } from "../context/RoomContext"
import { UserContext } from "../context/UserContext"
import socket from "../utils/socket/socketIndex"
import { useRouter } from "next/navigation"
import {v4} from "uuid"
import PersonalControl from "../components/PersonalControl"
import WatchTogether from "../components/WatchTogether"
export default function RoomCreated() {
    const {myStream, setConnect} = useContext(RoomContext); 
    const {userId, setUserId} = useContext(UserContext);
    const {roomId} = useContext(RoomContext)
    const router = useRouter();
    const count = useRef(1);
    const id = useRef("");
    const profile = useRef({});
    const [requests, setRequests] = useState<any>([]);
    const [watchYoutube, setWatchYoutube] = useState(false);
    const accept = (e:any) => {
        e.preventDefault();
        const socketId = e.target.dataset.socketid;
        let name;
        if (localStorage){
            name = localStorage.getItem("name");
        }
        socket.emit("request-accepted", socketId, roomId,name);
        socket.emit("found-peer", socket.id, roomId, e.target.dataset.name)
    }
    const decline = (e:any) => {
        e.preventDefault();
        socket.emit("decline-user");
        setRequests(e => e.splice(e.target.dataset.index, 1))
    }
    useEffect(() => {
        profile.current = {
            name: localStorage.getItem("name"),
            gender: +localStorage.getItem("gender"),
            sexualInterests: +localStorage.getItem("sexualInterest"),
            language: +localStorage.getItem("language"),
            description: localStorage.getItem("description"),
            roomId,
            socketId: socket.id,
            private: +localStorage.getItem("private")
        }
    }, []);
    useEffect(() => {   
        if (count.current == 1){
            id.current = v4();   
        }
        // check for connection to peerjs server
        socket.on("peer-fail", () => {
            console.log("unable to connect to peerjs server")
        })

        // check for connection to other peer
        socket.on("connection-ebstablished", () => {
            console.log("successfully ebstablished connection");
            // try to reconnect
            router.push("/videoCall")
        })
        socket.on("connection-failed", () => {
            console.log("connection-failed, reconnect");
            setConnect(e => false);
            socket.emit("reconnect", socket.id);
        })
        socket.on("join-request", (request:any) => {
            // display info (component)
            // if accept -> send to the server, server emit the found-peer event
            // if decline -> send to the server, server send to the other user
            // notify
            setRequests([...requests, request])
        })
        // set userID -> start myStream
        if (count.current == 1){
            // send info about this room to the server
            socket.emit("create-room", profile.current)
            setUserId(userId => id.current);  
        }
        // if accept a new user
        socket.on("found-peer", (roomId:string, name:string) => {
            socket.on("peer-success", () => {
                // create an offer
                console.log("connected to peerjs server");
                socket.emit("join-room", roomId, id.current);
            })
            setConnect(e => true);
            if (localStorage){
                console.log("peer name", name);
                localStorage.setItem("peerName", name);
            }
            // join room
            socket.on("reconnect", () => {
                setConnect(e => true);
            });
        });
        count.current = 2
        // change to room id
        return (() => {
            socket.off("peer-fail");
            socket.off("peer-success");
            socket.off("found-peer");
            socket.off("connection-ebstablished");
            socket.off("connection-failed");
            socket.off("reconnect");
            socket.off("join-request");
        })
  }, [])
    return(
        <div className="relative bg-black">
            {watchYoutube == false ? 
            (<div className="w-screen flex flex-row h-screen flex-wrap justify-center items-center">
                <div className="basis-112">
                    <Video stream={myStream} width={"100%"} muted={true} height={"100%"}></Video>
                </div>
            </div>) : 
            <div className="h-screen flex flex-row">
                <div style={{width: "75vw"}}>
                <WatchTogether roomId={roomId}></WatchTogether>
            </div>
            <div style={{ backgroundColor:"#19202A"}} className="flex flex-col justify-between items-end grow">
                <div style={{width:"20vw"}}>
                    <Video stream={myStream} muted={false} width={"100%"} height={"100px"}></Video>
                </div>
                {/* chat section */}
            </div>

            </div>
            }
            <div className="absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <PersonalControl setWatchYoutube={setWatchYoutube}></PersonalControl>
            </div>
            {(!requests) || requests.map((e, index) => {
                return (
                    <div key={index}>
                        {/* add requests socket id */}
                        <div>
                            {e.name} wants to join
                        </div>
                        <div onClick = {accept} data-socketid = {e.socketId} data-name = {e.name}>
                            Accept
                        </div>
                        <div onClick = {decline} data-index = {index}>
                            Decline
                        </div>
                    </div>
                )
            })}
        </div>
    )
}