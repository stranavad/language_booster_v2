import type {User} from "~/types/user";
import type {Branch} from "~/types/branch";

export interface BranchRequest {
    id: number;
    name: string;
    user: User;
    branch: Branch
}

export type SimpleBranchRequest = Pick<BranchRequest, 'id' | 'name' | 'user'>