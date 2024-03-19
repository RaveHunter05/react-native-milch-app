import { AxiosResponse } from 'axios';
import { getAxios, postAxios } from '../helpers/axiosHelper';

import dayjs from 'dayjs';
import { getToken } from '../helpers/secureStore';

export type TransportCostType = {
    name: string;
    description: string;
    cost: number;
    id: string;
};

const token = getToken();

const createTransportCost = async ({
    name,
    description,
    cost,
}: TransportCostType): Promise<AxiosResponse> => {
    const date = dayjs(new Date()).format('YYYY-MM-DD');
    const response: AxiosResponse = await postAxios(
        '/transport_cost',
        {
            name,
            description,
            cost,
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

const getTransportCosts = async (): Promise<AxiosResponse> => {
    const response: AxiosResponse = await getAxios('/transport_cost', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

export const transportCostApi = {
    createTransportCost,
    getTransportCosts,
};
