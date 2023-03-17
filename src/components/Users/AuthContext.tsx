import {createContext, ReactNode, useEffect, useState} from "react"
import { setupAPIClient } from "../../services/api";
import Router from "next/router";
import {setCookie, parseCookies, destroyCookie} from "nookies"
import { string } from "yup/lib/locale";
import { api } from "../../services/apiClient";

interface SingInCredentials {
    email: string;
    password: string;
}

interface AuthContextData {
    signIn (Credentials): Promise<void>;
    isAuthenticated: boolean;
    user:User
}

interface AuthProviderProps{
    children: ReactNode
}

interface User{
    email: string;
    permissions: string[];
    roles: string[];
}

//Deslogar o usuario
export function signOut(){
    destroyCookie(undefined, 'nextauth.token')
    destroyCookie(undefined, 'nextauth.refreshToken')
    Router.push('/');
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({children}: AuthProviderProps){
    const [user, setUser] = useState<User>()
    const isAuthenticated = !!user;
    
    //Quando o usuario fizer o login pela 1 vez
    useEffect(() => {
        const {'nextauth.token': token} = parseCookies()

        if(token){
            api.get('/me').then(response =>{
                const {email, permissions, roles} = response.data

                setUser({email, permissions, roles})
            }).catch(() =>{
                signOut();
            })
        }
    }, [])

    async function signIn({email, password}: SingInCredentials){
        // console.log({email, password});
        try{
            const response =  await api.post('sessions',{
            // const response =  await api.post('users',{
                email,
                password,
            })

            // console.log('email ',typeof(email))
            // console.log('password ',typeof(password))

            // if (email == 'prisco@gmail.com' && password == '2'){
            //     Router.push('/painel');
            // } else {
            //     alert('Usuario e senha invalidos')
            // }

            const {token, refreshToken, permissions, roles} = response.data

            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, //30 dias, tempo de vida do cookie
                path: '/'
            })
            setCookie(undefined, 'nextauth.refreshtoken', refreshToken,{
                maxAge: 60 * 60 * 24 * 30, //30 dias, tempo de vida do cookie
                path: '/'
            })

            setUser({
                email,
                permissions,
                roles,
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            // Direncionando o usuario para a pagina (so vai funcionar se ele estiver logado)
            Router.push('/dashboard');

            console.log(response.data);
        } catch (err){
            console.log(err)
        }
                
    }

    return(
        <AuthContext.Provider value={{signIn, isAuthenticated, user}}>
            {children}
        </AuthContext.Provider>
    )
}
