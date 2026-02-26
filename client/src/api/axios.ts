import axios from 'axios'

export const api = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
})
//middleware for outgoing requests
api.interceptors.request.use(
    (req)=>{
        const token = localStorage.getItem("token");

        if(token){
            req.headers.Authorization = `Bearer ${token}`
        }

        return req;
    },
    (error)=>Promise.reject(error)
)
//middleware for incoming responses
api.interceptors.response.use(
    (res)=>res,(error)=>{
        if(error.response?.status===401){
            localStorage.removeItem("token");
            window.location.href="/loginUser";
        }
        return Promise.reject(error)
    }
)