import type {Language} from "~/types/language";
import {z} from "zod";

export function apiGetLanguages(projectId: number): Promise<Language[]>{
    const {$api} = useNuxtApp()
    return $api(`/languages/${projectId}`)
}

export const createLanguageSchema = z.object({
    name: z.string().min(1, "Name must be at least 1 character")
})

export type CreateLanguageDto = z.output<typeof createLanguageSchema>

export function apiCreateLanguage(data: CreateLanguageDto, projectId: number): Promise<Language> {
    const {$api} = useNuxtApp()
    return $api(`/languages`, {
        method: 'POST',
        body: {
            ...data,
            projectId
        }
    })
}

export function apiDeleteLanguage(languageId: number): Promise<void>{
    const {$api} = useNuxtApp()
    return $api(`/languages/${languageId}`, {
        method: 'DELETE'
    })
}