'use client'
import { useEffect, useRef, useState } from "react";
import { Input, Space } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import axiosInstance from "@/app/utils/axios";
import YoutubeVideos from "@/app/components/YoutubeVideos";
import YoutubeVideoPlayer from "@/app/components/YoutubeVideoPlayers";
import socket from "@/app/utils/socket/socketIndex";
import {lazy, Suspense} from 'react';
const {Search} = Input;
export default function WatchTogether({ params }: { params: { 'room-id': string } }){
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const [results, setResults] = useState<any>(null);
    const [videoId, setVideoId] = useState<any>(null);
    const roomId = params["room-id"];
    const h1 = useRef();
    useEffect(() => {
        socket.on("found-video", (videoId) => {
            setVideoId(e => videoId);
        })
    }, [])
    const searchByKey = async (q:string|undefined) => {
        // try{
        //     const data = await axiosInstance.get(`search/?key=${API_KEY}&q=${q}&part=snippet&type=video&maxResults=50`);
        //     setResults([...data.data.items])
        // }
        // catch (e) {
        //     console.log(e);
        // }
        
        setResults( [
                {
                    "kind": "youtube#searchResult",
                    "etag": "D-Ik7kK74vIc7cqGkAb3V85u-oY",
                    "id": {
                        "kind": "youtube#video",
                        "videoId": "FvOpPeKSf_4"
                    },
                    "snippet": {
                        "publishedAt": "2022-06-13T20:34:18Z",
                        "channelId": "UCZW5lIUz93q_aZIkJPAC0IQ",
                        "title": "Joji -  Glimpse of Us",
                        "description": "'SMITHEREENS' album out now: https://joji.lnk.to/SMITHEREENS Official 'SMITHEREENS' merch: https://joji.lnk.to/officialstore ...",
                        "thumbnails": {
                            "default": {
                                "url": "https://i.ytimg.com/vi/FvOpPeKSf_4/default.jpg",
                                "width": 120,
                                "height": 90
                            },
                            "medium": {
                                "url": "https://i.ytimg.com/vi/FvOpPeKSf_4/mqdefault.jpg",
                                "width": 320,
                                "height": 180
                            },
                            "high": {
                                "url": "https://i.ytimg.com/vi/FvOpPeKSf_4/hqdefault.jpg",
                                "width": 480,
                                "height": 360
                            }
                        },
                        "channelTitle": "88rising",
                        "liveBroadcastContent": "none",
                        "publishTime": "2022-06-13T20:34:18Z"
                    }
                },
                {
                    "kind": "youtube#searchResult",
                    "etag": "zPh3JPu3CiZmWV3yPOu4LWoBh_E",
                    "id": {
                        "kind": "youtube#video",
                        "videoId": "kIEWJ1ljEro"
                    },
                    "snippet": {
                        "publishedAt": "2022-11-04T04:00:12Z",
                        "channelId": "UCFl7yKfcRcFmIUbKeCA-SJQ",
                        "title": "Joji - Die For You",
                        "description": "'SMITHEREENS' album out now: https://joji.lnk.to/SMITHEREENS Official 'SMITHEREENS' merch: https://joji.lnk.to/officialstore ...",
                        "thumbnails": {
                            "default": {
                                "url": "https://i.ytimg.com/vi/kIEWJ1ljEro/default.jpg",
                                "width": 120,
                                "height": 90
                            },
                            "medium": {
                                "url": "https://i.ytimg.com/vi/kIEWJ1ljEro/mqdefault.jpg",
                                "width": 320,
                                "height": 180
                            },
                            "high": {
                                "url": "https://i.ytimg.com/vi/kIEWJ1ljEro/hqdefault.jpg",
                                "width": 480,
                                "height": 360
                            }
                        },
                        "channelTitle": "Joji",
                        "liveBroadcastContent": "none",
                        "publishTime": "2022-11-04T04:00:12Z"
                    }
                },
                {
                    "kind": "youtube#searchResult",
                    "etag": "_Jlg7iETs-M5tB3BKRSmg3vX2Bo",
                    "id": {
                        "kind": "youtube#video",
                        "videoId": "K3Qzzggn--s"
                    },
                    "snippet": {
                        "publishedAt": "2018-09-12T14:00:08Z",
                        "channelId": "UCZW5lIUz93q_aZIkJPAC0IQ",
                        "title": "Joji - SLOW DANCING IN THE DARK",
                        "description": "'SMITHEREENS' album out now: https://joji.lnk.to/SMITHEREENS Official 'SMITHEREENS' merch: https://joji.lnk.to/officialstore ...",
                        "thumbnails": {
                            "default": {
                                "url": "https://i.ytimg.com/vi/K3Qzzggn--s/default.jpg",
                                "width": 120,
                                "height": 90
                            },
                            "medium": {
                                "url": "https://i.ytimg.com/vi/K3Qzzggn--s/mqdefault.jpg",
                                "width": 320,
                                "height": 180
                            },
                            "high": {
                                "url": "https://i.ytimg.com/vi/K3Qzzggn--s/hqdefault.jpg",
                                "width": 480,
                                "height": 360
                            }
                        },
                        "channelTitle": "88rising",
                        "liveBroadcastContent": "none",
                        "publishTime": "2018-09-12T14:00:08Z"
                    }
                },
                {
                    "kind": "youtube#searchResult",
                    "etag": "IWBp5LMJsMjyYPI9vjTiL_y7Sfs",
                    "id": {
                        "kind": "youtube#video",
                        "videoId": "YWN81V7ojOE"
                    },
                    "snippet": {
                        "publishedAt": "2019-06-14T14:00:10Z",
                        "channelId": "UCZW5lIUz93q_aZIkJPAC0IQ",
                        "title": "Joji - Sanctuary (Official Video)",
                        "description": "'SMITHEREENS' album out now: https://joji.lnk.to/SMITHEREENS Official 'SMITHEREENS' merch: https://joji.lnk.to/officialstore ...",
                        "thumbnails": {
                            "default": {
                                "url": "https://i.ytimg.com/vi/YWN81V7ojOE/default.jpg",
                                "width": 120,
                                "height": 90
                            },
                            "medium": {
                                "url": "https://i.ytimg.com/vi/YWN81V7ojOE/mqdefault.jpg",
                                "width": 320,
                                "height": 180
                            },
                            "high": {
                                "url": "https://i.ytimg.com/vi/YWN81V7ojOE/hqdefault.jpg",
                                "width": 480,
                                "height": 360
                            }
                        },
                        "channelTitle": "88rising",
                        "liveBroadcastContent": "none",
                        "publishTime": "2019-06-14T14:00:10Z"
                    }
                },
                {
                    "kind": "youtube#searchResult",
                    "etag": "fWIA-MHwKS4_tuNCa9aPjMN1WEc",
                    "id": {
                        "kind": "youtube#video",
                        "videoId": "NgsWGfUlwJI"
                    },
                    "snippet": {
                        "publishedAt": "2022-06-10T04:00:10Z",
                        "channelId": "UCFl7yKfcRcFmIUbKeCA-SJQ",
                        "title": "Joji - Glimpse of Us (Official Video)",
                        "description": "\"Glimpse of Us\" - out now. Stream: https://joji.lnk.to/GlimpseofUs 'SMITHEREENS' album out now: https://joji.lnk.to/SMITHEREENS ...",
                        "thumbnails": {
                            "default": {
                                "url": "https://i.ytimg.com/vi/NgsWGfUlwJI/default.jpg",
                                "width": 120,
                                "height": 90
                            },
                            "medium": {
                                "url": "https://i.ytimg.com/vi/NgsWGfUlwJI/mqdefault.jpg",
                                "width": 320,
                                "height": 180
                            },
                            "high": {
                                "url": "https://i.ytimg.com/vi/NgsWGfUlwJI/hqdefault.jpg",
                                "width": 480,
                                "height": 360
                            }
                        },
                        "channelTitle": "Joji",
                        "liveBroadcastContent": "none",
                        "publishTime": "2022-06-10T04:00:10Z"
                    }
                }
            ])
    }
    const onSearch = (query:string|undefined) => {
        searchByKey(query);
    }
    return(
        <>
        <div className="flex flex-row" style={{backgroundColor:"#19202A", height:"100vh", width:"100%"}}>
            <div className="grow-1 overflow-y-auto no-scrollbar" style={{width:"33vw"}}>
            <Search
                placeholder="input search text"
                allowClear
                onSearch={onSearch}
                style={{ width: 304,  top: 0, position:"sticky", zIndex:1}}
            ></Search>
                {results == null || <YoutubeVideos items={results} setVideoID={setVideoId} roomId={roomId}></YoutubeVideos>}
            </div>
            <div className="flex flex-col justify-center items-center">
                {videoId == null || <YoutubeVideoPlayer videoId={videoId}></YoutubeVideoPlayer>}
            </div>
            <div className="grow-1"></div>
        </div>
        </>
    )
}