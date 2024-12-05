import Video from "./Video";

interface Props{
    myStream:MediaStream,
    width:string,
    peerStream:MediaStream,
    height:string
    toggle: boolean
}

export default function VideosCanva({myStream, width, peerStream, toggle}:Props){
    return (
        <>
            <div className="w-screen flex flex-row h-screen flex-wrap justify-center items-center">
                <div className="basis-96 grow">
                    <Video stream={myStream} width={width} muted={true} height={"100%"}></Video>
                </div>
                <div className="basis-96 grow">
                    <Video stream={peerStream} toggle={toggle} width={width} muted={false} height={"100%"}></Video>
                </div>
            </div>
        </>
    )
}