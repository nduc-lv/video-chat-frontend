'use client'
import { createContext, useEffect, useState} from "react";
import { useRef } from "react";

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import socket from "../utils/socket/socketIndex";
import http from "../utils/http";
// firebase.initializeApp({
//     // your config
    
// })

// const auth = firebase.auth();
// const firestore = firebase.firestore();


// interface User {
//     displayName: string,
//     uid: string
// }
interface User {
    uid: string;
    name: string;
    gender: number;
    dateOfBirth: string;
    language: number;
    sexualInterests: number
}
export const UserContext = createContext({
    interests: {},
    setInterests: (e:any) => {}, //interestsInterface
    userId: "",
    setUserId: (id:string) => {},
    setState: (state: boolean) => {},
    user: {} || undefined,
    isUser: false, 
});
export function UserProvider({children}: any) {
    const [interests, setInterests] = useState({});
    const [userId, setUserId] = useState<string>("");
    const [state, setState] = useState<boolean>(false);
    const [user, setUser] = useState<User>();
    const [isUser, setIsUser] = useState<boolean>(false);
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token ) {
            http.getWithAutoRefreshToken("/getMyInfo", {useAccessToken: true})
            .then((data) => {
                console.log(data);
                const newUser = {
                    name: data.name,
                    gender: data.gender,
                    language: data.language,
                    dateOfBirth: data.dateOfBirth,
                    sexualInterests: data.sexualInterests,
                    uid: data.uid
                }
                setUser(curr => newUser)
            }).catch((e) => {
                localStorage.clear();
            })
        }
        setUser(curr => undefined)
    }, [state])
    return (
        <UserContext.Provider value ={{
            interests,
            userId,
            setInterests,
            setUserId,
            setState,
            user,
            isUser
        }}>
            {children}
        </UserContext.Provider> 
    )
}