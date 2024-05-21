'use client'

import NameForm from "../components/NameForm"
import {useContext, useReducer, useState} from "react"
import profileReducer from "../reducers/ProfileReducer"
import AgeForm from "../components/AgeForm"
import GenderForm from "../components/GenderForm"
import LanguageForm from "../components/LanguageForm"
import DescriptionForm from "../components/DescriptionForm"
import { UserContext } from "../context/UserContext"

export default function ProfileSetup(){
    const [name, setName] = useState<string>()
    const [state, dispatch] = useReducer(profileReducer, "name");
    const [ageGroup, setAgeGroup] = useState<number>(-1); // not selected
    const [genderInterest, setGenderInterest] = useState<number>(0);
    const [gender, setGender] = useState<number>(0);
    const [language, setLanguage] = useState<number>(-1);
    const [description, setDescription] = useState<string>("");  
    return(
        <>
            {!(state=="name") || <NameForm setName={setName} name={name} dispatch={dispatch} nextPage = {"age"}></NameForm>}
            { !(state=="age") || <AgeForm setAgeGroup={setAgeGroup} ageGroup={ageGroup} dispatch={dispatch} nextPage = {"gender"} prevPage = {"name"}></AgeForm>}
            {!(state=="gender") || <GenderForm setGender={setGender} gender={gender} dispatch={dispatch} sexualInterest={genderInterest} setSexualInterest={setGenderInterest} nextPage = {"language"} prevPage = {"age"}></GenderForm>}
            {!(state == "language") || <LanguageForm nextPage = {"description"} prevPage= {"gender"} language={language} setLanguage={setLanguage} dispatch={dispatch}></LanguageForm>}
            {!(state == "description") || <DescriptionForm prevPage = {"language"} description = {description} setDescription = {setDescription}></DescriptionForm>}
        </>
    )
}