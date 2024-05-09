import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker, TextInput } from 'react-native-rapi-ui';
import { AxiosResponse } from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { MilkCollectType, milkCollectApi } from '~/services/collected_milk';
import { useEffect, useState } from 'react';
import useTable from '~/services/hooks/useTable';
import { MilkReportType, PaymentType, paymentApi } from '~/services/payment';
import { DeductionType, deductionApi } from '~/services/deductions';
import dayjs from 'dayjs';

export default function Pagos() {
    const CollectablSchema = Yup.object().shape({
        collected_milk_id: Yup.string().required(
            'Colecta de leche es requerida',
        ),
        deduction_id: Yup.string().nullable(),
    });

    const { setRefresh, refresh } = useTable<PaymentType>(
        paymentApi.getLastPaymentsReport,
    );

    const [collectedMilk, setCollectedMilk] = useState([]);
    const [deductions, setDeductions] = useState([]);
    const [payments, setPayments] = useState<MilkReportType[]>([]);

    const [collectedMilkPrice, setCollectedMilkPrice] = useState(0);
    const [deductionPrice, setDeductionPrice] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        setTotalAmount(Number(collectedMilkPrice) - Number(deductionPrice));
    }, [collectedMilkPrice, deductionPrice]);

    const createPayment = async ({
        collected_milk_id,
        deduction_id,
    }: PaymentType) => {
        try {
            console.log({
                collected_milk_id,
                deduction_id,
                totalAmount,
            });
            if (collected_milk_id === '0') {
                showMessage({
                    message: 'Error :(',
                    description: 'No se puede crear pago sin ingresar colecta',
                    icon: 'danger',
                    type: 'danger',
                });
                return;
            }
            const response: AxiosResponse = await paymentApi.createPayment({
                collected_milk_id,
                deduction_id,
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

                Alert.alert('Enhorabuena', 'Pago creado exitosamente.');
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

            const fetchPayments = async () => {
                const response = await paymentApi.getLastPaymentsReport();
                setPayments(response.data);
            };

            fetchPayments();

            fetchCollectedMilk();
            fetchDeductions();
        } catch (error) {
            console.log(error);
        }
    }, [refresh]);
    return (
        <>
            <FlashMessage style={{ position: 'fixed', top: 0 }} />
            <ScrollView style={{ backgroundColor: '#74B7FD' }}>
                <ScrollView className="p-4">
                    <Text className="mb-4 font-bold text-lg">
                        Generar pagos
                    </Text>

                    <View>
                        <Formik
                            initialValues={{
                                collected_milk_id: '',
                                deduction_id: null,
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
                                <View className="mt-3 w-72 space-y-4">
                                    <View>
                                        <Text className="text-base mb-2">
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
                                            onBlur={handleBlur(
                                                'collected_milk_id',
                                            )}
                                            items={collectedMilk}
                                            value={values.collected_milk_id}
                                        />
                                        {errors.collected_milk_id &&
                                            touched.collected_milk_id && (
                                                <Text className="text-red-500 text-xs mt-1">
                                                    {errors.collected_milk_id}
                                                </Text>
                                            )}
                                        <Text className="text-base mt-1">
                                            {Number(
                                                collectedMilkPrice,
                                            ).toLocaleString('es-NI', {
                                                style: 'currency',
                                                currency: 'NIO',
                                            })}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className="text-base mb-2">
                                            Seleccione una deducción (de
                                            existir)
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
                                        <Text className="text-base mt-1">
                                            {Number(
                                                deductionPrice,
                                            ).toLocaleString('es-NI', {
                                                style: 'currency',
                                                currency: 'NIO',
                                            })}
                                        </Text>
                                    </View>

                                    <View>
                                        <Text className="text-base mb-2">
                                            Monto (colecta - deducción)
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
                                        className="px-5 bg-orange-300 py-2 font-medium border border-b-4 border-r-4 border-black rounded-lg shadow-lg hover:shadow-sm"
                                        onPress={handleSubmit}
                                    >
                                        <Text className="text-center text-base font-bold">
                                            Guardar pago
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>
                        <Text className="mt-8 font-bold text-lg">
                            Lista de pagos:
                        </Text>

                        <ScrollView>
                            {payments.map((payment) => (
                                <View
                                    className="border-2 flex flex-row p-3 py-5 my-3 bg-white"
                                    style={{ borderRadius: 24 }}
                                >
                                    <View className="flex mr-6">
                                        <View
                                            className="border py-3 bg-blue-300"
                                            style={{ borderRadius: 24 }}
                                        >
                                            <Image
                                                source={{
                                                    uri: 'https://services-project.s3.us-east-2.amazonaws.com/icons-milch/payment.png',
                                                }}
                                                style={{
                                                    width: 90,
                                                    height: 90,
                                                }}
                                            />
                                        </View>
                                    </View>

                                    <View className="">
                                        <Text className="text-gray-500 text-xs mt-1">
                                            {dayjs(payment.date).format(
                                                'DD/MM/YYYY',
                                            )}
                                        </Text>
                                        <Text className="text-gray-500 text-xs mt-1">
                                            Productor: {payment.producer_name}
                                        </Text>

                                        <View className="mt-4">
                                            <Text className="text-gray-500">
                                                {payment.total_collected}{' '}
                                                Galones
                                            </Text>
                                            <Text className="text-lg font-bold">
                                                {Number(
                                                    payment.total_payment,
                                                ).toLocaleString('es-NI', {
                                                    style: 'currency',
                                                    currency: 'NIO',
                                                })}{' '}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            </ScrollView>
        </>
    );
}
