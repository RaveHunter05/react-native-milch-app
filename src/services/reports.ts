import { AxiosResponse } from 'axios';
import { getAxios, postAxios } from '../helpers/axiosHelper';

import dayjs from 'dayjs';
import { getToken } from '../helpers/secureStore';

const token = getToken();

const getCollectedReportByDate = async (
    startDate: Date,
    endDate: Date,
): Promise<AxiosResponse> => {
    const formatedStartDate = dayjs(startDate).format('YYYY-MM-DD');
    const formatedEndDate = dayjs(endDate).format('YYYY-MM-DD');
    const response: AxiosResponse = await getAxios(
        `/reports/collected-milk-report-by-date?start_date=${formatedStartDate}&end_date=${formatedEndDate}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return response;
};

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

const getSelledMilkReportByDate = async (
    startDate: Date,
    endDate: Date,
): Promise<AxiosResponse> => {
    const formatedStartDate = dayjs(startDate).format('YYYY-MM-DD');
    const formatedEndDate = dayjs(endDate).format('YYYY-MM-DD');
    const response: AxiosResponse = await getAxios(
        `/reports/selled-milk-report-by-date?start_date=${formatedStartDate}&end_date=${formatedEndDate}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return response;
};

const getSelledVSCollectedMilkReportByDate = async (
    startDate: Date,
    endDate: Date,
): Promise<AxiosResponse> => {
    const formatedStartDate = dayjs(startDate).format('YYYY-MM-DD');
    const formatedEndDate = dayjs(endDate).format('YYYY-MM-DD');
    const response: AxiosResponse = await getAxios(
        `/reports/selled-vs-collected-milk-report-by-date?start_date=${formatedStartDate}&end_date=${formatedEndDate}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return response;
};

const getCollectedMilkReportByRouteAndDate = async (
    startDate: Date,
    endDate: Date,
): Promise<AxiosResponse> => {
    const formatedStartDate = dayjs(startDate).format('YYYY-MM-DD');
    const formatedEndDate = dayjs(endDate).format('YYYY-MM-DD');
    const response: AxiosResponse = await getAxios(
        `/reports/collected-milk-report-by-date-and-route?start_date=${formatedStartDate}&end_date=${formatedEndDate}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return response;
};

const getMilkSellsReportByCheeseMakerAndDate = async (
    startDate: Date,
    endDate: Date,
): Promise<AxiosResponse> => {
    const formatedStartDate = dayjs(startDate).format('YYYY-MM-DD');
    const formatedEndDate = dayjs(endDate).format('YYYY-MM-DD');
    const response: AxiosResponse = await getAxios(
        `/reports/milk-sells-report-by-cheese-maker-and-date?start_date=${formatedStartDate}&end_date=${formatedEndDate}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return response;
};

const getPaymentReportByProducerAndDate = async (
	startDate: Date,
	endDate: Date,
): Promise<AxiosResponse> => {
	const formatedStartDate = dayjs(startDate).format('YYYY-MM-DD');
	const formatedEndDate = dayjs(endDate).format('YYYY-MM-DD');
	const response: AxiosResponse = await getAxios(
		`/reports/payment-report-by-producer-and-date?start_date=${formatedStartDate}&end_date=${formatedEndDate}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		},
	);
	return response;
}

export const reportsApi = {
    getCollectedReportByDate,
    getCollectedReportByProducerAndDate,
    getCollectedReportByRouteAndDate,
    getCollectedReportByRouteDriverAndDate,
    getSelledMilkReportByDate,
    getSelledVSCollectedMilkReportByDate,
    getCollectedMilkReportByRouteAndDate,
    getMilkSellsReportByCheeseMakerAndDate,
    getPaymentReportByProducerAndDate
};
