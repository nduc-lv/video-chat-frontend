interface Action{
    type: string,
}

export default function profileReducer(state:any, action:Action){
    switch (action.type) {
        case "name":{
            return "name"
        }
        case "age": {
            return "age"
        }
        case "gender":{
            return "gender"
        }
        case "language":{
            return "language"
        }
        case "interests":{
            return "interests"
        }
        case "description": {
            return "description"
        }
      }
      throw Error('Unknown action: ' + action.type);
}