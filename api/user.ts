import type {Space} from "~/types/space";

export function apiGetUserSpaces(): Promise<Space[]>{
    const {$api} = useNuxtApp()
    return $api('/users/spaces')
}