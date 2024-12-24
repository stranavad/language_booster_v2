import {z} from "zod";
import type {Project} from "~/types/project";

export const createProjectSchema = z.object({
    name: z.string().min(1, "Name is required"),
    primaryLanguage: z.string().min(1, "Primary Language is required"),
})

export type CreateProjectDto = z.output<typeof createProjectSchema>

export function apiCreateProject(data: CreateProjectDto, spaceId: number): Promise<Project>{
    const {$api} = useNuxtApp()
    return $api(`/projects`, {
        method: 'POST',
        body: {
            ...data,
            spaceId
        }
    })
}

export function apiGetProjects(spaceId: number): Promise<Project[]>{
    const {$api} = useNuxtApp()
    return $api(`/projects/space/${spaceId}`)
}


export function apiGetProjectById(projectId: number): Promise<Project>{
    const {$api} = useNuxtApp()
    return $api(`/projects/${projectId}`)
}

export const updateProjectSchema = z.object({
    name: z.string().min(1, "Name is required"),
})

export type UpdateProjectDto = z.output<typeof updateProjectSchema>
export function apiUpdateProject(body: UpdateProjectDto, projectId: number): Promise<Project>{
    const {$api} = useNuxtApp()
    return $api(`/projects/${projectId}`, {
        method: 'PUT',
        body
    })
}

export function apiDeleteProject(projectId: number): Promise<void> {
    const {$api} = useNuxtApp()
    return $api(`/projects/${projectId}`, {
        method: 'DELETE'
    })
}