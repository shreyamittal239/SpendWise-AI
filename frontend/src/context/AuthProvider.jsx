
import { createContext, useState , useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

const AuthProvider = ( {children}) => {

    const [user , setUser] = useState(null);
    const [loading , setLoading] = useState(true);
     
    const login = async (formData) => {

        const response = await api.post("/auth/login", formData);

        setUser(response.data.user);
         setLoading(false);

        return response.data;
    };

  const getCurrentUser = async () => {

    try {

        const response = await api.get("/auth/me");

        setUser(response.data.user);

    } catch (error) {

        setUser(null);

    } finally {

        setLoading(false);

    }

};
useEffect(() => {

    getCurrentUser();

}, []);


     const logout = async () => {

    await api.post("/auth/logout");

    setUser(null);
     setLoading(false);

};
    return ( 
        <AuthContext.Provider 
         value= { {
            user,
            setUser,
            loading,
            login,
            
            logout,
            getCurrentUser,
         }}>
          { children }
        </AuthContext.Provider>
    )
} ;

export { AuthProvider };
export default AuthContext;