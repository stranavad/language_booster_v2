import {z} from "zod";

export const createMutationSchema = z.object({
    key: z.string().min(1, "Key is required"),
    values: z.object({
        languageId: z.number(),
        value: z.string(),
    }).array(),
    projectId: z.number()
})

export type CreateMutationDto = z.output<typeof createMutationSchema>

export function apiCreateMutation(body: CreateMutationDto): Promise<void>{
    const {$api} = useNuxtApp();
    return  $api('/mutations', {
        method: 'POST',
        body
    })
}