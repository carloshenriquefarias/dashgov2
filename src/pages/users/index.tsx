import { Box, Spinner, Flex, Heading, Button, Icon, Text, Table, Thead, Tr, Th, Td, Checkbox, Tbody, useBreakpointValue } from "@chakra-ui/react";
import { Header } from "../../components/Header/Index";
import { SideBar } from "../../components/Sidebar/index";
import { Pagination } from "../../components/Pagination";
import {RiAddLine, RiPencilLine, RiDeleteBin3Line } from 'react-icons/ri'
import Link from 'next/link'
import { useEffect } from "react";
import {useQuery} from 'react-query'
import {api} from '../../services/api'


export default function UserList(){

    const {data, isLoading, isFetching, error} = useQuery('users', async () =>{
        const {data} = await api.get('users')
        // const data = await response.json()

        const users = data.users.map(user => {
            return{
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year:'numeric'
                })
            };            
        });

        return users;       
    })

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    });
   
    return (
        <Box>
            <Header/>
            <Flex width="100%" my="6" maxWidth={1480} mx="auto" px="6">
                <SideBar />
                {/* //flex dentro da box abaixo = ocupar toda a largura possivel */}
                <Box flex="1" borderRadius={8} bg="gray.800" p="8"> 
                    <Flex mb="8" justify="space-between" align="center">
                        <Heading size="lg" fontWeight="normal">
                            Usuários
                            {!isLoading && isFetching && <Spinner size="sm" color="gray.500" ml="4"/>}
                        </Heading>
                        {/* as = a => converte o botao como link para outra pagina */}
                        
                        <Link href="/users/create" passHref>
                            <Button 
                                as="a" 
                                size="sm" 
                                fontSize="sm" 
                                colorScheme="pink"
                                leftIcon={<Icon as={RiAddLine}fontSize="20"/>}
                            > 
                                Criar Novo
                            </Button>
                        </Link>                        
                    </Flex>
                    
                    {isLoading ? (
                        <Flex justify="center">
                            <Spinner/>
                        </Flex>
                    ): error ?(
                        <Flex justify="center">
                           <Text >Falha ao obter dados dos usuários</Text>
                        </Flex>                        
                    ): (
                        <>
                            <Table colorScheme="whiteAlpha" width="100%">
                                <Thead>
                                    <Tr>
                                        <Th px={["4","6"]} color="gray.300" width="8">
                                            <Checkbox colorScheme="pink"/>                                    
                                        </Th>
                                        <Th>Usuario</Th>
                                        { isWideVersion && <Th>Data de Cadastro</Th>}
                                        <Th w="8">Ações</Th>
                                    </Tr>
                                </Thead> 
                                <Tbody>
                                    {data.map(user =>{
                                        return (
                                            <Tr key={user.id} px={["4","6"]} _hover={{bg: 'gray.700'}}>
                                                <Td><Checkbox colorScheme="pink"/> </Td>
                                                <Td>
                                                    <Box>
                                                        <Text fontWeight="bold" >{user.name}</Text>
                                                        <Text fontSize="sm" color="gray.300">{user.email}</Text>
                                                    </Box>
                                                </Td>
                                                { isWideVersion && <Td>{user.createdAt}</Td>}
                                                <Td>
                                                    <Button 
                                                        as="a" 
                                                        size="sm" 
                                                        fontSize="sm" 
                                                        colorScheme="purple"
                                                        leftIcon={<Icon as={RiPencilLine} fontSize="20"/>}
                                                    > 
                                                        Editar
                                                    </Button>
                                                    <Button 
                                                        as="a" 
                                                        size="sm" 
                                                        fontSize="sm" 
                                                        colorScheme="purple"
                                                        leftIcon={<Icon as={RiDeleteBin3Line} fontSize="15"/>}
                                                        mt="2"
                                                    > 
                                                        Excluir
                                                    </Button>
                                                </Td>
                                            </Tr>  
                                        )
                                    })}
                                                              
                                </Tbody>
                            </Table>
                            <Pagination/>
                        </>
                    )} 
                    <div></div>                              
                </Box>
            </Flex>
        </Box>
    );
}   

