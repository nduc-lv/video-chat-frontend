'use client'

import {useState, useEffect} from "react"
import interests from "../utils/listOfInterest"
import { useRouter } from "next/navigation";
export default function InterestForm({selectedInterests, setInterests, dispatch}:any){
    const listOfInterests = interests;
    const router = useRouter();
    const handleOnClick = (e:any) => {
        // toggle
        // setList
        // use list count to know how many interests the user has chosen
        if (!(e.target instanceof HTMLElement)) {
            return;
        }
        // array of numbers
        if (selectedInterests.includes(+e.target.dataset.type)){
            e.target.classList.toggle("bg-gray-300");
            e.target.classList.toggle("bg-blue-800");
            e.target.classList.toggle("text-white");
            setInterests(arr => arr.filter((item:any) => {
                return item != (+e.target.dataset.type)
            }))
        }
        else{
            console.log(selectedInterests);
            if (selectedInterests.length >= 5){
                return;
            }
            e.target.classList.toggle("bg-gray-300");
            e.target.classList.toggle("bg-blue-800");
            e.target.classList.toggle("text-white");
            setInterests(arr => [...arr, +e.target.dataset.type]);
        }
    }
    const next = (e:any) => {
        if (selectedInterests.length < 5){
            return;
        }
        console.log(selectedInterests);
        localStorage.setItem("interests", JSON.stringify(selectedInterests))
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Request access to camera and microphone
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(function(stream) {
                // Access granted, do something with the stream if needed
                stream.getTracks()[0].stop();
                stream.getTracks()[1].stop();
                router.push("/waitingRoom");
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
    return (
        <>
            <div className="flex flex-col h-full items-stretch justify-center items-center text-center px-52">
                <div className="max-w-m p-8 bg-white border border-gray-200 rounded-lg shadow">
                    <div>
                        <div className="text-4xl">Your Interests</div>
                    </div>
                    <div>{selectedInterests.length} / 5</div>
                    <div className="overflow-y-auto h-60 my-8 no-scrollbar">
                       {listOfInterests.map((interest, index) => {
                        return (
                            <>
                              <div className="inline-block mx-2 text-base font-medium me-2 px-4 py-1.5 rounded-full bg-gray-300 hover:text-white hover:cursor-pointer hover:bg-blue-800 my-2" key={index} data-type={index} onClick={handleOnClick}>{interest}</div>  
                            </>
                        )
                       })}
                    </div>
                    
                    <div>
                    <button  onClick={next} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Next</button>
                    </div>
                </div>
            </div>
        </>
    )
}
