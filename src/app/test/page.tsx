'use client'
import {useEffect, useState} from "react"
import socket from "../utils/socket/socketIndex"
import { Button } from "antd"
import { useContext, useRef } from "react"
import { RoomContext } from "../context/RoomContext"
import { UserContext } from "../context/UserContext"
import { useRouter } from "next/navigation"
import {v4} from "uuid"
interface RoomProfileInterface{
    name: string,
    gender: number,
    sexualInterests: number,
    language: number,
    description: string,
    roomId: string,
    socketId: string,
    private: number
}

export default function Test(){
    const [rooms, setRooms] = useState<Array<RoomProfileInterface>>([]);
    const router = useRouter();
    const {userId, setUserId, interests, setInterests} = useContext(UserContext);
    const {setRoomId, setConnect} = useContext(RoomContext);
    const count = useRef(1);
    const id = useRef("");
    useEffect(() => {
        socket.on("room-list", (rooms:Array<RoomProfileInterface>) => {
            setRooms(e => [...rooms])
        })
        return () => {
            socket.off("room-list");
        } 
    }, [])
    useEffect(() => {   
        if (count.current == 1){
            id.current = v4();   
        }
        socket.on("new-room-added", (rooms) => {
            setRooms(e => [...rooms])
        })
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

        // set userID -> start myStream
        socket.on("request-accepted", (roomId, peerName) => {
            socket.emit("found-peer", socket.id,roomId, peerName)
        })
        // if found a peer
        socket.on("found-peer", (roomId:string, name:string) => {
            console.log("peer found")
            socket.on("peer-success", () => {
                // create an offer
                console.log("connected to peerjs server");
                socket.emit("join-room", roomId, id.current);
            })
            setConnect(e => true);
            console.log("found peer");
            if (localStorage){
                console.log("peer name", name);
                localStorage.setItem("peerName", name);
            }
            setRoomId(id => roomId);
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
            socket.off("request-accepted")
        })
  }, [])
    const name = "Vu"
    const gender = "Male"
    const request = (e) => {
        console.log(e.target.dataset.index)
        const index = e.target.dataset.index;
        id.current = v4();
        setUserId(e => id.current);
        // const index = e.target.datatset.index; 
        socket.emit("join-request", rooms[+index].socketId, name, gender)
    }
    return (
        <>
            {(!rooms) || rooms.map((e, index) => {
                return (
                    <div key = {index}>
                        <div>
                            {e.name}
                        </div>
                        <div>
                            {e.gender}
                        </div>
                        <div>
                            {e.language}
                        </div>
                        <div>
                            {e.description}
                        </div>
                        <div onClick={request} data-index = {index}>Request To Join</div>
                    </div>
                )
            })}
        </>
    )
}