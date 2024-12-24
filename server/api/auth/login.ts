import {H3Event} from "h3";
import {LoginSchema, loginSchema} from "~/types/auth";
import {User} from "~/types/user";

export default defineEventHandler(async(event: H3Event) => {
    const rawBody = await readBody(event)
    const body: LoginSchema = loginSchema.parse(rawBody)

    const apiUrl = useRuntimeConfig().public.apiUrl

    try {
        const response = await $fetch.raw<User>(`${apiUrl}/users/login`, {method: 'POST', body})
        const responseData = response._data

        if(!responseData){
            return
        }

        const accessToken = response.headers.get('Authorization')
        if(!accessToken){
            return
        }

        await replaceUserSession(event,
            {
                user: {
                    id: responseData.id,
                    name: responseData.name,
                    email: responseData.email,
                    accessToken
                },
                
            }
        )
    } catch(error){
        throw createError({
            statusCode: error.status,
            statusMessage: error.data.message
        })
    }
})