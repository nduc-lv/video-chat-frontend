'use client'


import { Input } from "antd";
import { useRouter } from "next/navigation";
import {useContext, useState} from 'react'
import { RoomContext } from "../context/RoomContext";
import {v4} from "uuid";
const { TextArea } = Input;
export default function DescriptionForm({setDescription, description, dispatch, nextPage, prevPage}:any){
    const router = useRouter();
    const [privateMode, setPrivate] = useState("");
    const {setRoomId} = useContext(RoomContext);
    const getDescription = (e:any) => {
        setDescription(e.target.value)
    }
    const groups = ["Public", "Private"]
    const [selectedGender, setSelectedGender] = useState<number>(0);
    const onClick = (e:any) => {
        if (!(e.target instanceof HTMLElement)) {
            return;
        }
        const ele = e.target;
        setPrivate(ele.dataset.type);
        setSelectedGender(+ele.dataset.type);
    }
    const next = (e:any) => {
        if (!description){
            return;
        }
        localStorage.setItem("description", description);
        localStorage.setItem("private", privateMode);
        if (typeof navigator !== 'undefined'){
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                // Request access to camera and microphone
                navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(function(stream) {
                    // Access granted, do something with the stream if needed
                    stream.getTracks()[0].stop();
                    stream.getTracks()[1].stop();
                    // need a new control for: add roomId to the clipboard + watch together
                    const id = v4();
                    setRoomId((prev:any) => id);
                    router.push("/roomCreated");
                    console.log('Access to camera and microphone granted!');
                })
                .catch(function(error) {
                    // Access denied or error occurred
                    console.error('Error accessing camera and microphone:', error);
                });
            } else {
                // Browser doesn't support WebRTC
                console.error('WebRTC is not supported in this browser.');
            }
        }
    }
    const prev = (e: any) => {
        dispatch({type: prevPage});
    }
    return (
        <>
            <div className="flex flex-col h-full items-stretch justify-center items-center text-center px-[30%]">
                <div className="max-w-m p-8 bg-white border border-gray-200 rounded-lg shadow">
                    <div className="my-8">
                        <div className="text-4xl">Say something about your room</div>
                    </div>
                    <div className="flex justify-center items-center my-8">
                        {/* <input onChange={getName} type="text" id="first_name" className="my-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5" placeholder="John" required /> */}
                        <TextArea
                                value={description}
                                onChange={getDescription}
                                placeholder="Controlled autosize"
                                autoSize={{ minRows: 3, maxRows: 9 }}
                        />
                    </div>
                    <div className="my-8 hidden">
                        <div className="text-4xl my-8">Set Visibility</div>
                        {groups.map((gender, index) => {
                        return (
                            <>
                                {(index != selectedGender) ? <div className="inline-block mx-2 text-base font-medium me-2 px-4 py-1.5 rounded-full bg-gray-300 hover:text-white hover:cursor-pointer hover:bg-blue-800" key={index} data-type={index} onClick={onClick}>{gender}</div> : 
                                <div className="inline-block mx-2 bg-blue-800 rounded-full text-white text-base font-medium me-2 px-4 py-1.5 hover:cursor-pointer" key={index} data-type={index}>{gender}</div>}
                            </>
                        )
                    })}
                    </div>
                    <div className="flex justify-center gap-2.5 items-center ">
                    {(!prevPage) ||
                        <button  onClick={prev} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Back</button>
                    }
                    <button  onClick={next} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Next</button>
                    </div>
                </div>
            </div>
        </>
    )
}
