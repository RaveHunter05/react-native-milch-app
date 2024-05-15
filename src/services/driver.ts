import { AxiosResponse } from 'axios';
import { delAxios, getAxios, postAxios } from '../helpers/axiosHelper';

import dayjs from 'dayjs';
import { getToken } from '../helpers/secureStore';

export type DriverType = {
    id: number;
    name: string;
    phone: string;
};

const token = getToken();

const createDriver = async ({
    name,
    phone,
}: DriverType): Promise<AxiosResponse> => {
    const date = dayjs(new Date()).format('YYYY-MM-DD');
    const response: AxiosResponse = await postAxios(
        '/driver',
        {
            name,
            phone,
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

const getDrivers = async (): Promise<AxiosResponse> => {
    const response: AxiosResponse = await getAxios('/driver', {
        params: {
            limit: 200,
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

const deleteDriver = async (id: number): Promise<AxiosResponse> => {
    const response: AxiosResponse = await delAxios(`/driver/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

export const driverApi = {
    createDriver,
    getDrivers,
    deleteDriver,
};
