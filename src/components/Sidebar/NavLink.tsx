import { Text, Link as ChakraLink, Icon, LinkProps as ChakraLinkProps } from '@chakra-ui/react'
import { ElementType } from 'react';
import { RiDashboardLine } from 'react-icons/ri'
import Link from 'next/link'

interface NavLinkProps extends ChakraLinkProps{
    icon: ElementType,
    children: string,
}

export function NavLink({icon, children, ...rest}: NavLinkProps){
    return(
        <Link >
            <ChakraLink display="flex" alignItems="center" {...rest}>
                <Icon as={icon} fontSize="20"/> 
                <Text ml="4" fontWeight="medium">{children}</Text>                     
            </ChakraLink> 
        </Link>
           
    );
}