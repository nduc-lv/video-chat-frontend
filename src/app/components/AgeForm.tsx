'use client'

import {Select} from "antd";
export default function AgeForm({setAgeGroup, ageGroup, dispatch}:any){
    const groups = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]
    const options = groups.map((label, value) => {
        return {
            label,
            value
        }
    })
    options.unshift({label: "Choose an age group", value: -1});
    const getAgeGroup = (value:any) => {
        setAgeGroup(value);
    }
    const next = (e:any) => {
        if (ageGroup == -1){
            return;
        }
        console.log(ageGroup)
        localStorage.setItem("ageGroup", ageGroup);
        dispatch({type: "genderForm"});
    }
    return (
        <>
            <div className="flex flex-col h-full items-stretch justify-center items-center text-center px-[30%]">
                <div className="max-w-m p-8 bg-white border border-gray-200 rounded-lg shadow">
                    <div>
                        <div className="text-4xl">Your age</div>
                    </div>
                    <div className="flex justify-center items-center">
                    <Select
                            size={"large"}
                            defaultValue={-1}
                            onChange={getAgeGroup}
                            className="w-3/4 my-12"
                            options={options}
                        />
                    </div>
                    <div>
                    <button  onClick={next} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Next</button>
                    </div>
                </div>
            </div>
        </>
    )
}
