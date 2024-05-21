"use client"

import {useEffect, useState} from "react"
import socket from "./utils/socket/socketIndex"
import { Button, Dropdown } from "antd"
import { useContext, useRef } from "react"
import { RoomContext } from "./context/RoomContext"
import { UserContext } from "./context/UserContext"
import { useRouter } from "next/navigation"
import {v4} from "uuid"
import AvailableRooms from "./components/AvailableRoom"
import {Input, Select} from "antd"
import Image from 'next/image'
import Pic from "../../public/Screenshot from 2024-04-25 00-03-41.png"
import { TypeAnimation } from 'react-type-animation';
import { useReducer } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { MenuProps } from 'antd';
import {LogoutOutlined, UserDeleteOutlined, QuestionOutlined} from '@ant-design/icons'

import { Tooltip } from "antd";
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


interface Interests{

}
interface Offer{
  id: string,
  interests: Interests
}

interface Online{
    uid: string,
    name: string
}

export default function Home() {
  const [rooms, setRooms] = useState<Array<RoomProfileInterface>>([]);
  const router = useRouter();
  const {userId, setUserId, interests, setInterests, firebase, auth, user, firestore} = useContext(UserContext);
  const {setRoomId, setConnect} = useContext(RoomContext);
  const count = useRef(1);
  const id = useRef("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState(0);
  const [err, setErr] = useState(false);
  const followRef = firestore.collection("follow");
  const [online, setOnline] = useState<Array<Online>>([]);
  const render = useRef(1);
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  const unfollow = async (uid:string) => {
    try{
        await Promise.all(
            [
                followRef.where("uid-1", "==", user.uid).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // Access each document
                        const data = doc.data();
                        
                        const uid2 = data['uid-2']
                        if (uid == uid2) {
                            doc.ref.delete();
                        }
                        
                    });
                })
                , followRef.where("uid-2", "==", user.uid).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // Access each document
                        const data = doc.data();
                        const uid1 = data['uid-1']
                       if (uid == uid1) {
                            doc.ref.delete();
                       }
                        
                    });
                })
                
            ]
        )
        socket.emit("unfollowed", uid, user.uid)
        const newOnline = online.filter((value) => {
            return (
                value.uid != uid
            )
        })
        setOnline([...newOnline])
    } catch(e) {
        toast("Error when unfollowing", {type: "error", autoClose: 3000})
    }
  } 
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
  const [requestState, dispatch] = useReducer(stateReducer, "none");
  const items: MenuProps['items'] = 
    (online?.length == 0) ? [{key: "1", label: (<div>No user online</div>)}] :
    online.map((user, index) => {
        return {
            key: index,
            label: (
                <div className="flex flex-row" style={{gap: "20px"}}>
                    <div>
                        {user.name} is online
                    </div>
                        <Tooltip placement="rightTop" title="Unfollow">
                            <UserDeleteOutlined onClick={() => {unfollow(user.uid)}}/>
                        </Tooltip>
                    
                </div>
            )

        }
    }) 
    
  useEffect(() => {
      if (user) {
        Promise.all(
            [followRef.where("uid-1", "==", user.uid).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // Access each document
                    const data = doc.data();
                    const uid2 = data['uid-2']
                    socket.emit("notify", uid2, user.displayName, user.uid)
                    
                });
            })
            .catch((e) => {
                console.log("Error getting", e)
            }), followRef.where("uid-2", "==", user.uid).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // Access each document
                    const data = doc.data();
                    const uid1 = data['uid-1']
                    socket.emit("notify", uid1, user.displayName, user.uid)
                    
                });
            })
            .catch((e) => {
                console.log("Error getting", e)
            })]
        )
      }
      return (() => {
      })
  }, [user])
