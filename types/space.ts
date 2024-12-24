import type {User} from "~/types/user";
import type {Role} from "~/api/spaces";

export interface Space {
    id: number;
    name: string;
    members: any[];
    projects: any[]
}

export interface SpaceMember {
    role: Role
    user: User
}