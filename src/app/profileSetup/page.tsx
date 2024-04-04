'use client'

import NameForm from "../components/NameForm"
import {useReducer, useState} from "react"
import profileReducer from "../reducers/ProfileReducer"
import AgeForm from "../components/AgeForm"
import GenderForm from "../components/GenderForm"
import LanguageForm from "../components/LanguageForm"
import InterestForm from "../components/InterestForm"

export default function ProfileSetup(){
    const [name, setName] = useState<string>()
    const [state, dispatch] = useReducer(profileReducer, "name");
    const [ageGroup, setAgeGroup] = useState<number>(-1); // not selected
    const [genderInterest, setGenderInterest] = useState<number>(0);
    const [gender, setGender] = useState<number>(0);
    const [language, setLanguage] = useState<number>(-1);
    const [selectedInterests, setInterests] = useState([]);
    console.log(name);
    return(
        <>
            { !(state=="name") || <NameForm setName={setName} name={name} dispatch={dispatch}></NameForm>}
            { !(state=="age") || <AgeForm setAgeGroup={setAgeGroup} ageGroup={ageGroup} dispatch={dispatch}></AgeForm>}
            {!(state=="gender") || <GenderForm setGender={setGender} gender={gender} dispatch={dispatch} sexualInterest={genderInterest} setSexualInterest={setGenderInterest}></GenderForm>}
            {!(state == "language") || <LanguageForm language={language} setLanguage={setLanguage} dispatch={dispatch}></LanguageForm>}
            {!(state =="interests") || <InterestForm selectedInterests={selectedInterests} setInterests={setInterests} dispatch={dispatch}></InterestForm>}
        </>
    )
}