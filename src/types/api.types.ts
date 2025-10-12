export interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
    sucess: boolean;
}

export interface ApiError {
    message: string;
    code?: string;
    details?: unknown;
}
