'use client'
import { useState } from "react";
import { Socket } from "socket.io-client";
import { useRef, useEffect } from "react";
import ChatMessage from "@/app/components/ChatMessage";
interface Message{
    text: string | undefined;
    createdAt: number | undefined;
    userId: string | undefined;
}
export default function ChatSection({socket, userId, roomId}: {socket:Socket, userId:string, roomId: string}){
    const [messages, setMessages] = useState<Array<Message>>([]);
    const [formValue, setFormValue] = useState<string>("");
    const dummy = useRef();
    let name;
    if (localStorage){
        name = localStorage.getItem("peerName");
    }
    useEffect(() => {
        socket.on("text-messages", (message: Message) => {
            // update messages
            setMessages((currentMessages:Array<Message>) => {
                return [...currentMessages, message];
            })
        })
        return (() => {
            socket.off("text-messages")
        })
    }, []);
    useEffect(() => {
        dummy.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages])
    const sendMessage = (e:any) => {
        e.preventDefault();
        const message:Message = {
            userId: userId,
            text: formValue,
            createdAt: Date.now(),
        }
        // update
        setMessages((currentMessages:Array<Message>) => {
            return [...currentMessages, message];
        });
        socket.emit("text-messages", message, roomId)
        setFormValue(curr => "");
        
        // scroll to the end
        
    }
    return(
        <div className="w-full" style={{height:"400px"}}>
                {/* display text message */}
            <div className="header">
                {name}
            </div>
            <main>
                {messages && messages.map((msg, index) => 
                    <ChatMessage key={index} message={msg} uid={userId}></ChatMessage>
                )}
                <span ref={dummy}></span>
            </main>
            {/* sectionto type in */}
            <form onSubmit={sendMessage} className="chat-form">
                {/* text area */}
                <input className="chat-input" value={formValue} onChange={(e) => {setFormValue(curr => e.target.value)}} placeholder="Say something"></input>
                {/* send button */}
                <button className="chat-button" type="submit" disabled={!formValue}>
                🕊️
                </button>
            </form>
        </div>
    )
}