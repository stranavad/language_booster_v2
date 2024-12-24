import {z} from "zod";
import type {BranchRequest} from "~/types/branchRequest";

export const createBranchRequestSchema = z.object({
    name: z.string().min(1, "Name is required"),
    branchId: z.number().gte(1, "You have to select branch")
})

export type CreateBranchRequestDto = z.output<typeof createBranchRequestSchema>

export function apiCreateBranchRequest(body: CreateBranchRequestDto): Promise<BranchRequest>{
    const {$api} = useNuxtApp()
    return $api(`/requests`, {
        method:'POST',
        body
    })
}

export function apiGetBranchRequests(projectId: number): Promise<BranchRequest[]> {
    const {$api} = useNuxtApp()
    return $api(`/requests/${projectId}`)
}

export function apiDeleteBranchRequest(requestId: number): Promise<void> {
    const {$api} = useNuxtApp()
    return $api(`/requests/${requestId}`, {
        method:'DELETE'
    })
}