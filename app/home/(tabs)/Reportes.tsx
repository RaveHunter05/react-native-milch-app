import { Text, View, Modal, Pressable, ScrollView } from 'react-native';

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
import multipleItemsPrintToFile from '~/utils/multipleItemsPDF';

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

            const title = 'Resumen de acopio de leche por productor';
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

            const title = 'Resumen de leche acopiada por fecha';
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

            const title = 'Resumen de acopio de leche por ruta';
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

            const title = 'Resumen de leche vendida por fecha';
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

            const title = 'Resumen de comparativos de venta y acopio de leche';
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
                'Diferencia (C$)',
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
                response.data.reduce(
                    (acc, curr) =>
                        acc +
                        Number(curr.total_price_selled) -
                        Number(curr.total_price_collected),
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

    const handlePaymentByProducer = async () => {
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
                await reportsApi.getPaymentReportByProducerAndDate(
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

            const title = 'Reporte de pagos por fecha';
            const tableHeaders = [
                'Fecha',
                'Día de semana',
                'Productor',
                'Total pago (C$)',
                'Leche colectada (galones)',
                'Leche vendida (C$)',
                'Total deducción',
            ];
            const tableBody = [];

            for (const producer of response.data) {
                const formatedElements = [];
                for (const value of producer) {
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
                    formatedElements.push(Array.from(Object.values(value)));
                }
                let total = producer.reduce(
                    (acc, curr) => acc + Number(curr.total_payment),
                    0,
                );
                formatedElements.push(total);
                tableBody.push(formatedElements);
            }

            const totalTitle = 'Total de pagos (C$)';

            const dates = { initialDate, finalDate };

            multipleItemsPrintToFile({
                title,
                tableHeaders,
                tableBody,
                dates,
                totalTitle,
            });

            console.log({ tableHeaders, tableBody });
        } catch (error) {
            console.error(error);
        }
    };

    const handleCollectedMilkReportByRouteAndDate = async () => {
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
                await reportsApi.getCollectedMilkReportByRouteAndDate(
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

            const title = 'Reporte de pagos por fecha';
            const tableHeaders = [
                'Fecha',
                'Día de semana',
                'Nombre de ruta',
                'Leche colectada (galones)',
                'Leche comprada (C$)',
            ];
            const tableBody = [];

            for (const route of response.data) {
                const formatedElements = [];
                for (const value of route) {
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
                    formatedElements.push(Array.from(Object.values(value)));
                }
                let total = route.reduce(
                    (acc, curr) => acc + Number(curr.total_price_collected),
                    0,
                );
                formatedElements.push(total);
                tableBody.push(formatedElements);
            }

            const totalTitle = 'Total de pagos (C$)';

            const dates = { initialDate, finalDate };

            multipleItemsPrintToFile({
                title,
                tableHeaders,
                tableBody,
                dates,
                totalTitle,
            });

            console.log({ tableHeaders, tableBody });
        } catch (error) {
            console.error(error);
        }
    };

    const handleMilkSellsReportByCheeseMakerAndDate = async () => {
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
                await reportsApi.getMilkSellsReportByCheeseMakerAndDate(
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

            const title = 'Reporte de ventas por quesero';
            const tableHeaders = [
                'Fecha',
                'Día de semana',
                'Nombre de quesero',
                'Leche vendida (galones)',
                'Leche vendida (C$)',
            ];
            const tableBody = [];

            for (const cheeseMaker of response.data) {
                const formatedElements = [];
                for (const value of cheeseMaker) {
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
                    formatedElements.push(Array.from(Object.values(value)));
                }
                let total = cheeseMaker.reduce(
                    (acc, curr) => acc + Number(curr.total_price_selled),
                    0,
                );
                formatedElements.push(total);
                tableBody.push(formatedElements);
            }

            const totalTitle = 'Total de leche vendida (C$)';

            const dates = { initialDate, finalDate };

            multipleItemsPrintToFile({
                title,
                tableHeaders,
                tableBody,
                dates,
                totalTitle,
            });

            console.log({ tableHeaders, tableBody });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <FlashMessage position="top" />
            <ScrollView className="bg-sky-300">
                <ScrollView className="p-4 space-y-4">
                    <Text className="mb-4 font-bold text-lg">
                        Seleccione fecha inicial y fecha final para generar el
                        reporte
                    </Text>

                    <View>
                        <Text className="mb-2 text-base">Fecha inicial</Text>

                        <Pressable onPress={switchModalVisibilityInitialDate}>
                            <TextInput
                                value={formatDateString(initialDate.toString())}
                                editable={false}
                            />
                        </Pressable>

                        <InitialDatePickerComponent />
                    </View>
                    <View>
                        <Text className="mb-2 text-base">Fecha Final</Text>

                        <Pressable onPress={switchModalVisibilityFinalDate}>
                            <TextInput
                                value={formatDateString(finalDate.toString())}
                                editable={false}
                            />
                        </Pressable>

                        <FinalDatePickerComponent />
                    </View>

                    <ScrollView>
                        <Text className="mb-4 font-bold text-lg mt-8">
                            Seleccione una opción para generar el reportes:
                        </Text>
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
                            <MyReport>
                                Resumen de acopio de leche por productor
                            </MyReport>
                        </Pressable>
                        <Pressable onPress={handleSelledMilkReportByDate}>
                            <MyReport>
                                Resumen de leche vendida por fecha
                            </MyReport>
                        </Pressable>
                        <Pressable onPress={handleCollectedMilkReportByDay}>
                            <MyReport>
                                Resumen de leche acopiada por fecha
                            </MyReport>
                        </Pressable>
                        <Pressable
                            onPress={handleSelledVSCollectedMilkReportByDate}
                        >
                            <MyReport>
                                Resumen de comparativos de venta y acopio de
                                leche
                            </MyReport>
                        </Pressable>
                        <Pressable onPress={handlePaymentByProducer}>
                            <MyReport>Reporte de pagos por productor</MyReport>
                        </Pressable>
                        <Pressable
                            onPress={handleCollectedMilkReportByRouteAndDate}
                        >
                            <MyReport>Reporte de recolectado por ruta</MyReport>
                        </Pressable>
                        <Pressable
                            onPress={handleMilkSellsReportByCheeseMakerAndDate}
                        >
                            <MyReport>Reporte de ventas por quesero</MyReport>
                        </Pressable>
                    </ScrollView>
                </ScrollView>
            </ScrollView>
        </>
    );
}
