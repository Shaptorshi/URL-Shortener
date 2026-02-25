import { createContext, type ReactNode,useContext,useEffect,useState } from 'react'

//structure of the logged-in user
interface User{
    name:string,
    email:string
}
//structure of what the global context will provide.
interface AuthContextType{
    user:User|null,
    token:string|null,
    login:(token:string,User:User)=>(void),
    logout:()=>(void)
}

const AuthContext = createContext<AuthContextType|undefined>(undefined);

export const AuthProvider=({children}:{children:ReactNode})=>{
    const [user, setUser] = useState<User|null>(null);
    const [token,setToken] = useState<string|null>(()=>{
        return localStorage.getItem('token');
    });

    useEffect(() => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if(storedToken && storedUser){
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    }, []);

    const login = (token:string,user:User)=>{
        setToken(token);
        setUser(user);
        localStorage.setItem("token",token);
        localStorage.setItem("user",JSON.stringify(user));
    }
    const logout=()=>{
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    return (
        <AuthContext.Provider value={{user,token,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
    
}

export const useAuth =()=>{
    const context = useContext(AuthContext);

    if(!context){
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}


