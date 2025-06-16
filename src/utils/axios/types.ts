export interface IDefaultRequestState {
    loading: boolean;
    error: boolean;
    message: string;
    status: number;
}

export interface IDefaultResponse<T> {
    api_status: string;
    data?: T;
    message: string;
    status: number;
}
