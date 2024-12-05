'use client'
import { useRef, useState } from "react";
import YouTube, {YouTubeProps} from "react-youtube"
import { useEffect } from "react";

interface YoutubePlayer{
    playing: boolean,
    timeToSeek: number | null,
    videoId: string | undefined,
}
export default function PreviewYoutubePlayer({width, height, socket,socketId}: any) {
    let youtubePlayer:any;
    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        // access to player in all event handlers via event.target
        youtubePlayer = event.target;
        socket.on("latest-timestamp", (time:number) => {
            youtubePlayer.seekTo(time)
        })
        socket.on(`alone-video-play-${socketId}`, () => {
            youtubePlayer.playVideo()
        })
        socket.on(`alone-video-stop-${socketId}`, () => {
            youtubePlayer.pauseVideo()
        })
        socket.on(`alone-video-seek-${socketId}`, (timeToSeek: number) => {
            youtubePlayer.seekTo(timeToSeek)
        })
        socket.emit("get-latest", socket.id, socketId)
        console.log("send")
    }
    const countRender = useRef(1);
    const [videoId, setVideoId] = useState<string>()
    useEffect(() => {
        socket.on(`preview-${socketId}`, (video: YoutubePlayer) => {
            setVideoId((curr:string | undefined) => video.videoId)
        });
        socket.on(`remove-video-${socketId}`, () => {
            setVideoId("");
        })
        // socket.on(`unpreview-video-${socketId}`, () => {
        //     setVideoId("");
        // })
        if (countRender.current == 1){
            socket.emit("preview", socket.id, socketId);
            countRender.current = 2
        }
        return () => {
            if (socket){
                socket.off(`alone-video-seek-${socketId}`);
                socket.off(`alone-video-stop-${socketId}`);
                socket.off(`alone-video-play-${socketId}`);
                socket.off(`preview-${socketId}`)
                socket.off(`remove-video-${socketId}`);
                socket.off(`latest-timestamp`)
            }
        }
    }, []);
    const opts: YouTubeProps['opts'] = {
        height: '200px',
        width: '400px',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
          controls: 0,
          muted: true
        },
    };
    if (!videoId){
        return <></>
    }
    return (
        <div>
            <YouTube opts={opts} videoId={videoId} onReady={onPlayerReady}></YouTube>
        </div>
    )
}