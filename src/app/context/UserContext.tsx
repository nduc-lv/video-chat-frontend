'use client'
import { createContext, useState} from "react";
import {v4} from "uuid";

export const UserContext = createContext({
    interests: {},
    setInterests: () => {}, //interestsInterface
    userId: "",
    setUserId: (id:string) => {}
});
export function UserProvider({children}) {
    const [interests, setInterests] = useState();
    const [userId, setUserId] = useState<string>();
    
    // call api to set interests
    console.log("hi");
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