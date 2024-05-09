import { AxiosResponse } from 'axios';
import { getAxios, postAxios } from '../helpers/axiosHelper';

import dayjs from 'dayjs';
import { getToken } from '../helpers/secureStore';

export type MilkCollectType = {
    driver_id: string;
    route_id: string;
    producer_id: string;
    price: number;
    quantity: number;
    name: string;
    date: string;
};

const token = getToken();

const createMilkCollect = async ({
    name,
    quantity,
    price,
    driver_id,
    route_id,
    producer_id,
}: MilkCollectType): Promise<AxiosResponse> => {
    const date = dayjs(new Date()).format('YYYY-MM-DD');
    const response: AxiosResponse = await postAxios(
        '/collected_milk',
        {
            name,
            quantity,
            price,
            driver_id,
            route_id,
            producer_id,
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

const getMilkCollects = async (): Promise<AxiosResponse> => {
    const response: AxiosResponse = await getAxios('/collected_milk', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

export const milkCollectApi = {
    createMilkCollect,
    getMilkCollects,
};
