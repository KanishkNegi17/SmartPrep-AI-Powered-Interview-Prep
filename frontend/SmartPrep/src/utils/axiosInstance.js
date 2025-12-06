import axios from 'axios'
import {BASE_URL} from"./apiPaths"

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000,
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json",
    },
})

//Request interceptor

axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem("token")
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

//Response Interceptor
axiosInstance.interceptors.response.use(
    (response)=>{
        return response
    },
    (error)=>{
        //handle Common Error Globally
        if(error.response){
            if(error.response.status === 401){
                //Redirect Login
                window.location.href = "/"
            }else if(error.response.status === 500){
                console.error("Server Error. Please Try again Later");
            }
        }else if(error.code === "ECONNABORTED"){
            console.error("Request Timerout. Please Try again later");
        }

        return Promise.reject(error)
    }
)

export default axiosInstance