import { AxiosResponse } from 'axios';
import { getAxios, postAxios } from '../helpers/axiosHelper';

import dayjs from 'dayjs';
import { getToken } from '../helpers/secureStore';

export type MilkPriceType = {
    name: string;
    price: number;
    id: string;
};

const token = getToken();

const createMilkPrice = async ({
    name,
    price,
}: MilkPriceType): Promise<AxiosResponse> => {
    const date = dayjs(new Date()).format('YYYY-MM-DD');
    const response: AxiosResponse = await postAxios(
        '/milk_price',
        {
            name,
            price,
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

const getMilkPrices = async (): Promise<AxiosResponse> => {
    const response: AxiosResponse = await getAxios('/milk_price', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

export const milkApi = {
    createMilkPrice,
    getMilkPrices
};
