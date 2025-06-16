import { IDefaultRequestState } from "./types";



export const DEFAULT_REQUEST_STATE: IDefaultRequestState = {
    loading: false,
    error: false,
    message: '',
    status: 0,
};

export const DEFAULT_REQUEST_LOADING = {
    loading: true,
    error: false,
    message: '',
    status: 0,
};

export const DEFAULT_REQUEST_ERROR = {
    loading: false,
    error: true,
    message: '',
    status: 0,
};