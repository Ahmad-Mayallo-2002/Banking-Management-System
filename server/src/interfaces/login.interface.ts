import { Roles } from "../enums/roles.enum";

export interface Login {
    id: string;
    role: Roles;
    token: string;
}