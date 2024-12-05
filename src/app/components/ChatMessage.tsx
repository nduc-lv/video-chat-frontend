'use client'
interface Message{
    text: string | undefined;
    createdAt: number | undefined;
    userId: string | undefined
}
export default function ChatMessage({message, uid}: {message:Message, uid: string}){
    const {text, userId, createdAt} = message;
    const messageClass = userId  == uid ? 'sent' : 'received';
    const timeStamp = new Date(createdAt);

    return (
        <>
            <div className={`message ${messageClass}`}>
                {messageClass == 'sent' ? <div className="flex flex-col items-end">
                    <p className="chat-text">{text}</p>
                    <span style={{marginTop: -4, paddingRight: 10, fontSize: 8, color: "white"}}>{timeStamp.getHours()} : {timeStamp.getMinutes()}</span>
                </div>: 
                    <div className="flex flex-col items-start">
                    <p className="chat-text">{text}</p>
                    <span style={{marginTop: -4, paddingLeft: 10, fontSize: 8, color: "white"}}>{timeStamp.getHours()} : {timeStamp.getMinutes()}</span>
                </div>
                }
                
            </div>
        </>
    )
}