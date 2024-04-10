import { AxiosResponse } from 'axios';
import { getAxios, postAxios } from '../helpers/axiosHelper';

import dayjs from 'dayjs';
import { getToken } from '../helpers/secureStore';

export type PaymentType = {
    collected_milk_id: string;
    deduction_id?: string;
    transport_cost_id?: string;
    total_amount: number;
};

export type MilkReportType = {
    producer_id: string;
    producer_name: string;
    total_collected: number;
    total_payment: number;
    date: string;
};

const token = getToken();

const createPayment = async ({
    collected_milk_id,
    deduction_id,
    transport_cost_id,
    total_amount,
}: PaymentType): Promise<AxiosResponse> => {
    const date = dayjs(new Date()).format('YYYY-MM-DD');
    const response: AxiosResponse = await postAxios(
        '/payment',
        {
            collected_milk_id,
            deduction_id,
            transport_cost_id,
            total_amount,
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

const getPayments = async (): Promise<AxiosResponse> => {
    const response: AxiosResponse = await getAxios('/payment', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

const getLastPaymentsReport = async (): Promise<AxiosResponse> => {
    const response: AxiosResponse = await getAxios(
        '/reports/last-payments-report',
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return response;
};

export const paymentApi = {
    createPayment,
    getPayments,
    getLastPaymentsReport,
};
