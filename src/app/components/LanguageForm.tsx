'use client'

import {useState, useEffect} from "react"
import {Select} from "antd"
export default function LanguageForm({language, setLanguage, dispatch}:any){
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
    const options = languages.map((label, value) => {
        return {
            label,
            value
        }
    })
    // add to the beginning
    options.unshift({label: "Choose a language", value: -1});
    const getLanguage = (value:any) => {
        setLanguage(value)
    }
    const next = (e:any) => {
        if (language == -1){
            return;
        }
        localStorage.setItem("language", language)
        dispatch({type: "interestForm"});
    }
    return (
        <>
            <div className="flex flex-col h-full items-stretch justify-center items-center text-center px-[30%]">
                <div className="max-w-m p-8 bg-white border border-gray-200 rounded-lg shadow">
                    <div>
                        <div className="text-4xl">Your Language</div>
                    </div>
                    
                    <div className="flex justify-center items center">
                        {/* <select onChange={getLanguage} id="languages" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 my-12">
                                <option value={-1} key={-1} selected>Choose a language</option>
                                {languages.map((language, index) => {
                                    return(
                                        <>
                                        <option value={index} key={index}>{language}</option>
                                        </>
                                    )
                                })}
                        </select> */}
                        <Select
                            size={"large"}
                            defaultValue={-1}
                            onChange={getLanguage}
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
