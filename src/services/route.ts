import { AxiosResponse } from 'axios';
import { getAxios, postAxios } from '../helpers/axiosHelper';

import dayjs from 'dayjs';
import { getToken } from '../helpers/secureStore';

export type MilkRouteType = {
    id: number;
    name: string;
    description: string;
};

const token = getToken();

const createRoute = async ({
    name,
    description,
}: MilkRouteType): Promise<AxiosResponse> => {
    const date = dayjs(new Date()).format('YYYY-MM-DD');
    const response: AxiosResponse = await postAxios(
        '/route',
        {
            name,
            description,
            date,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return response;
};

const getRoutes = async (): Promise<AxiosResponse> => {
    const response: AxiosResponse = await getAxios('/route', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

export const milkRouteApi = {
    createRoute,
    getRoutes,
};
