import { Permission } from "@/utils/Permission";

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: Permission[];
};