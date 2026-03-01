import { createContext, useEffect, useState } from "react";
import { getMe } from "../services/authServices";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider= ({children}) => {
    
    const [isLoggedin, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true)

    const getAuthState = async () => {
        try{
            const {data} = await getMe();

            if(data?.user){
                setIsLoggedIn(true);
                setUserData(data.user)
            }
            else{
                setIsLoggedIn(false);
                setUserData(null);
            }

        }
        catch(err){
            toast.error(err.message)
            setIsLoggedIn(false);
            setUserData(null);

        }
        finally {
            setLoading(false);
        }

    }
    useEffect(() =>{
        getAuthState();
    },[])

    const value = {
        isLoggedin, setIsLoggedIn,
        userData, setUserData, 
        loading,
        refetchUser: getAuthState

    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}