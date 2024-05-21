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
    apiKey: "AIzaSyC3sWpSpiPoUDvo5lT1eQ1_vq3MnG9zI8k",
    authDomain: "peerchat-b33b0.firebaseapp.com",
    databaseURL: "https://peerchat-b33b0-default-rtdb.firebaseio.com",
    projectId: "peerchat-b33b0",
    storageBucket: "peerchat-b33b0.appspot.com",
    messagingSenderId: "877499833610",
    appId: "1:877499833610:web:116dfdcb464ef66d342ef3",
    measurementId: "G-1BGM0Q994D"
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