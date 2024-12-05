'use client'

export default function Requests({requests, accept, decline}: any){
    const groups = ["Male", "Female"]
    return (<>
    {/* display as a list of card */}
        {(!requests) || requests.map((e, index) => {
            return (
            <div key={index}>
            {/* add requests socket id */}
            <div>
                {e.name} wants to join
            </div>
            <div className="my-2">
                Gender: {groups[e.gender]}
            </div>
            <div className="flex justify-center items-center" style={{gap: "10px"}}>
            <div onClick = {accept} className="cursor-pointer px-2 py-1 font-medium text-center text-white bg-blue-500 rounded-md hover:bg-blue-700" data-socketid = {e.socketId} data-name = {e.name}>
                Accept
            </div>
            <div onClick = {decline} className="cursor-pointer px-2 py-1 font-medium text-center text-white bg-blue-500 rounded-md hover:bg-blue-700" data-index = {index}>
                Decline
            </div>
            </div>
        </div>

            )
        })}
    </>)
}