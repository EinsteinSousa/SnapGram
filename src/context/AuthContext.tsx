import { getCurrentUser } from '@/lib/appwrite/api';
import type { IContextType } from '@/types';
import {createContext, useContext,useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER ={
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: '',
};

const INTIAL_STATE={
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setisAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<IContextType>(INTIAL_STATE);

const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user,setUser] = useState<IUSER>(INITIAL_USER)
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setisAuthenticated] = useState(false);

    const navigate = useNavigate();
    const checkAuthUser = async() => {
        try {
            const  currentAccount = await getCurrentUser();

            if(currentAccount){
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio
                })
                setisAuthenticated(true);
                return true;
            }
            return false;
        }
        catch (error) {
            console.log(error);
            return false;
        }finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
                    //localStorage.getItem('cookieFallBack') === null

        if(
            localStorage.getItem('cookieFallBack') === '[]' 
            ) navigate('/sign-in')

            checkAuthUser();
    },[]);

    const value={
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setisAuthenticated,
        checkAuthUser
    }

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
export const useUserContext = () => useContext(AuthContext);
