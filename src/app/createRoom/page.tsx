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
    const {user} = useContext(UserContext);
    function getYearDifference(date1: Date, date2: Date) {
        // Ensure the earlier date is the first parameter
        if (date1 > date2) {
          [date1, date2] = [date2, date1];
        }
      
        // Extract the year, month, and day from the dates
        const year1 = date1.getFullYear();
        const month1 = date1.getMonth();
        const day1 = date1.getDate();
      
        const year2 = date2.getFullYear();
        const month2 = date2.getMonth();
        const day2 = date2.getDate();
      
        // Calculate the difference in years
        let yearDiff = year2 - year1;
      
        // Adjust if the current year in date2 hasn't fully passed relative to date1
        if (month2 < month1 || (month2 === month1 && day2 < day1)) {
          yearDiff--;
        }
      
        return yearDiff;
      }
    if (user && "name" in user && "language" in user && "gender" in user && "sexualInterests" in user && "language" in user && "dateOfBirth" in user) {
        // dispatch({type: "description"});
        localStorage.setItem("name", user.name);
        localStorage.setItem("gender", user.gender);
        localStorage.setItem("language", user.language);
        localStorage.setItem("sexualInterest", user.sexualInterests);
        const currDate = new Date();
        const dob = new Date(user.dateOfBirth);
        const yearDiff = getYearDifference(dob, currDate);
        if (yearDiff <= 24) {
            localStorage.setItem("age", 0);
        }
        else if (yearDiff <= 34){
            localStorage.setItem("age", 1);
        }
        else if (yearDiff <= 44){
            localStorage.setItem("age", 2);
        }
        else if (yearDiff <= 54){
            localStorage.setItem("age", 3);
        }
        else if (yearDiff <= 64) {
            localStorage.setItem("age", 4);
        }
        else {
            localStorage.setItem("age", 5);
        }
        return (
            <>
                <DescriptionForm prevPage = {"language"} description = {description} setDescription = {setDescription}></DescriptionForm>
            </>
        )
    }
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