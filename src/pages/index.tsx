import {Flex, Button, Stack } from '@chakra-ui/react'
import {Input} from '../components/Form/Input'
import { AuthContext } from '../components/Users/AuthContext';
import {useState, FormEvent, useContext, useEffect} from 'react'
import {useForm } from "react-hook-form"

import * as yup from 'yup'
import {yupResolver } from "@hookform/resolvers/yup"

//Autenticação das páginas
import { GetServerSideProps } from 'next';
// import { withSSRGuest } from '../utils/withSSRGuest';

type SignInFormData = {
  email: string;
  password: string;
}

interface CreateUserFormData { 
  email: string;
  password: string; 
}

export default function SignIn() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const{ register, handleSubmit} = useForm()

  const {signIn} = useContext(AuthContext)

  async function handleSubmit(event: FormEvent){
    event.preventDefault();
    const data = {
      email, 
      password
    }

    await signIn(data)
  }  

  return (
    <Flex 
      w="100vw" 
      h="100vh" 
      align="center"  
      justify="center">
        <Flex 
          as="form" 
          w="100%" 
          maxWidth={360}
          bg="gray.800"          
          p="8"
          borderRadius={8}
          flexDir="column"
          onSubmit={handleSubmit}
        >
          <Stack spacing="4">  
            <Input 
              name='email' 
              placeholder='Digite seu e-mail'
              fontSize="sm"
              type='email' 
              label='E-mail'  
              value={email}              
              onChange={e => setEmail(e.target.value)}
            /> 
            
            <Input 
              name='password' 
              placeholder='Digite sua senha'
              fontSize="sm"
              type='password' 
              label='Senha' 
              value={password}             
              onChange={e => setPassword(e.target.value)}
            />           
          </Stack>
        <Button type='submit' mt="6" colorScheme="pink">Entrar</Button>
        </Flex>        
    </Flex>
  )
}

// export const getServerSideProps = withSSRGuest(async(ctx) => {
//   // console.log(ctx);
//   return{
//     props:{}
//   }
// });
