export interface SuccessResponse<TData> {
    code: string;
    message: string;
    data?: TData;
}

// export function success<TData>(
//     message: string,
//     data?: TData,
//     code: string = 'OK'
// ): SuccessResponse<TData> {
//     return {
//         code,
//         message,
//         ...(data !== undefined && { data }),
//     };
// }
