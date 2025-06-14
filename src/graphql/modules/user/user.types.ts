export type FilterUserArgs = {
    input: {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: keyof User;
        sortOrder?: 'asc' | 'desc';
    }
}

export interface User {
    id: number;
    email: string;
    is_active: boolean;
    role: string;
}
export interface UsersResponse {
    total: number;
    page: number;
    limit: number;
    data: User[],
}
