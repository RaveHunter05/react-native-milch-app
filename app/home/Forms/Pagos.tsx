import { Text, TouchableOpacity, View } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker, TextInput } from 'react-native-rapi-ui';
import { AxiosResponse } from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { MilkCollectType, milkCollectApi } from '~/services/collected_milk';
import { useEffect, useState } from 'react';
import useTable from '~/services/hooks/useTable';
import { PaymentType, paymentApi } from '~/services/payment';
import { TransportCostType, transportCostApi } from '~/services/transportCost';
import { DeductionType, deductionApi } from '~/services/deductions';
import { MilkPriceType, milkApi } from '~/services/milk';

export default function Pagos() {
    const CollectablSchema = Yup.object().shape({
        collected_milk_id: Yup.string().required(
            'Colecta de leche es requerida',
        ),
        deduction_id: Yup.string(),
        transport_cost_id: Yup.string(),
        milk_price_id: Yup.string(),
        amount: Yup.number().required('Monto es requerido'),
    });

    const { MyTableComponent, setRefresh, refresh } = useTable<PaymentType>(
        paymentApi.getPayments,
    );

    const [collectedMilk, setCollectedMilk] = useState([]);
    const [deductions, setDeductions] = useState([]);
    const [transportCosts, setTransportCosts] = useState([]);
    const [milkPrices, setMilkPrices] = useState([]);

    const createPayment = async ({
        collected_milk_id,
        deduction_id,
        transport_cost_id,
        milk_price_id,
        amount,
    }: PaymentType) => {
        try {
            const response: AxiosResponse = await paymentApi.createPayment({
                collected_milk_id,
                deduction_id,
                transport_cost_id,
                milk_price_id,
                amount,
            });

            if (response.status === 200) {
                setRefresh(!refresh);
                showMessage({
                    message: 'Enhorabuena!',
                    description: 'Pago creado exitosamente.',
                    icon: 'success',
                    type: 'success',
                });
            }
        } catch (error) {
            showMessage({
                message: 'Error :(',
                description: 'No se pudo crear el pago.',
                icon: 'danger',
                type: 'danger',
            });
            console.log(error);
        }
    };

    useEffect(() => {
        try {
            const fetchCollectedMilk = async () => {
                const response = await milkCollectApi.getMilkCollects();
                const formatedCollectedMilk = response.data.map(
                    (collectedMilk: MilkCollectType) => {
                        return {
                            label: collectedMilk.id.toString(),
                            value: collectedMilk.id.toString(),
                        };
                    },
                );
                setCollectedMilk(formatedCollectedMilk);
            };
            const fetchDeductions = async () => {
                const response = await deductionApi.getDeductions();
                const formatedDeductions = response.data.map(
                    (deduction: DeductionType) => {
                        return {
                            label: deduction.name,
                            value: deduction.id.toString(),
                        };
                    },
                );
                setDeductions(formatedDeductions);
            };

            const fetchTransportCosts = async () => {
                const response = await transportCostApi.getTransportCosts();
                const formatedTransportCosts = response.data.map(
                    (transportCost: TransportCostType) => {
                        return {
                            label: transportCost.name,
                            value: transportCost.id.toString(),
                        };
                    },
                );
                setTransportCosts(formatedTransportCosts);
            };

            const fetchMilkPrices = async () => {
                const response = await milkApi.getMilkPrices();
                const formatedMilkPrices = response.data.map(
                    (milkPrice: MilkPriceType) => {
                        return {
                            label: milkPrice.price.toString(),
                            value: milkPrice.id.toString(),
                        };
                    },
                );
                setMilkPrices(formatedMilkPrices);
            };
            fetchCollectedMilk();
            fetchDeductions();
            fetchTransportCosts();
            fetchMilkPrices();
        } catch (error) {
            console.log(error);
        }
    }, []);
    return (
        <>
            <FlashMessage position="top" />
            <View className="p-4">
                <Text className="mb-4 font-bold">Generar pagos</Text>

                <View>
                    <Formik
                        initialValues={{
                            collected_milk_id: '0',
                            deduction_id: '0',
                            transport_cost_id: '0',
                            milk_price_id: '0',
                            amount: 0,
                        }}
                        onSubmit={createPayment}
                        validationSchema={CollectablSchema}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            touched,
                        }) => (
                            <View className="mt-5 mx-5 w-72 space-y-4">
                                <View>
                                    <Text className="text-gray-400 mb-2">
                                        Seleccione una colecta de leche
                                    </Text>
                                    <Picker
                                        className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
                                        onValueChange={handleChange(
                                            'collected_milk_id',
                                        )}
                                        onBlur={handleBlur('collected_milk_id')}
                                        items={collectedMilk}
                                        value={values.collected_milk_id}
                                    />
                                    {errors.collected_milk_id &&
                                        touched.collected_milk_id && (
                                            <Text className="text-red-500 text-xs mt-1">
                                                {errors.collected_milk_id}
                                            </Text>
                                        )}
                                </View>
                                <View>
                                    <Text className="text-gray-400 mb-2">
                                        Seleccione una deducción (de existir)
                                    </Text>
                                    <Picker
                                        className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
                                        onValueChange={handleChange(
                                            'deduction_id',
                                        )}
                                        onBlur={handleBlur('deduction_id')}
                                        items={deductions}
                                        value={values.deduction_id}
                                    />
                                    {errors.deduction_id &&
                                        touched.deduction_id && (
                                            <Text className="text-red-500 text-xs mt-1">
                                                {errors.deduction_id}
                                            </Text>
                                        )}
                                </View>

                                <View>
                                    <Text className="text-gray-400 mb-2">
                                        Seleccione un costo de transporte (de
                                        existir)
                                    </Text>
                                    <Picker
                                        className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
                                        onValueChange={handleChange(
                                            'transport_cost_id',
                                        )}
                                        onBlur={handleBlur('transport_cost_id')}
                                        items={transportCosts}
                                        value={values.transport_cost_id}
                                    />
                                    {errors.transport_cost_id &&
                                        touched.transport_cost_id && (
                                            <Text className="text-red-500 text-xs mt-1">
                                                {errors.transport_cost_id}
                                            </Text>
                                        )}
                                </View>

                                <View>
                                    <Text className="text-gray-400 mb-2">
                                        Seleccione un precio de leche
                                    </Text>
                                    <Picker
                                        className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
                                        onValueChange={handleChange(
                                            'milk_price_id',
                                        )}
                                        onBlur={handleBlur('milk_price_id')}
                                        items={milkPrices}
                                        value={values.milk_price_id}
                                    />
                                    {errors.milk_price_id &&
                                        touched.milk_price_id && (
                                            <Text className="text-red-500 text-xs mt-1">
                                                {errors.milk_price_id}
                                            </Text>
                                        )}
                                </View>
                                <View>
                                    <Text className="text-gray-400 mb-2">
                                        Monto
                                    </Text>
                                    <TextInput
                                        placeholder="Ingrese monto a pagar"
                                        className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
                                        onChangeText={handleChange('amount')}
                                        onBlur={handleBlur('amount')}
                                        value={values.amount}
                                    />
                                    {errors.amount && touched.amount && (
                                        <Text className="text-red-500 text-xs mt-1">
                                            {errors.amount}
                                        </Text>
                                    )}
                                </View>

                                <TouchableOpacity
                                    className="bg-orange-300 p-3 mt-4"
                                    onPress={handleSubmit}
                                >
                                    <Text className="text-center text-base text-white">
                                        Guardar pago
                                    </Text>
                                </TouchableOpacity>

                                <Text className="mb-4 mt-4 font-bold">
                                    Lista de Pagos:
                                </Text>

                                <MyTableComponent />
                            </View>
                        )}
                    </Formik>
                </View>
            </View>
        </>
    );
}
