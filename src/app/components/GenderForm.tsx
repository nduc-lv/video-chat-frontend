'use client'

import { useState } from "react"

export default function GenderForm({setGender, gender, dispatch, sexualInterest, setSexualInterest}:any){
    const groups = ["Male", "Female"]
    const sexualGroups = ["Male", "Female", "Everyone"]
    const [selectedGender, setSelectedGender] = useState<number>(0);
    const [selectedInterest, setSelectedInterest] = useState<number>(0);
    console.log(sexualInterest);
    const onClickGender = (e:any) => {
        if (!(e.target instanceof HTMLElement)) {
            console.log(e.target);
            return;
        }
        const ele = e.target;
        console.log(ele.dataset.type);
        setGender(+ele.dataset.type)
        setSelectedGender(+ele.dataset.type) 
    }
    const onClickInterest = (e:any) => {
        if (!(e.target instanceof HTMLElement)) {
            return;
        }
        const ele = e.target;
        console.log(+ele.dataset.type);
        setSelectedInterest(+ele.dataset.type);
        setSexualInterest(+ele.dataset.type);
    }
    const next = (e:any) => {
        if (gender == -1 || sexualInterest == -1){
            return;
        }
        localStorage.setItem("gender", gender);
        localStorage.setItem("sexualInterest", sexualInterest);
        dispatch({type: "languageForm"});
    }
    return (
        <>
            <div className="flex flex-col h-full items-stretch justify-center items-center text-center px-[30%]">
                <div className="max-w-m p-8 bg-white border border-gray-200 rounded-lg shadow">
                    <div className="my-8">
                        <div className="text-4xl">Your Gender</div>
                    </div>
                    {groups.map((gender, index) => {
                        return (
                            <>
                                {(index != selectedGender) ? <div className="inline-block mx-2 text-base font-medium me-2 px-4 py-1.5 rounded-full bg-gray-300 hover:text-white hover:cursor-pointer hover:bg-blue-800" key={index} data-type={index} onClick={onClickGender}>{gender}</div> : 
                                <div className="inline-block mx-2 bg-blue-800 rounded-full text-white text-base font-medium me-2 px-4 py-1.5 hover:cursor-pointer" key={index} data-type={index}>{gender}</div>}
                            </>
                        )
                    })}
                    <div className="my-8">
                        <div className="text-4xl">Interested in</div>
                    </div>
                    {sexualGroups.map((choice, index) => {
                        return (
                            <>
                                 {index != selectedInterest ? <div className="inline-block mx-2 text-base font-medium me-2 px-4 py-1.5 bg-gray-300 rounded-full hover:text-white hover:cursor-pointer hover:bg-blue-800" onClick={onClickInterest} key={index + 10} data-type={index}>{choice}</div> : 
                                <div className="inline-block mx-2 bg-blue-800 rounded-full text-white text-base font-medium me-2 px-4 py-1.5 hover:cursor-pointer" key={index + 10} data-type={index}>{choice}</div>}
                            </>
                        )
                    })}
                    <div>
                    <button  onClick={next} className="mt-8 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Next</button>
                    </div>
                </div>
            </div>
        </>
    )
}
