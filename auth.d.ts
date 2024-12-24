import {User as SimpleUser} from '~/types/user'
declare module '#auth-utils'{
    interface User extends SimpleUser {
        accessToken: string;
    }
}
export {}