/* eslint-disable prettier/prettier */
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext,useState } from 'react';
import { BASE_URL } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(false);

    const login = (email_address, password) => {
        axios.post(`${BASE_URL}`,{
            email_address,
            password,
        }).then(res =>{
            let userInformation = res.data;
            console.log(userInformation);
            setUserInfo(userInformation);
             AsyncStorage.setItem('userInfo', JSON.stringify(userInformation));
        }).catch(e =>{
            console.log('login error `{e}`');
        });
    }

    return (
        <AuthContext.Provider value={{userInfo, login}}>
            {children}
        </AuthContext.Provider>
    );

};

