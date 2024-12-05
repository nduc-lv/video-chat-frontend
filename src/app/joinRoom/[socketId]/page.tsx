'use client'
import socket from "../../../app/utils/socket/socketIndex";
import { useState, useEffect, useRef, useReducer, useContext } from "react";
import { useRouter } from "next/navigation";
import { RoomContext } from "../../context/RoomContext"
import { UserContext } from "../../context/UserContext"
import {v4} from "uuid"
import {Input, Select} from "antd"
export default function JoinRoom({params}: {params: {socketId: string}}){
    const socketId = params.socketId;
    const router = useRouter();
  const {userId, setUserId, interests, setInterests} = useContext(UserContext);
  const {setRoomId, setConnect} = useContext(RoomContext);
  const count = useRef(1);
  const id = useRef("");
    const [roomExist, setRoomExist] = useState<boolean>()
    const current = useRef(1);
    const [name, setName] = useState("");
  const [gender, setGender] = useState(0);
  const [err, setErr] = useState(false);
  const stateReducer = (state:any, action: {type: string}) => {
    switch (action.type) {
      case "none": {
        return "none" 
      }
      case "waiting":{
          return "waiting"
      }
      case "declined": {
          return "declined"
      }
      case "accepted":{
          return "accepted"
      }
    }
    throw Error('Unknown action: ' + action.type);
  }
  const {user} = useContext(UserContext)
  const [requestState, dispatch] = useReducer(stateReducer, "none");
  useEffect(() => {
    if (user) {
        setName(curr => user.displayName)
    }
  }, [user])
    useEffect(() => {
        socket.on("confirm-room", (exist:boolean) => {
            if (exist){
                setRoomExist(curr => exist)
            }
            else{
                setRoomExist(curr => exist)
            }
        })
        if (current.current == 1){
            socket.emit("check-room", (socketId))
            current.current = 2;
        }
        return (() => {
            socket.off("confirm-room")
        })
    }, []) 
    useEffect(() => {   
      socket.on("request-declined",() => {
        console.log("declined");
        dispatch({type: "declined"})
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
            setConnect((e:any) => false);
            socket.emit("reconnect", socket.id);
        })
  
        // set userID -> start myStrimport { TypeAnimation } from 'react-type-animation';eam
        socket.on("request-accepted", (roomId, peerName) => {
            socket.emit("found-peer", socket.id,roomId, peerName)
            dispatch({type: "accepted"})
        })
        // if found a peer
        socket.on("found-peer", (roomId:string, name:string) => {
            console.log("peer found")
            socket.on("peer-success", () => {
                // create an offer
                console.log("connected to peerjs server");
                socket.emit("join-room", roomId, id.current);
            })
            setConnect((e:any) => true);
            console.log("found peer");
            if (localStorage){
                console.log("peer name", name);
                localStorage.setItem("peerName", name);
            }
            setRoomId((id:any) => roomId);
            // join room
            socket.on("reconnect", () => {
                setConnect((e:any) => true);
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
            socket.off("request-accepted");
            socket.off("request-declined");
        })
  }, [])
    const request = (e:any) => {
        if (!name){
            setErr(true);
            return
        }
        console.log(e.target.dataset.index)
        const index = e.target.dataset.index;
        id.current = v4();
        setUserId(e => id.current);
        // const index = e.target.datatset.index; 
        socket.emit("join-request", socketId, name, gender)
        dispatch({type: "waiting"});
    }
    const getName = (e:any) => {
        setName(n => e.target.value)
        setErr(false);
    }
    const getGender = (value: any) => {
        setGender(g => value);
    }
    if (roomExist == undefined) {
        return <>
            Loading...
        </>
    }
    if (roomExist == false) {
        return <>
            Not found room
        </>
    }
    return (
        <>
            <div className="h-screen flex flex-col items-center justify-center" style={{gap: "25px"}} id="join-room">
                <div style={{fontWeight: "bold"}} className="text-2xl">JOIN ROOM</div>
            <div className="flex justify-center items-center flex-col">
                    {/* {(err == false) ? <Input placeholder="Enter your name" size={"middle"} onChange={getName} className="my-6 w-50"/> :
                    <Input status="error" placeholder="Enter your name" size={"middle"} onChange={getName} className="my-6 w-50"/>} */}
                    {(user) ? <Input placeholder="Enter your name" size={"middle"} value={user.displayName} className="my-8 w-96"/> :
                    <Input status="error" placeholder="Enter your name" size={"middle"} onChange={getName} className="my-8 w-96"/>}
                    <Select
                        defaultValue= "Male"
                        style={{ width: 120 }}
                        onChange={getGender}
                        options={[
                            { value: 0, label: 'Male' },
                            { value: 1, label: 'Female' },
                        ]}
                    />
            </div>
            {!(requestState == 'none') ||
                <div onClick={request} className='cursor-pointer px-2 py-1 font-medium text-center text-white bg-blue-500 rounded-md hover:bg-blue-700' data-index = {socketId}>Request To Join</div>
            }
            {!(requestState == 'waiting') || 
                <div>
                    Waiting....
                </div>
            }
            {!(requestState == 'accepted') ||
                <div>
                    Joining...
                </div>
            }
        </div>
        </>
    )
}