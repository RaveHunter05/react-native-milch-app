import { AxiosResponse } from 'axios';
import { getAxios, postAxios } from '../helpers/axiosHelper';

import dayjs from 'dayjs';
import { getToken } from '../helpers/secureStore';

export type DeductionType = {
    name: string;
    description: string;
    price: number;
    id: string;
};

const token = getToken();

const createDeduction = async ({
    name,
    description,
    price,
}: DeductionType): Promise<AxiosResponse> => {
    const date = dayjs(new Date()).format('YYYY-MM-DD');
    const response: AxiosResponse = await postAxios(
        '/deduction',
        {
            name,
            description,
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

const getDeductions = async (): Promise<AxiosResponse> => {
    const response: AxiosResponse = await getAxios('/deduction', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

export const deductionApi = {
    createDeduction,
    getDeductions,
};
