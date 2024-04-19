'use client'
interface Message{
    text: string | undefined;
    createdAt: number | undefined;
    userId: string | undefined
}
export default function ChatMessage({message, uid}: {message:Message, uid: string}){
    const {text, userId, createdAt} = message;
    const messageClass = userId  == uid ? 'sent' : 'received';
    return (
        <>
            <div className={`message ${messageClass}`}>
                <p className="chat-text">{text}</p>
            </div>
        </>
    )
}