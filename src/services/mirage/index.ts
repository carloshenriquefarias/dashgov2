import { createServer, Model, Factory} from 'miragejs'
import { faker } from '@faker-js/faker';

type User = {
    name: string;
    email: string;
    created_at: string;
}

export function makeServer(){
    const server = createServer({
        models: {
            user: Model.extend<Partial<User>>({})
        },

        //Usa-se factories para poder gerar ususarios aleatorios
        factories: {
            user: Factory.extend({
                name (i: number){
                    return `User ${i +1}`
                },
                email (){
                    return faker.internet.email().toLowerCase();
                },
                createdAt (){
                    return faker.date.recent(10);
                },
            })
        },

        seeds (server){
            server.createList('user', 10)
        },

        routes(){
            this.namespace = 'api';
            this.timing = 750;

            this.get('/users')
            this.post('/users')
            //Criando as rotas no miragejs

            this.namespace = '';
            this.passthrough();  
        }
    })

    return server;
}