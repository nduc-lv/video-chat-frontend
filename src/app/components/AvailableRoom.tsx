"use client"
import { Card, Modal } from 'antd';
import { useEffect, useReducer, useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import {HomeOutlined} from "@ant-design/icons"
import PreviewYoutubePlayer from './PreviewYoutubePlayer';
import socket from '../utils/socket/socketIndex';
export default function AvailableRooms({rooms, dispatch,request, requestState}: any){
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [video, setVideo] = useState(false);
    const groups = ["Male", "Female"]
    const [index, setIndex] = useState<any>()
    const languages = [
      "English",
      "Afrikaans",
      "العربية",
      "Azeri",
      "Български",
      "বাংলা",
      "Bosanski",
      "Català",
      "Čeština",
      "Dansk",
      "Deutsch",
      "Ελληνικά",
      "English (Australia)",
      "English (UK)",
      "Español",
      "Español (Argentina)",
      "Español (España)",
      "Eesti keel",
      "Euskera",
      "Suomi",
      "Français (France)",
      "Français (Canada)",
      "Galego",
      "עברית",
      "हिन्दी",
      "Hrvatski",
      "Magyar",
      "Bahasa Indonesia",
      "Italiano",
      "日本語",
      "ქართული ენა",
      "қазақ тілі",
      "ខ្មែរ",
      "한국어",
      "Lietuvių",
      "Latviešu",
      "Македонски",
      "Bahasa Melayu",
      "Norsk (bokmål)",
      "Nederlands",
      "Polski",
      "Português (Brasil)",
      "Português (Portugal)",
      "Română",
      "Русский",
      "Slovenčina",
      "Slovenščina",
      "Srpski",
      "Svenska",
      "தமிழ்",
      "తెలుగు",
      "ภาษาไทย",
      "Filipino",
      "Türkçe",
      "Українська",
      "Tiếng Việt",
      "中文 (简体)",
      "中文 (台灣)"
  ]
    const showModal = () => {
      setOpen(true);
      setVideo(true);
    };
    const handleOk = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
      }, 3000);
    };
    const [roomInfo, setRoomInfo] = useState<any>()
    const handleCancel = () => {
      setOpen(false);
      dispatch({type: "none"});
    };
    const slideLeft = () => {
      const slider = document.getElementById('slider');
      if (slider){
        slider.scrollLeft = slider.scrollLeft - 500;
      }
    };
  
    const slideRight = () => {
      const  slider = document.getElementById('slider');
      if (slider){
        slider.scrollLeft = slider.scrollLeft + 500;
      }
    };
  
    return (
        <>
        {(rooms.includes(null) || rooms.length == 0) ? <div className='text-center text-2xl'> No room available</div> : 
        
            <div className="flex items-center relative">
            <MdChevronLeft className='opacity-50 cursor-pointer hover:opacity-100' onClick={slideLeft} size={40}></MdChevronLeft>
            <div id='slider' className='w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide'>
            {rooms.map((e, index) => {
                return (
                    <div key = {index} className='inline-block'>
                        <Card hoverable title={(<div className='flex flex-row' style={{gap:10}}><HomeOutlined />{`${e.name}'s Room`}</div>)} bordered={true} style={{ width: 300, border: "1px solid black",  overflow: "hidden"}} onClick={() => {setRoomInfo({...e}); setIndex(curr => index);showModal()}}>
                                <p><span style={{fontWeight: "bold"}}>Gender: </span>{groups[e.gender]}</p>
                                <p><span style={{fontWeight: "bold"}}>Language: </span>{languages[e.language]}</p>
                        </Card>
                    </div>
                )
            })}
              </div>
              <MdChevronRight className='opacity-50 cursor-pointer hover:opacity-100' onClick={slideRight} size={40} />
            </div>
        }
                                <Modal
                                    open={open}
                                    title="Description"
                                    onOk={handleOk}
                                    onCancel={() => {setVideo(curr => false); setTimeout(handleCancel, 500)}}
                                    footer={null}
                                >
                                  {!(requestState == "none") || 
                                    <>
                                      <p className='my-4'>{roomInfo?.description}</p>
                                      <div className='flex justify-center items-center my-8'>
                                        {!(video) || <PreviewYoutubePlayer socket={socket} socketId={rooms[index]?.socketId}></PreviewYoutubePlayer>}
                                      </div>
                                      <div onClick={request} className='cursor-pointer px-2 py-1 font-medium text-center text-white bg-blue-500 rounded-md hover:bg-blue-700' data-index = {index}>Request To Join</div>
                                      {/* personal youtube play component, which will ask server for the data, if none then no display, if search video equal true -> display,  */}
          
                                    </>
                                  }
                                  {!(requestState == "waiting") ||
                                  <div>
                                    Waiting for answer...
                                  </div>}
                                  {!(requestState == "accepted") || 
                                  <div>
                                    Request accepted, joining room...
                                  </div>}
                                  {!(requestState == "declined") || 
                                  <div>
                                     Request declined
                                  </div>}
                                </Modal>
        </>
    )
}