//   useEffect(() => {
//     console.log(online)
//   }, [online])
  useEffect(() => {
    if (user) {
        // socket.off("online")
        setName(curr => user.displayName)
        socket.on("unfollowed", (uid) => {
            const newOnline = online.filter((value) => {
                return (
                    value.uid == uid
                )
            })
            setOnline([...newOnline])
        })
        socket.on("online", (name:string, uidFollow:string) => {
            toast(`${name} is online`)
            socket.emit("me-too", uidFollow, user.displayName, user.uid)
            const newOnline = online.filter((acc) => {
                return (
                    acc.uid != uidFollow
                )
            })
            newOnline.push({name, uid: uidFollow})
            console.log(newOnline)
            setOnline([...newOnline])
            
        })
        // socket.off("me-too")
        socket.on("me-too", (name:string, uidFollow: string) => {
            toast(`${name} is online`)
            const newOnline = online.filter((acc) => {
                return (
                    acc.uid != uidFollow
                )
            })
            newOnline.push({name, uid: uidFollow})
            console.log(newOnline)
            setOnline([...newOnline])
            
        })
        if (render.current == 1){
            console.log("login")
            socket.emit("login", user.uid)
            render.current = 2;
        }
        socket.on("logout", (uid:string) => {
            console.log("logout")
            const newOnline = online.filter((acc) => {
                return (
                    acc.uid != uid
                )
            })
            console.log(newOnline)
            setOnline([...newOnline])
        })
    }
    return (() => {
        socket.off("online")
        socket.off("me-too")
        socket.off("logout")
        socket.off("unfollowed")
    })
  }, [user])
  useEffect(() => {
      socket.on("room-list", (rooms:Array<RoomProfileInterface>) => {
          setRooms(e => [...rooms])
      })
      return () => {
          socket.off("room-list");
      } 
  }, [])
  useEffect(() => {   
    socket.on("request-declined",() => {
      console.log("declined");
      dispatch({type: "declined"})
    })
    socket.on("new-room-added", (rooms) => {
    //   console.log(rooms)
      setRooms(e => [...rooms])
    })
    if (count.current == 1){
        id.current = v4();
        socket.emit("get-available-rooms")   
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
          socket.off("request-accepted");
          socket.off("request-declined");
      })
}, [])

