export type FilterUserArgs = {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: keyof User;
    sortOrder?: 'asc' | 'desc';
}

export interface User {
    id: number;
    email: String;
    is_active: Boolean;
    role: String;
}
export interface UsersResponse {
    total: number;
    page: number;
    limit: number;
    data: User[],
}
