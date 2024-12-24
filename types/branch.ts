import type {User} from "~/types/user";
import type {SimpleBranchRequest} from "~/types/branchRequest";

export interface Branch {
    id: number;
    name: string;
    user: User;
    request: SimpleBranchRequest | null;
}