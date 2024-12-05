import { useRef, useState } from "react";
import YouTube, {YouTubeProps} from "react-youtube"
import { useEffect } from "react";
export default function YoutubeVideoPlayer({videoId, roomId,socket, mode, isJoinRoom}:any){
    let youtubePlayer:any;
    let lastTime = -1;
    let preState = -1;
    const [player, setPlayer] = useState<any>();
    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        // access to player in all event handlers via event.target
        youtubePlayer = event.target;
        // setPlayer(curr => youtubePlayer);
        if (mode == "alone") {
            socket.on("")
        }
        socket.on('video-seek', (time:any) => {
            console.log("video-seek");
            lastTime = time;
            if (Math.abs(youtubePlayer.getCurrentTime() - time) > 1){
                youtubePlayer.seekTo(time);
            }
        })
        if (mode == 'alone'){
            console.log("set event")
            socket.on("get-latest", (socketId:string) => {
                console.log("hi")
                const timeStamp = youtubePlayer.getCurrentTime();
                socket.emit("latest-timestamp", timeStamp, socketId)
            })
        }
        socket.on('video-stop', () => {
            console.log("video-stop");
            youtubePlayer.pauseVideo();
        })
        socket.on('video-play', () => {
            console.log("video-play");
            youtubePlayer.playVideo()
            
        })
        socket.on("save-vid", () => {
            localStorage.setItem("videoId", videoId);
            localStorage.setItem("timeStamp", youtubePlayer.getCurrentTime());
        })
        event.target.pauseVideo();
    }
    // useEffect(() => {
    //     if (mode == "alone" && isJoinRoom){
    //         localStorage.setItem("videoId", videoId);
    //         localStorage.setItem("timeStamp", player.getCurrentTime());
    //     }
    // }, [isJoinRoom, player])
    useEffect(() => {
        socket.emit("add-video", socket.id, videoId);
        return () => {
            socket.emit("remove-video", socket.id);
            if (socket){
                socket.off("video-stop");
                socket.off("video-seek");
                socket.off("video-play");
                socket.off("save-vid");
            }
        }
    }, [videoId]);
    const opts: YouTubeProps['opts'] = {
        height: '350px',
        width: '100%',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
    };
    const disclose: YouTubeProps['onStateChange'] = (event) => {
        const state = youtubePlayer?.getPlayerState();
        console.log(state);
        if (state == 1 || state == 3){
            const timeToSeek = youtubePlayer.getCurrentTime();
            socket.emit("video-play", roomId);
            if (mode && mode == "alone") {
                socket.emit("alone-video-play", socket.id)
            }
            console.log("this is current time", timeToSeek);
            // send this info to other guy
            if (preState == 3 && state == 1){
                if (mode && mode == "alone") {
                    socket.emit("alone-video-seek", socket.id, timeToSeek)
                }
                socket.emit("video-seek", roomId, timeToSeek);
            }
            if (Math.abs(timeToSeek - lastTime) >= 1){
                if (mode && mode == "alone") {
                    socket.emit("alone-video-seek", socket.id, timeToSeek)
                }
                socket.emit("video-seek", roomId, timeToSeek);
            }
            lastTime = timeToSeek;
        }
        else if (state == 2){
            console.log("youtube stop");
            // signal this to other user
            if (mode && mode=="alone"){
                socket.emit("alone-video-stop", socket.id)
            }
            socket.emit("video-stop", roomId);
        }
        preState = state;
    }
    return (
        <div>
            <YouTube opts={opts} videoId={videoId} onReady={onPlayerReady} onStateChange={disclose}></YouTube>
        </div>
    )
}