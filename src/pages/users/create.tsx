import { Box, Flex, Heading, Divider, VStack, SimpleGrid, HStack, Button} from "@chakra-ui/react";
import { Header } from "../../components/Header/Index";
import { SideBar } from "../../components/Sidebar/index";
import { Input } from "../../components/Form/Input";
import Link from 'next/link'

import * as yup from 'yup'
import { SubmitHandler, useForm } from "react-hook-form";
import {yupResolver } from "@hookform/resolvers/yup"

type CreateUserFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

const createUserFormSchema = yup.object().shape({
    name: yup.string().required('Nome Obrigatório'),
    email: yup.string().required('E-mail obrigatório').email('E-mail Inválido'),
    password: yup.string().required('Senha obrigatório').min(6, 'No mínimo 6 caracteres'),
    password_confirmation: 
        yup
        .string()
        // .required('Senha obrigatório')
        .oneOf([null, yup.ref('password')], 'As senhas precisam ser iguais' )
})

export default function CreateUser(){

    const {register, handleSubmit, formState} = useForm({ 
        resolver: yupResolver(createUserFormSchema)
    })

    const {errors} = formState 

    const handleCreateUser: SubmitHandler<CreateUserFormData> = async (values) => {
        await new Promise((resolve => setTimeout(resolve, 2000)));

        console.log('values');        
    }   

    return (
        <Box>
            <Header/>
            <Flex width="100%" my="6" maxWidth={1480} mx="auto" px="6">
                <SideBar />
                {/* //flex dentro da box abaixo = ocupar toda a largura possivel */}
                <Box 
                    as="form" 
                    flex="1" 
                    borderRadius={8} 
                    bg="gray.800" p="8" 
                    onSubmit={handleSubmit(handleCreateUser)}
                > 
                    <Heading size="lg" fontWeight="normal">Criar Usuario</Heading>
                    <Divider my="6" borderColor="gray.700"></Divider>
                    <VStack spacing="8">
                        <SimpleGrid minChildWidth="240px" spacing="8" width="100%">
                            <Input 
                                name="name" 
                                label="Nome Completo"                                 
                                error={errors.name}
                                {...register("name")}
                            />
                            <Input name="email" type="email" label="E-mail" error={errors.email}/>
                        </SimpleGrid>

                        <SimpleGrid minChildWidth="240px" spacing="8" width="100%">
                            <Input 
                                name="password" 
                                type="password" 
                                label="Senha" 
                                {...register("password")}
                                error={errors.password}
                            />
                            <Input 
                                name="password_confirmation" 
                                type="password" 
                                label="Confirmar Senha"
                                {...register("password_confirmation")}
                                error={errors.password_confirmation}
                            />
                        </SimpleGrid>
                    </VStack>
                    <Flex mt="8" justify="flex-end">
                        <HStack spacing="4">
                            <Link href="/users" passHref>
                                <Button colorScheme="whiteAlpha">Cancelar</Button>
                            </Link>                            
                            <Button 
                                type="submit" 
                                colorScheme="pink" 
                                isLoading={formState.isSubmitting}>
                                    Salvar
                            </Button>
                        </HStack>
                    </Flex>

                </Box>
            </Flex>
        </Box>
    );
}   