'use client'
import { createContext, useState} from "react";

export const UserContext = createContext({
    interests: {},
    setInterests: (e:any) => {}, //interestsInterface
    userId: "",
    setUserId: (id:string) => {}
});
export function UserProvider({children}: any) {
    const [interests, setInterests] = useState({});
    const [userId, setUserId] = useState<string | undefined>();
    
    // call api to set interests
    return (
        <UserContext.Provider value ={{
            interests,
            userId,
            setInterests,
            setUserId
        }}>
            {children}
        </UserContext.Provider> 
    )
}