import { AxiosResponse } from 'axios';
import { postAxios } from '../helpers/axiosHelper';
import { deleteToken } from '../helpers/secureStore';

export type LoginType = {
    username: string;
    password: string;
};

export type RegisterType = {
    username: string;
    email: string;
    password: string;
};

const login = async ({
    username,
    password,
}: LoginType): Promise<AxiosResponse> => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response: AxiosResponse = await postAxios('/token', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response;
};

const register = async ({
    username,
    email,
    password,
}: RegisterType): Promise<AxiosResponse> => {
    const response: AxiosResponse = await postAxios('/signup', {
        username,
        email,
        password,
    });
    return response;
};

const logout = (): boolean => {
    deleteToken();
    return true;
};

export const authApi = {
    login,
    logout,
    register,
};
