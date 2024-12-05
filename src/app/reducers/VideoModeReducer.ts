interface Action{
    type: string,
}

export default function VideoModeReducer(state:any, action:Action){
    switch (action.type) {
        case "normal":{
            return "normal"
        }
        case "chat": {
            return "chat"
        }
      }
      throw Error('Unknown action: ' + action.type);
}