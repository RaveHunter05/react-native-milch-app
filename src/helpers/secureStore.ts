import * as SecureStore from 'expo-secure-store';

export const saveToken =(token: string) => {
    SecureStore.setItemAsync('token', token);
};

export const getToken = () => {
    return SecureStore.getItemAsync('token');
};

export const deleteToken = () => {
    SecureStore.deleteItemAsync('token');
};
