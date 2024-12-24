import {z} from "zod";
import type {Space, SpaceMember} from "~/types/space";


export function apiGetSpaces(): Promise<Space[]>{
    const {$api} = useNuxtApp()
    return $api(`/spaces`)
}

export function apiGetSpaceById(spaceId: number): Promise<Space>{
    const {$api} = useNuxtApp()
    return $api(`/spaces/${spaceId}`)
}

export const createSpaceSchema = z.object({
    name: z.string().min(2, "Space name must be at least 2 characters")
})

export type CreateSpaceDto = z.output<typeof createSpaceSchema>

export function apiCreateSpace(body: CreateSpaceDto): Promise<Space>{
    const {$api} = useNuxtApp()
    return $api(`/spaces`, {
        method: 'POST',
        body
    })
}

export function apiUpdateSpace(body: CreateSpaceDto, spaceId: number): Promise<Space>{
    const {$api} = useNuxtApp()
    return $api(`/spaces/${spaceId}`, {
        method: 'PUT',
        body
    })
}

export function apiGetSpaceMembers(spaceId: number): Promise<SpaceMember[]>{
    const {$api} = useNuxtApp()
    return $api(`/spaces/${spaceId}/members`)
}


export enum Role {
    OWNER = "owner",
    ADMIN = "admin",
    EDITOR = "editor",
    VIEWER = "viewer"
}

const zodRoles = z.enum([Role.ADMIN, Role.EDITOR, Role.VIEWER])

export const inviteUserToSpaceSchema = z.object({
    email: z.string(),
    role: zodRoles
})

export type InviteUserToSpaceDto = z.output<typeof inviteUserToSpaceSchema>

export function apiInviteUserToSpace(data: InviteUserToSpaceDto, spaceId: number): Promise<void>{
    const {$api} = useNuxtApp()
    return $api(`/spaces/invite`, {
        method: 'POST',
        body: {
            ...data,
            spaceId
        }
    })
}

interface UpdateSpaceMemberDto {
    role: Role;
    spaceId: number;
    userId: number
}
export function apiUpdateSpaceMember(body: UpdateSpaceMemberDto): Promise<void>{
    const {$api} = useNuxtApp()
    return $api(`/spaces/member`, {
        method: 'PUT',
        body
    })
}

interface RemoveSpaceMemberDto {
    userId: number;
    spaceId: number
}
export function apiRemoveSpaceMember(body: RemoveSpaceMemberDto): Promise<void>{
    const {$api} = useNuxtApp()
    return $api(`/spaces/member`, {
        method: 'DELETE',
        body
    })
}

