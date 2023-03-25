import React, { createContext, ReactNode, useCallback, 
    useContext, useEffect, useState } from 'react';
import {api} from '../services/api';
import errors from '../utils/errors';

import { storageUserGet, storageUserSave, storageUserRemove } from '../storage/storageUser';
import { storageAuthTokenGet, storageAuthTokenRemove, 
    storageAuthTokenSave } from "../storage/storageAuthToken";
import { UserDTO } from '../dtos/UserDTO';

interface AuthContextData {
  user: UserDTO;
  signIn(email: string, password: string): Promise<void>
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
}

type AuthContextProviderProps = { 
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthContextProvider({children} : AuthContextProviderProps){ 

  //   const { toast } = useAppToast();
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);
  const [userStorageLoading, setUserStorageLoading] = useState(true);
  const userStorageKey = '@dashgo:user';

  async function storageUserAndTokenSave(userData: UserDTO, token: string) {

    try{
      setIsLoadingUserStorageData(true) 

      await storageUserSave(userData);
      await storageAuthTokenSave(token);

    } catch (error) {
      throw error;

    } finally {
      setIsLoadingUserStorageData(false)
    }      
  }

  async function userAndTokenUpdate(userData: UserDTO, token: string) {      
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData);      
  }

  async function signIn (email: string, password: string) {  
     
         
    try {
      console.log('entrei '); 
      const ram = await api.post('/customer/auth', { email, password });   
      console.log('AQUI', ram); 

      // if(data.user && data.token) {
      //   await storageUserAndTokenSave(data.user, data.token);
      //   userAndTokenUpdate(data.user, data.token)
      // }

    } catch (error) {
      
      console.log('entrei no erro'); 
      throw error

    } finally {
      // setIsLoadingUserStorageData(false);
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true);    
      const userLogged = await storageUserGet();
      const token = await storageAuthTokenGet();

      if(token && userLogged) {
        userAndTokenUpdate(userLogged, token);
      }

    } catch (error) {
      throw error

    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signOut () {
  
    try {

      setIsLoadingUserStorageData(true);
      setUser({} as UserDTO);
      await storageUserRemove();
      await storageAuthTokenRemove();

    } catch (error) {
      throw error;

    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function loadUserStorageData() {
    const userStoraged = await localStorage.getItem(userStorageKey);

    if (userStoraged) {
      const userLogged = JSON.parse(userStoraged) as UserDTO;
      setUser(userLogged);
    }

    setUserStorageLoading(false);
  }

  useEffect(() => {
    loadUserStorageData();
  }, [])
  
  useEffect(() => {
    loadUserData();
  },[])

  return (
    <AuthContext.Provider 
      value={{
        user,             
        signIn,
        signOut,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
