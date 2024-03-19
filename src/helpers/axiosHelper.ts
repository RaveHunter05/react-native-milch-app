import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const baseURL = 'https://qhfow44n2dfbvzbktcjffey4ri0ggncr.lambda-url.us-east-1.on.aws'; // Replace this with your API base URL

const axiosInstance: AxiosInstance = axios.create({
    baseURL,
    timeout: 10000, // Timeout after 10 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interface for API response
interface ApiResponse<T> {
    data: T;
}

// Helper function for handling errors
const errorHandler = (error: any) => {
    // Handle error based on your requirements
    console.error('API Error:', error);
    throw error;
};

// Helper function for making GET requests
export const getAxios = async <T>(
    url: string,
    params?: AxiosRequestConfig,
): Promise<ApiResponse<T> | T> => {
    try {
        const response: ApiResponse<T> = await axiosInstance.get(url, params);
        return response;
    } catch (error) {
        errorHandler(error);
        return {} as T;
    }
};

// Helper function for making POST requests
export const postAxios = async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
): Promise<ApiResponse<T> | T> => {
    try {
        const response: ApiResponse<T> = await axiosInstance.post(
            url,
            data,
            config,
        );
        return response;
    } catch (error) {
        errorHandler(error);
        return {} as T; // Placeholder return value for TypeScript
    }
};

// Helper function for making PUT requests
export const putAxios = async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
): Promise<T> => {
    try {
        const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.put(
            url,
            data,
            config,
        );
        return response.data.data;
    } catch (error) {
        errorHandler(error);
        return {} as T; // Placeholder return value for TypeScript
    }
};

// Helper function for making DELETE requests
export const delAxios = async <T>(
    url: string,
    config?: AxiosRequestConfig,
): Promise<T> => {
    try {
        const response: AxiosResponse<ApiResponse<T>> =
            await axiosInstance.delete(url, config);
        return response.data.data;
    } catch (error) {
        errorHandler(error);
        return {} as T; // Placeholder return value for TypeScript
    }
};
