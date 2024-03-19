import { AxiosResponse } from 'axios';
import { getAxios, postAxios } from '../helpers/axiosHelper';

import dayjs from 'dayjs';
import { getToken } from '../helpers/secureStore';

export type MilkCollectType = {
    driver_id: string;
    route_id: string;
    producer_id: string;
    quantity: number;
    type: string;
    id: string;
};

const token = getToken();

const createMilkCollect = async ({
    driver_id,
    route_id,
    producer_id,
    quantity,
    type,
}: MilkCollectType): Promise<AxiosResponse> => {
    const date = dayjs(new Date()).format('YYYY-MM-DD');
    const response: AxiosResponse = await postAxios(
        '/collected_milk',
        {
            driver_id,
            route_id,
            producer_id,
            quantity,
            type,
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
