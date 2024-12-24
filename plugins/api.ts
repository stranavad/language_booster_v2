export default defineNuxtPlugin(() => {
    const {user} = useUserSession()
    const toast = useToast()
    const {apiUrl} = useRuntimeConfig().public

    const api = $fetch.create({
        baseURL: apiUrl,
        headers: {
            authorization: user.value?.accessToken || ''
        },
        onResponseError({response}){
            console.log(response);
            toast.add({
                title: response._data.message,
                color: 'error'
            })
        }
    })

    return {provide: {api}}
})