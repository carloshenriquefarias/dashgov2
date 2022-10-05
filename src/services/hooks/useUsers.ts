import {useQuery} from 'react-query'
import {api} from '../../services/api'

type User = {
    id: string;
    name: string;
    email: string;
    created_at: string;
}

export async function getUsers(): Promise<User[]> {
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
}

export function useUsers(){
    return useQuery('users', getUsers,  
    );
}