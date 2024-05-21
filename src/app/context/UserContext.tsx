'use client'
import { createContext, useEffect, useState} from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import socket from "../utils/socket/socketIndex";
firebase.initializeApp({
    // your config
    
})

const auth = firebase.auth();
const firestore = firebase.firestore();


interface User {
    displayName: string,
    uid: string
}
export const UserContext = createContext({
    interests: {},
    setInterests: (e:any) => {}, //interestsInterface
    userId: undefined,
    setUserId: (id:string) => {},
    auth: auth,
    firestore,
    user: {displayName: "", uid: ""},
    firebase

});
export function UserProvider({children}: any) {
    const [interests, setInterests] = useState({});
    const [userId, setUserId] = useState<string | undefined>();
    const [user] = useAuthState(auth as any);
    
    // if user => socket emit notify all 
    // check if user exist -> send back request
    // call api to set interests
    return (
        <UserContext.Provider value ={{
            interests,
            userId,
            setInterests,
            setUserId,
            auth,
            firebase,
            user,
            firestore,
        }}>
            {children}
        </UserContext.Provider> 
    )
}