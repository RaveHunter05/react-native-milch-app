import { AxiosResponse } from 'axios';
import { getAxios, postAxios } from '../helpers/axiosHelper';

import dayjs from 'dayjs';
import { getToken } from '../helpers/secureStore';

export type MilkSelledType = {
    quantity: number;
    price: number;
    cheese_maker_id: string;
    date: string;
};

const token = getToken();

const createMilkSell = async ({
    quantity,
    price,
    cheese_maker_id,
    date,
}: MilkSelledType): Promise<AxiosResponse> => {
    const response: AxiosResponse = await postAxios(
        '/milk_selled',
        {
            quantity,
            price,
            cheese_maker_id,
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

const getMilkSells = async (): Promise<AxiosResponse> => {
    const response: AxiosResponse = await getAxios('/milk_selled', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

export const milkSellApi = {
    createMilkSell,
    getMilkSells,
};
