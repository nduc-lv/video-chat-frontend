import socket from "../utils/socket/socketIndex";
import YoutubeVideoCard from "./YoutubeVideoCard"


export default function YoutubeVideos({items, setVideoID, roomId}: any){
    const chooseVideo = (event:any) => {
        // signal event
        if (event.target.getAttribute("data-videoid")){
            socket.emit("watch-video", roomId,event.target.getAttribute('data-videoid'));
            setVideoID((e:any) => event.target.getAttribute('data-videoid'));
        }
    }
    return (
        <>
            <div className="flex flex-col flex-wrap justify-start items-start gap-1" style={{marginTop: "30px", minWidth:"320px", width:"100%"}}>
                {
                    items.map((item:any, indx:any) => {
                        return (
                            <div key={indx} onClick={chooseVideo} data-videoid={item?.id?.videoId} style={{marginTop:"10px"}}>
                                <YoutubeVideoCard videoId={item?.id?.videoId} snippet={item.snippet}></YoutubeVideoCard>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}