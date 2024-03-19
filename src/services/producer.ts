import { AxiosResponse } from 'axios';
import { getAxios, postAxios } from '../helpers/axiosHelper';

import dayjs from 'dayjs';
import { getToken } from '../helpers/secureStore';

export type ProducerType = {
    id: number;
    name: string;
    description: string;
    phone: string;
};

const token = getToken();

const createProducer = async ({
    name,
    description,
    phone,
}: ProducerType): Promise<AxiosResponse> => {
    const date = dayjs(new Date()).format('YYYY-MM-DD');
    const response: AxiosResponse = await postAxios(
        '/producer',
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

const getProducers = async (): Promise<AxiosResponse> => {
    const response: AxiosResponse = await getAxios('/producer', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

export const producerApi = {
    createProducer,
    getProducers,
};
