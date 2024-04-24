"use client"
import { Card, Modal } from 'antd';
import { useReducer, useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
export default function AvailableRooms({rooms, dispatch,request, requestState}){
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const groups = ["Male", "Female"]
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
    };
    const handleOk = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
      }, 3000);
    };
  
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
        {(rooms.length == 0) ? <div className='text-center text-2xl'> No room available</div> : 
        
            <div className="flex items-center relative">
            <MdChevronLeft className='opacity-50 cursor-pointer hover:opacity-100' onClick={slideLeft} size={40}></MdChevronLeft>
            <div id='slider' className='w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide'>
            {rooms.map((e, index) => {
                return (
                    <div key = {index} className='inline-block cursor-pointer hover:scale-105 ease-in-out duration-300'>
                        <Card title={`${e.name}'s Room`} bordered={true} style={{ width: 300, border: "1px solid black"}} onClick={showModal}>
                                <p>Gender: {groups[e.gender]}</p>
                                <p>Language: {languages[e.language]}</p>
                        </Card>
                                <Modal
                                    open={open}
                                    title="Description"
                                    onOk={handleOk}
                                    onCancel={handleCancel}
                                    footer={null}
                                >
                                  {!(requestState == "none") || 
                                    <>
                                      <p className='my-4'>{e.description}</p>
                                      <div onClick={request} className='cursor-pointer px-2 py-1 font-medium text-center text-white bg-blue-500 rounded-md hover:bg-blue-700' data-index = {index}>Request To Join</div>
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
                    </div>
                )
            })}
              </div>
              <MdChevronRight className='opacity-50 cursor-pointer hover:opacity-100' onClick={slideRight} size={40} />
            </div>
        }
        </>
    )
}