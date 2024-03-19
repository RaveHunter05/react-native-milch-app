import { AxiosResponse } from 'axios';
import { getAxios, postAxios } from '../helpers/axiosHelper';

import dayjs from 'dayjs';
import { getToken } from '../helpers/secureStore';

const token = getToken();

const getCollectedReportByProducerAndDate = async (
    startDate: Date,
    endDate: Date,
): Promise<AxiosResponse> => {
    const formatedStartDate = dayjs(startDate).format('YYYY-MM-DD');
    const formatedEndDate = dayjs(endDate).format('YYYY-MM-DD');
    const response: AxiosResponse = await getAxios(
        `/reports/collected-report-by-producer-and-date?start_date=${formatedStartDate}&end_date=${formatedEndDate}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return response;
};

const getCollectedReportByRouteAndDate = async (
    startDate: Date,
    endDate: Date,
): Promise<AxiosResponse> => {
    const formatedStartDate = dayjs(startDate).format('YYYY-MM-DD');
    const formatedEndDate = dayjs(endDate).format('YYYY-MM-DD');
    const response: AxiosResponse = await getAxios(
        `/reports/collected-milk-by-route-and-date?start_date=${formatedStartDate}&end_date=${formatedEndDate}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return response;
};

const getCollectedReportByRouteDriverAndDate = async (
    startDate: Date,
    endDate: Date,
): Promise<AxiosResponse> => {
    const formatedStartDate = dayjs(startDate).format('YYYY-MM-DD');
    const formatedEndDate = dayjs(endDate).format('YYYY-MM-DD');
    const response: AxiosResponse = await getAxios(
        `/reports/collected-milk-by-route-driver-and-date?start_date=${formatedStartDate}&end_date=${formatedEndDate}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return response;
};

export const reportsApi = {
    getCollectedReportByProducerAndDate,
    getCollectedReportByRouteAndDate,
    getCollectedReportByRouteDriverAndDate,
};
