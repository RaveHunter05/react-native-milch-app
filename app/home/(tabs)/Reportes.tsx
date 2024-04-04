import { Text, View, Modal, Pressable } from 'react-native';

import { useState } from 'react';
import MyReport from '~/components/shared/MyReport';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import useDateTimePicker from '~/services/hooks/useDateTimePicker';
import { TextInput } from 'react-native-rapi-ui';
import formatDateString from '~/utils/formatDateString';
import { AxiosResponse } from 'axios';
import { reportsApi } from '~/services/reports';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import printToFile from '~/utils/toPDF';
import dayjs from 'dayjs';

export default function Reportes() {
    const {
        DatePickerComponent: InitialDatePickerComponent,
        switchModalVisibility: switchModalVisibilityInitialDate,
        date: initialDate,
    } = useDateTimePicker({
        mode: 'date',
        title: 'Seleccione fecha inicial',
    });

    const {
        DatePickerComponent: FinalDatePickerComponent,
        switchModalVisibility: switchModalVisibilityFinalDate,
        date: finalDate,
    } = useDateTimePicker({
        mode: 'date',
        title: 'Seleccione fecha final',
    });

    const handleCollectedMilkByProducerAndDate = async () => {
        if (initialDate > finalDate) {
            showMessage({
                message: 'Error',
                description:
                    'La fecha inicial no puede ser mayor a la fecha final',
                type: 'danger',
            });
            return;
        }

        try {
            const response: AxiosResponse =
                await reportsApi.getCollectedReportByProducerAndDate(
                    initialDate,
                    finalDate,
                );
            if (!response.data.length) {
                showMessage({
                    message: 'Error',
                    description: 'No hay datos para mostrar',
                    type: 'danger',
                });
                return;
            }

            const title = 'Acopio de leche por productor';
            const tableHeaders = [
                'ID',
                'Productor',
                'Total Colectado(Galones)',
            ];
            const tableBody = [];

            for (const value of response.data) {
                tableBody.push(Array.from(Object.values(value)));
            }

            const dates = { initialDate, finalDate };

            printToFile({ title, tableHeaders, tableBody, dates });

            console.log({ tableHeaders, tableBody });
        } catch (error) {
            console.error(error);
        }
    };

    const handleCollectedMilkReportByDay = async () => {
        if (initialDate > finalDate) {
            showMessage({
                message: 'Error',
                description:
                    'La fecha inicial no puede ser mayor a la fecha final',
                type: 'danger',
            });
            return;
        }

        try {
            const response: AxiosResponse =
                await reportsApi.getCollectedReportByDate(
                    initialDate,
                    finalDate,
                );
            if (!response.data.length) {
                showMessage({
                    message: 'Error',
                    description: 'No hay datos para mostrar',
                    type: 'danger',
                });
                return;
            }

            const title = 'Acopio de leche por día';
            const tableHeaders = [
                'Fecha',
                'Día',
                'Precio de leche (promedio en c$)',
                'Leche colectada (galones)',
                'Precio total (C$)',
            ];
            const tableBody = [];

            const totalTitles = ['Total de leche comprada (C$)'];

            const dates = { initialDate, finalDate };

            const totalValues = [
                response.data.reduce(
                    (acc, curr) => acc + Number(curr.total_price),
                    0,
                ),
            ];

            const totals = totalTitles.map((title, index) => ({
                title,
                value: totalValues[index],
            }));

            for (const value of response.data) {
                value.date = dayjs(value.date).format('DD/MM/YYYY');
                switch (value.day_of_week) {
                    case 'Monday':
                        value.day_of_week = 'Lunes';
                        break;
                    case 'Tuesday':
                        value.day_of_week = 'Martes';
                        break;
                    case 'Wednesday':
                        value.day_of_week = 'Miércoles';
                        break;
                    case 'Thursday':
                        value.day_of_week = 'Jueves';
                        break;
                    case 'Friday':
                        value.day_of_week = 'Viernes';
                        break;
                    case 'Saturday':
                        value.day_of_week = 'Sábado';
                        break;
                    case 'Sunday':
                        value.day_of_week = 'Domingo';
                        break;
                    default:
                        break;
                }

                tableBody.push(Array.from(Object.values(value)));
            }

            printToFile({ title, tableHeaders, tableBody, dates, totals });

            console.log({ tableHeaders, tableBody });
        } catch (error) {
            console.error(error);
        }
    };

    const handleCollectedMilkByRouteAndDate = async () => {
        if (initialDate > finalDate) {
            showMessage({
                message: 'Error',
                description:
                    'La fecha inicial no puede ser mayor a la fecha final',
                type: 'danger',
            });
            return;
        }

        try {
            const response: AxiosResponse =
                await reportsApi.getCollectedReportByRouteAndDate(
                    initialDate,
                    finalDate,
                );
            if (!response.data.length) {
                showMessage({
                    message: 'Error',
                    description: 'No hay datos para mostrar',
                    type: 'danger',
                });
                return;
            }

            const title = 'Acopio de leche por ruta';
            const tableHeaders = [
                'ID',
                'Nombre de Ruta',
                'Total Colectado(Galones)',
            ];
            const tableBody = [];

            for (const value of response.data) {
                tableBody.push(Array.from(Object.values(value)));
            }

            const dates = { initialDate, finalDate };

            printToFile({ title, tableHeaders, tableBody, dates });

            console.log({ tableHeaders, tableBody });
        } catch (error) {
            console.error(error);
        }
    };

    const handleCollectedReportByRouteDriverAndDate = async () => {
        if (initialDate > finalDate) {
            showMessage({
                message: 'Error',
                description:
                    'La fecha inicial no puede ser mayor a la fecha final',
                type: 'danger',
            });
            return;
        }

        try {
            const response: AxiosResponse =
                await reportsApi.getCollectedReportByRouteDriverAndDate(
                    initialDate,
                    finalDate,
                );
            if (!response.data.length) {
                showMessage({
                    message: 'Error',
                    description: 'No hay datos para mostrar',
                    type: 'danger',
                });
                return;
            }

            const title = 'Acopio de leche por ruta y conductor';
            const tableHeaders = [
                'ID',
                'Nombre de Ruta',
                'Nombre del conductor',
                'Total Colectado(Galones)',
            ];
            const tableBody = [];

            for (const value of response.data) {
                tableBody.push(Array.from(Object.values(value)));
            }

            const dates = { initialDate, finalDate };

            printToFile({ title, tableHeaders, tableBody, dates });

            console.log({ tableHeaders, tableBody });
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelledMilkReportByDate = async () => {
        if (initialDate > finalDate) {
            showMessage({
                message: 'Error',
                description:
                    'La fecha inicial no puede ser mayor a la fecha final',
                type: 'danger',
            });
            return;
        }

        try {
            const response: AxiosResponse =
                await reportsApi.getSelledMilkReportByDate(
                    initialDate,
                    finalDate,
                );
            if (!response.data.length) {
                showMessage({
                    message: 'Error',
                    description: 'No hay datos para mostrar',
                    type: 'danger',
                });
                return;
            }

            const title = 'Reporte de leche vendida por fecha';
            const tableHeaders = [
                'Fecha',
                'Día',
                'Precio leche',
                'Leche vendida (cantidad en galones)',
                'Precio total (C$)',
            ];
            const tableBody = [];

            const totalTitles = ['Total de leche vendida (C$)'];

            const totalValues = [
                response.data.reduce(
                    (acc, curr) => acc + Number(curr.total_price),
                    0,
                ),
            ];

            const totals = totalTitles.map((title, index) => ({
                title,
                value: totalValues[index],
            }));

            for (const value of response.data) {
                value.date = dayjs(value.date).format('DD/MM/YYYY');
                switch (value.day_of_week) {
                    case 'Monday':
                        value.day_of_week = 'Lunes';
                        break;
                    case 'Tuesday':
                        value.day_of_week = 'Martes';
                        break;
                    case 'Wednesday':
                        value.day_of_week = 'Miércoles';
                        break;
                    case 'Thursday':
                        value.day_of_week = 'Jueves';
                        break;
                    case 'Friday':
                        value.day_of_week = 'Viernes';
                        break;
                    case 'Saturday':
                        value.day_of_week = 'Sábado';
                        break;
                    case 'Sunday':
                        value.day_of_week = 'Domingo';
                        break;
                    default:
                        break;
                }
                tableBody.push(Array.from(Object.values(value)));
            }

            const dates = { initialDate, finalDate };

            printToFile({ title, tableHeaders, tableBody, totals, dates });

            console.log({ tableHeaders, tableBody });
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelledVSCollectedMilkReportByDate = async () => {
        if (initialDate > finalDate) {
            showMessage({
                message: 'Error',
                description:
                    'La fecha inicial no puede ser mayor a la fecha final',
                type: 'danger',
            });
            return;
        }

        try {
            const response: AxiosResponse =
                await reportsApi.getSelledVSCollectedMilkReportByDate(
                    initialDate,
                    finalDate,
                );
            if (!response.data.length) {
                showMessage({
                    message: 'Error',
                    description: 'No hay datos para mostrar',
                    type: 'danger',
                });
                return;
            }

            const title = 'Comparativos de venta y acopio de leche';
            const tableHeaders = [
                'Fecha',
                'Día de semana',
                'Leche colectada(galones)',
                'Precio colectado total(C$)',
                'Precio de compra leche (promedio en C$)',
                'Leche vendida(galones)',
                'Precio de leche vendida total (C$)',
                'Precio de venta de leche (promedio en c$)',
            ];
            const tableBody = [];

            const totalTitles = [
                'Total de leche comprada (C$)',
                'Total de leche vendida (C$)',
            ];

            const totalValues = [
                response.data.reduce(
                    (acc, curr) => acc + Number(curr.total_price_collected),
                    0,
                ),
                response.data.reduce(
                    (acc, curr) => acc + Number(curr.total_price_selled),
                    0,
                ),
            ];

            const totals = totalTitles.map((title, index) => ({
                title,
                value: totalValues[index],
            }));

            for (const value of response.data) {
                value.date = dayjs(value.date).format('DD/MM/YYYY');
                switch (value.day_of_week) {
                    case 'Monday':
                        value.day_of_week = 'Lunes';
                        break;
                    case 'Tuesday':
                        value.day_of_week = 'Martes';
                        break;
                    case 'Wednesday':
                        value.day_of_week = 'Miércoles';
                        break;
                    case 'Thursday':
                        value.day_of_week = 'Jueves';
                        break;
                    case 'Friday':
                        value.day_of_week = 'Viernes';
                        break;
                    case 'Saturday':
                        value.day_of_week = 'Sábado';
                        break;
                    case 'Sunday':
                        value.day_of_week = 'Domingo';
                        break;
                    default:
                        break;
                }
                tableBody.push(Array.from(Object.values(value)));
            }

            const dates = { initialDate, finalDate };

            printToFile({ title, tableHeaders, tableBody, totals, dates });

            console.log({ tableHeaders, tableBody });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <View>
                <FlashMessage position="top" />
                <View className="p-4 space-y-4">
                    <Text className="font-bold">
                        Seleccione fecha inicial y fecha final para generar el
                        reporte
                    </Text>

                    <View>
                        <Text className="mb-2 text-gray-500">
                            Fecha inicial
                        </Text>

                        <Pressable onPress={switchModalVisibilityInitialDate}>
                            <TextInput
                                value={formatDateString(initialDate.toString())}
                                editable={false}
                            />
                        </Pressable>

                        <InitialDatePickerComponent />
                    </View>
                    <View>
                        <Text className="mb-2 text-gray-500">Fecha Final</Text>

                        <Pressable onPress={switchModalVisibilityFinalDate}>
                            <TextInput
                                value={formatDateString(finalDate.toString())}
                                editable={false}
                            />
                        </Pressable>

                        <FinalDatePickerComponent />
                    </View>
                    <Text className="font-bold">
                        Seleccione una opción para generar el reporte:
                    </Text>

                    <View>
                        <Pressable
                            onPress={handleCollectedReportByRouteDriverAndDate}
                        >
                            <MyReport>
                                Acopio de leche por ruta y conductor{' '}
                            </MyReport>
                        </Pressable>
                        {/* collected milk by route, driver and date */}
                        <Pressable onPress={handleCollectedMilkByRouteAndDate}>
                            <MyReport>
                                Resumen de acopio de leche por ruta
                            </MyReport>
                        </Pressable>
                        {/* collected milk by producer and date */}
                        <Pressable
                            onPress={handleCollectedMilkByProducerAndDate}
                        >
                            <MyReport>Acopio de leche por productor</MyReport>
                        </Pressable>
                        <Pressable onPress={handleSelledMilkReportByDate}>
                            <MyReport>
                                Reporte de leche vendida por fecha
                            </MyReport>
                        </Pressable>
                        <Pressable onPress={handleCollectedMilkReportByDay}>
                            <MyReport>
                                Reporte de leche acopiada por fecha
                            </MyReport>
                        </Pressable>
                        <Pressable
                            onPress={handleSelledVSCollectedMilkReportByDate}
                        >
                            <MyReport>
                                Comparativos de venta y acopio de leche
                            </MyReport>
                        </Pressable>
                    </View>
                </View>
            </View>
        </>
    );
}
