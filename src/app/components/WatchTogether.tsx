'use client'
import { useEffect, useRef, useState } from "react";
import { Input, Space } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import axiosInstance from "@/app/utils/axios";
import YoutubeVideos from "@/app/components/YoutubeVideos";
import YoutubeVideoPlayer from "@/app/components/YoutubeVideoPlayers";
import socket from "@/app/utils/socket/socketIndex";
const {Search} = Input;
export default function WatchTogether({roomId}:any){
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const [results, setResults] = useState<any>(null);
    const [videoId, setVideoId] = useState<any>(null);
    const h1 = useRef();
    useEffect(() => {
        socket.on("found-video", (videoId) => {
            setVideoId((e:any) => videoId);
        });
        return () => {
            socket.off("found-video");
            socket.off("video-seek");
            socket.off("video-stop");
        }
    }, [])
    const searchByKey = async (q:string|undefined) => {
        try{
            const data = await axiosInstance.get(`search/?key=AIzaSyDBK92kk9RQDIaK4CYs39S21pAzrP4gxq8&q=${q}&part=snippet&type=video&maxResults=50`);
            setResults([...data.data.items])
        }
        catch (e) {
            console.log(e);
        }
    }
    const onSearch = (query:string|undefined) => {
        searchByKey(query);
    }
    return(
        <>
        <div className="flex flex-row h-screen" style={{backgroundColor:"#19202A", width:"100%"}}>
            <div className="overflow-y-auto no-scrollbar" style={{width:"325"}}>
            <Search
                placeholder="input search text"
                allowClear
                onSearch={onSearch}
                style={{ width: 304,  top: 0, position:"sticky", zIndex:1}}
            ></Search>
                {results == null || <YoutubeVideos items={results} setVideoID={setVideoId} roomId={roomId}></YoutubeVideos>}
            </div>
            <div className="grow" style={{marginTop:"20px"}}>
                {videoId == null || <YoutubeVideoPlayer videoId={videoId} roomId={roomId} socket={socket}></YoutubeVideoPlayer>}
            </div>
        </div>
        </>
    )
}