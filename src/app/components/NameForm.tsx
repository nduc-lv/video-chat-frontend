'use client'


import { Input } from "antd";
export default function NameForm({setName, name, dispatch}:any){

    const getName = (e:any) => {
        setName(e.target.value)
    }
    const next = (e:any) => {
        if (!name){
            return;
        }
        localStorage.setItem("name", name);
        dispatch({type: "ageForm"});
    }
    return (
        <>
            <div className="flex flex-col h-full items-stretch justify-center items-center text-center px-[30%]">
                <div className="max-w-m p-8 bg-white border border-gray-200 rounded-lg shadow">
                    <div>
                        <div className="text-4xl">Your name</div>
                    </div>
                    <div className="flex justify-center items-center">
                        {/* <input onChange={getName} type="text" id="first_name" className="my-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5" placeholder="John" required /> */}
                        <Input placeholder="Enter your name" size={"large"} onChange={getName} className="my-8 w-3/4"/>
                    </div>
                    <div>
                    <button  onClick={next} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Next</button>
                    </div>
                </div>
            </div>
        </>
    )
}
