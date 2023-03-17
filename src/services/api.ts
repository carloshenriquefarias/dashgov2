// import axios from 'axios'

// export const api = axios.create({
//     baseURL: 'http:///localhost:3000/api',
// })

import { rejects } from 'assert';
import axios, {AxiosError}from 'axios';
import {parseCookies, setCookie} from "nookies"
import { AuthProvider, signOut } from '../components/Users/AuthContext';

interface AxiosErrorResponse {
    code?: string;
}

let isRefreshing = false;
let failRequestQueue = [];

export function setupAPIClient(ctx = undefined){
    let cookies = parseCookies(ctx);

    const api = axios.create({
        // baseURL: 'http://localhost:3000/api',   
        baseURL: 'http://localhost:3333',
        // baseURL: 'http://localhost:3334',
        headers:{
            Authorization: `Bearer ${cookies['nextauth.token']}`
        }
    })

    // Apenas na 1 vez qu eo usuario fizer login
    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError<AxiosErrorResponse>) => {
    // (error: AxiosError) =>{
        if (error.response.status === 401){
            if(error.response.data?.code === 'token.expired'){
                cookies = parseCookies(ctx);
                //renovar o token
                const {'nextauth.refreshtoken': refreshtoken } = cookies;
                const originalConfig = error.config
                
                if(!isRefreshing){
                    isRefreshing = true
                        
                    api.post('/refresh',{
                        refreshtoken,                
                    }). then( response =>{
                        const {token} = response.data

                        setCookie(ctx, 'nextauth.token', token, {
                            maxAge: 60 * 60 * 24 * 30, //30 dias, tempo de vida do cookie
                            path: '/'
                        })                
                    
                        setCookie(ctx, 'nextauth.refreshtoken', response.data.refreshToken,{
                            maxAge: 60 * 60 * 24 * 30, //30 dias, tempo de vida do cookie
                            path: '/'
                        })

                        api.defaults.headers['Authorization'] = `Bearer ${token}`;

                        failRequestQueue.forEach(request => request.onSucess(token))  
                        failRequestQueue = []; 
                    }).catch(err =>  {
                        failRequestQueue.forEach(request => request.onFailure(err))  
                        failRequestQueue = []; 

                        // if(process.browser){
                        //     signOut()
                        // }                    
                        
                        if(typeof window !== 'undefined'){
                            signOut()
                        }

                    }).finally(() => {
                        isRefreshing = false
                    })
                } 

                return new Promise ((resolve, reject) => {
                    failRequestQueue.push({
                        onSucess: (token: string) => {
                            originalConfig.headers['Authorization'] = `Bearer ${token}`;
                            resolve(api(originalConfig))
                        },
                        onFailure: (err: AxiosError) => {
                            reject(err)
                        },
                    })
                })

            } else{
                //deslogar usuario
                if(typeof window !== 'undefined'){
                    signOut()
                }            
            }        
        }
        return Promise.reject (error)
    })
    return api;
}