//   const groups = ["Male", "Female"]
  const request = (e) => {
      if (!name){
          toast("Enter your name", {type: "error", autoClose: 4000})
          return
      }
      console.log(e.target.dataset.index)
      const index = e.target.dataset.index;
      id.current = v4();
      setUserId(e => id.current);
      // const index = e.target.datatset.index; 
      socket.emit("join-request", rooms[+index].socketId, name, gender)
      dispatch({type: "waiting"});
  }
  const getName = (e:any) => {
      setName(n => e.target.value)
      setErr(false);
  }
  const getGender = (value) => {
      setGender(g => value);
  }
  const handleScroll = (e) => {
    const joinRoom = document.getElementById("join-room");
    joinRoom?.scrollIntoView({behavior: "smooth"})
  }
  
  return (
    // <div className="flex flex-col items-stretch justify-center">
    //     <div className="flex flex-col items-stretch justify-center items-center text-center px-[30%] h-screen">
    //     <div>
    //       <div className="text-6xl">Welcome</div>
    //     </div>
    //     <div>
    //       <p style={{color:"#6B6666"}} className="text-2xl my-8">Connect with random people sharing the same interests as you</p>
    //     </div>
    //     <div>
    //       <button onClick={() => router.push("/profileSetup")} className="bg-blue-500 text-white text-1xl px-20 text-center py-4 rounded-md hover:bg-blue-700">FIND A MATCH</button>
    //     </div>
    //     <div className="mt-4">
    //       <button onClick={() => router.push("/createRoom")} className="bg-blue-500 text-white text-1xl px-20 text-center py-4 rounded-md hover:bg-blue-700">CREATE ROOM</button>
    //     </div>
    //     <span className="text-2xl text-center mt-8 cursor-pointer" onClick={handleScroll}> Join Room</span>
    //   </div>
    //   <div className="h-screen flex flex-col" style={{gap: "30px"}} id="join-room">
    //         <div className="flex justify-center items-center">
    //                     {/* <input onChange={getName} type="text" id="first_name" className="my-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5" placeholder="John" required /> */}
    //                 <Input placeholder="Enter your name" size={"middle"} onChange={getName} className="my-8 w-96"/>
    //                 <Select
    //                     defaultValue= "Male"
    //                     style={{ width: 120 }}
    //                     onChange={getGender}
    //                     options={[
    //                         { value: 0, label: 'Male' },
    //                         { value: 1, label: 'Female' },
    //                     ]}
    //                 />
    //         </div>
    //         <AvailableRooms rooms={rooms} request={request}></AvailableRooms>
    //   </div>
    // </div>
    <>
        <div className="h-screen" style={{paddingLeft: "20px"}}>
            <ToastContainer></ToastContainer>
            <div id="Header" style={{height: "10%", fontWeight:"bold", paddingRight: "20px"}} className="py-6 text-2xl flex justify-between">
                <div>PeerChat</div>
                {user ?(
                    <div className="flex" style={{gap: "15px"}}>
                        {/* <Dropdown menu={{ items }} placement="bottom" arrow trigger={["click"]}>
                        <Tooltip placement="leftTop" title="Following">
                            <svg className="w-9 h-9 text-gray-800 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24">
                                    <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 6H5m2 3H5m2 3H5m2 3H5m2 3H5m11-1a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2M7 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
                            </svg> 
                        </Tooltip>
                        </Dropdown>    */}
                        <div>Hi {user.displayName}</div> 
                        <Tooltip title="Log out">
                        <Button onClick={() => {auth.signOut(); socket.emit("logout", user.uid)}} >
                            <LogoutOutlined></LogoutOutlined>
                        </Button>
                        </Tooltip>
                    </div>
                ) : <Button onClick={signInWithGoogle}>Sign in</Button>}
            </div>
            
            <div id="Main" className="flex flex-row" style={{height: "90%", paddingLeft:"50px"}}>
                <div style={{width:"50%", marginTop: "60px"}}>
                    <div id="Welcome" className="mb-4 text-4xl" style={{fontWeight:"bold"}}>
                        Welcome to PeerChat
                    </div>
                    <div id="description" className="mb-4 text-4xl" style={{width: "100%", height:"200px"}} >
                    <TypeAnimation
                        sequence={[
                            "Connect with people sharing similar interests", // Types 'One'
                            2000, // Waits 1s
                            'Watch Youtube videos together', // Deletes 'One' and types 'Two'
                            2000, // Waits 2s
                            'No user account required', // Types 'Three' without deleting 'Two'
                            2000
                        ]}
                        wrapper="div"
                        cursor={true}
                        repeat={Infinity}
                        style={{display: 'inline-block', textWrap:"wrap"}}
                    />
                        {/* using typewriter */}
                    </div>
                    <div id="button" className="flex" style={{gap: "20px"}}>
                    <button onClick={handleScroll} className="px-8 py-4 text-lg font-medium text-center text-white bg-blue-500 rounded-md hover:bg-blue-700" style={{width:"215px"}}> JOIN ROOM</button>
                        
                        <button onClick= {() => {router.push("/createRoom")}} className="px-8 py-4 text-lg font-medium text-center text-white bg-blue-500 rounded-md hover:bg-blue-700">CREATE ROOM</button>
                    </div>
                    <div className="text-2xl my-4">Or</div>
                    <Tooltip title="Random match" placement="right">

                    <button onClick= {() => {router.push("/profileSetup")}} className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-lg font-medium text-white rounded-md" style={{width:"215px"}} ><QuestionOutlined/></button>
                    </Tooltip>
                </div>
                <div>
                <Image
                    src={Pic}
                    alt = "Pic"
      // width={500} automatically provided
      // height={500} automatically provided
      // blurDataURL="data:..." automatically provided
      // placeholder="blur" // Optional blur-up while loading
                />
                </div>
            </div>
        </div>
        <div className="h-screen flex flex-col" style={{gap: "30px"}} id="join-room">
            <div className="flex justify-center items-center">
                        {/* <input onChange={getName} type="text" id="first_name" className="my-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5" placeholder="John" required /> */}
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
            <AvailableRooms dispatch={dispatch} rooms={rooms} request={request} requestState = {requestState}></AvailableRooms>
        </div>
    </>
  );
}
