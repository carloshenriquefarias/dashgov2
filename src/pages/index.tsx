import {Flex, Button, Stack } from '@chakra-ui/react'
import {Input} from '../components/Form/Input'
import {useForm } from "react-hook-form"

export default function SignIn() {

  const{ register, handleSubmit} = useForm()

  function handleSignIn(values){

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
          // SE QUISER SABER EM PX multiplique por 4, se for em rem divide por 4
          p="8"
          borderRadius={8}
          flexDir="column"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <Stack spacing="4">  
            <Input name='email' type='email' label='E-mail'ref={register}/> 
            {/* //Para passar ref na apicação é preciso mudar a constante no input Form */}
            <Input name='password' type='password' label='Senha'ref={register}/>           
          </Stack>
        <Button type='submit' mt="6" colorScheme="pink">Entrar</Button>
        </Flex>
    </Flex>
  )
}

