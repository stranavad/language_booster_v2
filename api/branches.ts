import type {Branch} from "~/types/branch";
import {z} from "zod";

export function apiGetBranches(projectId: number): Promise<Branch[]>{
    const {$api} = useNuxtApp()
    return $api(`/branches/${projectId}`, {})
}

export const createBranchSchema = z.object({
    name: z.string().min(1, "Name must be at least 1 character"),
})

export type CreateBranchDto = z.output<typeof createBranchSchema>

export function apiCreateBranch(data: CreateBranchDto, projectId: number): Promise<Branch> {
    const {$api} = useNuxtApp()
    return $api(`/branches`, {
        method: 'POST',
        body: {
            ...data,
            projectId
        }
    })
}

export function apiDeleteBranch(branchId: number):Promise<void>{
    const {$api} = useNuxtApp()
    return $api(`/branches/${branchId}`, {
        method: 'DELETE'
    })
}