import { AxiosResponse } from 'axios';
import { getAxios, postAxios } from '../helpers/axiosHelper';

import dayjs from 'dayjs';
import { getToken } from '../helpers/secureStore';

export type CheeseMakerType = {
    name: string;
    description: string;
    phone: string;
    id: number;
};

const token = getToken();

const createCheeseMaker = async ({
    name,
    description,
    phone
}: CheeseMakerType): Promise<AxiosResponse> => {
    const date = dayjs(new Date()).format('YYYY-MM-DD');
    const response: AxiosResponse = await postAxios(
        '/cheese_maker',
        {
            name,
            description,
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

const getCheeseMakers = async (): Promise<AxiosResponse> => {
    const response: AxiosResponse = await getAxios('/cheese_maker', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

export const cheeseMakersApi = {
    createCheeseMaker,
    getCheeseMakers
};
