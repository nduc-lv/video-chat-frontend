interface Action{
    type: string,
}

export default function profileReducer(state:any, action:Action){
    switch (action.type) {
        case "nameForm":{
            return "name"
        }
        case "ageForm": {
            return "age"
        }
        case "genderForm":{
            return "gender"
        }
        case "languageForm":{
            return "language"
        }
        case "interestForm":{
            return "interests"
        }
      }
      throw Error('Unknown action: ' + action.type);
}