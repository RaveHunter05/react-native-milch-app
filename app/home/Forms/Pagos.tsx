import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

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

export default function Pagos() {
    const CollectablSchema = Yup.object().shape({
        collected_milk_id: Yup.string().required(
            'Colecta de leche es requerida',
        ),
        deduction_id: Yup.string(),
        transport_cost_id: Yup.string(),
    });

    const { MyTableComponent, setRefresh, refresh } = useTable<PaymentType>(
        paymentApi.getPayments,
    );

    const [collectedMilk, setCollectedMilk] = useState([]);
    const [deductions, setDeductions] = useState([]);
    const [transportCosts, setTransportCosts] = useState([]);

    const [collectedMilkPrice, setCollectedMilkPrice] = useState(0);
    const [deductionPrice, setDeductionPrice] = useState(0);
    const [transportCostPrice, setTransportCostPrice] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        setTotalAmount(
            Number(collectedMilkPrice) -
                Number(deductionPrice) +
                Number(transportCostPrice),
        );
    }, [collectedMilkPrice, deductionPrice, transportCostPrice]);

    const createPayment = async ({
        collected_milk_id,
        deduction_id,
        transport_cost_id,
    }: PaymentType) => {
        try {
            console.log({
                collected_milk_id,
                deduction_id,
                transport_cost_id,
                totalAmount,
            });
            const response: AxiosResponse = await paymentApi.createPayment({
                collected_milk_id,
                deduction_id,
                transport_cost_id,
                total_amount: totalAmount,
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
                            label: collectedMilk.name,
                            value: collectedMilk.id.toString(),
                            price: collectedMilk.price * collectedMilk.quantity,
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
                            price: deduction.price,
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
                            price: transportCost.cost,
                        };
                    },
                );
                setTransportCosts(formatedTransportCosts);
            };

            fetchCollectedMilk();
            fetchDeductions();
            fetchTransportCosts();
        } catch (error) {
            console.log(error);
        }
    }, []);
    return (
        <>
            <FlashMessage position="top" />
            <ScrollView className="p-4">
                <Text className="mb-4 font-bold">Generar pagos</Text>

                <View>
                    <Formik
                        initialValues={{
                            collected_milk_id: '0',
                            deduction_id: '0',
                            transport_cost_id: '0',
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
                                        onValueChange={(val) => {
                                            let milkPrice =
                                                collectedMilk.filter(
                                                    (x) => x.value === val,
                                                )[0];
                                            setCollectedMilkPrice(
                                                milkPrice.price,
                                            );
                                            values.collected_milk_id = val;
                                        }}
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
                                    <Text className="text-gray-400 mt-1">
                                        {collectedMilkPrice}
                                    </Text>
                                </View>
                                <View>
                                    <Text className="text-gray-400 mb-2">
                                        Seleccione una deducción (de existir)
                                    </Text>
                                    <Picker
                                        className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
                                        onValueChange={(val) => {
                                            let deductionPrice =
                                                deductions.filter(
                                                    (x) => x.value === val,
                                                )[0];
                                            setDeductionPrice(
                                                deductionPrice.price,
                                            );
                                            values.deduction_id = val;
                                        }}
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
                                    <Text className="text-gray-400 mt-1">
                                        {deductionPrice}
                                    </Text>
                                </View>

                                <View>
                                    <Text className="text-gray-400 mb-2">
                                        Seleccione un costo de transporte (de
                                        existir)
                                    </Text>
                                    <Picker
                                        className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
                                        onValueChange={(val) => {
                                            let transportCostPrice =
                                                transportCosts.filter(
                                                    (x) => x.value === val,
                                                )[0];
                                            setTransportCostPrice(
                                                transportCostPrice.price,
                                            );

                                            values.transport_cost_id = val;
                                        }}
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
                                    <Text className="text-gray-400 mt-1">
                                        {transportCostPrice}
                                    </Text>
                                </View>

                                <View>
                                    <Text className="text-gray-400 mb-2">
                                        Monto (colecta - deducción + costo de
                                        transporte)
                                    </Text>
                                    <Text className="mt-1">
                                        {Number(totalAmount).toLocaleString(
                                            'es-NI',
                                            {
                                                style: 'currency',
                                                currency: 'NIO',
                                            },
                                        )}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    className="bg-orange-300 p-3 mt-4"
                                    onPress={handleSubmit}
                                >
                                    <Text className="text-center text-base text-white">
                                        Guardar pago
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                    <Text className="mt-6 font-bold">Tus últimos pagos:</Text>
                    <ScrollView className="mt-4 mb-6">
                        <MyTableComponent />
                    </ScrollView>
                </View>
            </ScrollView>
        </>
    );
}
