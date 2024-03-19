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
            printToFile(title, tableHeaders, tableBody);

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

            printToFile(title, tableHeaders, tableBody);

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

            printToFile(title, tableHeaders, tableBody);

            console.log({ tableHeaders, tableBody });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <FlashMessage position="top" />
            <View className="p-4 space-y-4">
                <Text className="font-bold">
                    Seleccione fecha inicial y fecha final para generar el
                    reporte
                </Text>

                <View>
                    <Text className="mb-2 text-gray-500">Fecha inicial</Text>

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
                    {/* todo */}
                    <MyReport>Plantilla de pago de productores</MyReport>
                    {/* payment report by producer and date */}
                    {/* @todo total transporte, total ingresos, total deducciones, calcular */}
                    <MyReport>Collila de pago de productores</MyReport>
                    {/* collected milk by route and date */}
                    <Pressable
                        onPress={handleCollectedReportByRouteDriverAndDate}
                    >
                        <MyReport>
                            Acopio de leche por ruta y conductor{' '}
                        </MyReport>
                    </Pressable>
                    {/* collected milk by route, driver and date */}
                    <Pressable onPress={handleCollectedMilkByRouteAndDate}>
                        <MyReport>Resumen de acopio de leche por ruta</MyReport>
                    </Pressable>
                    {/* collected milk by producer and date */}
                    <Pressable onPress={handleCollectedMilkByProducerAndDate}>
                        <MyReport>Acopio de leche por productor</MyReport>
                    </Pressable>
                </View>
            </View>
        </>
    );
}
