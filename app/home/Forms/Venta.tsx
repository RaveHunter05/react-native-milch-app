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
import useTable from '~/services/hooks/useTable';
import { MilkSelledType, milkSellApi } from '~/services/milk_sell';
import { useEffect, useState } from 'react';
import { cheeseMakersApi, CheeseMakerType } from '~/services/cheese_maker';
import dayjs from 'dayjs';

export default function Venta() {
    const TransportCostSchema = Yup.object().shape({
        quantity: Yup.number().required('Cantidad de leche es requerido'),
        price: Yup.number().required('Precio de leche es requerido'),
        cheese_maker_id: Yup.string().required('Quesero es requerido'),
    });

    const { setRefresh, refresh } = useTable<MilkSelledType>(
        milkSellApi.getMilkSells,
    );

    const [cheeseMakers, setCheeseMakers] = useState([]);

    const [milkSells, setMilkSells] = useState<MilkSelledType[]>([]);

    useEffect(() => {
        const fetchMilkSells = async () => {
            const sells = await milkSellApi.getMilkSells();
            setMilkSells(sells.data);
        };

        fetchMilkSells();
    }, []);

    useEffect(() => {
        const fetchCheeseMakers = async () => {
            const response: AxiosResponse =
                await cheeseMakersApi.getCheeseMakers();
            const formatedCheeseMakers = response.data.map(
                (cheeseMaker: CheeseMakerType) => {
                    return {
                        label: cheeseMaker.name,
                        value: cheeseMaker.id.toString(),
                    };
                },
            );
            setCheeseMakers(formatedCheeseMakers);
        };

        fetchCheeseMakers();
    }, [refresh]);

    const createCheeseMaker = async ({
        quantity,
        price,
        cheese_maker_id,
    }: MilkSelledType) => {
        try {
            const response: AxiosResponse = await milkSellApi.createMilkSell({
                quantity,
                price,
                cheese_maker_id,
            });

            if (response.status === 200) {
                setRefresh(!refresh);
                showMessage({
                    message: 'Enhorabuena!',
                    description: 'Venta de leche creada exitosamente',
                    icon: 'success',
                    type: 'success',
                });
                Alert.alert(
                    'Enhorabuena!',
                    'Venta de leche creada exitosamente',
                );
            }
        } catch (error) {
            showMessage({
                message: 'Error :(',
                description: 'No se pudo crear la venta de leche.',
                icon: 'danger',
                type: 'danger',
            });
            console.log(error);
        }
    };
    return (
        <ScrollView style={{ backgroundColor: '#74B7FD' }}>
            <FlashMessage style={{ position: 'fixed', top: 0 }} />
            <ScrollView className="p-4">
                <Text className="mb-4 font-bold text-lg">
                    {' '}
                    Crear venta de leche
                </Text>

                <View>
                    <Formik
                        initialValues={{
                            quantity: 0,
                            price: 0,
                            cheese_maker_id: '',
                        }}
                        onSubmit={createCheeseMaker}
                        validationSchema={TransportCostSchema}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            touched,
                        }) => (
                            <View className="mt-5 w-72 space-y-4">
                                <View>
                                    <Text className="text-base mb-2">
                                        Cantidad
                                    </Text>
                                    <TextInput
                                        placeholder="Ingresar cantidad de leche"
                                        className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
                                        onChangeText={handleChange('quantity')}
                                        onBlur={handleBlur('quantity')}
                                        value={values.quantity}
                                    />
                                    {errors.quantity && touched.quantity && (
                                        <Text className="text-red-500 text-xs mt-1">
                                            {errors.quantity}
                                        </Text>
                                    )}
                                </View>
                                <View>
                                    <Text className="text-base mb-2">
                                        Precio (galón)
                                    </Text>
                                    <TextInput
                                        placeholder="Ingresar precio de venta de la leche"
                                        className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
                                        onChangeText={handleChange('price')}
                                        onBlur={handleBlur('price')}
                                        value={values.price}
                                    />
                                    {errors.price && touched.price && (
                                        <Text className="text-red-500 text-xs mt-1">
                                            {errors.price}
                                        </Text>
                                    )}
                                </View>
                                <View>
                                    <Text className="text-base mb-2">
                                        Quesero
                                    </Text>
                                    <Picker
                                        items={cheeseMakers}
                                        value={values.cheese_maker_id}
                                        onValueChange={handleChange(
                                            'cheese_maker_id',
                                        )}
                                        onBlur={handleBlur('cheese_maker_id')}
                                    />
                                </View>

                                <TouchableOpacity
                                    className="px-5 bg-orange-300 py-2 font-medium border border-b-4 border-r-4 border-black rounded-lg shadow-lg hover:shadow-sm"
                                    onPress={handleSubmit}
                                >
                                    <Text className="text-center text-base font-bold">
                                        Guardar venta de leche
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>

                    <Text className="mt-8 font-bold text-lg">
                        Lista de Venta de leche:
                    </Text>
                    <ScrollView>
                        {milkSells.map((sell, key) => (
                            <View
                                className="border-2 flex flex-row p-3 py-5 my-3 bg-white"
                                style={{ borderRadius: 24 }}
                                key={key}
                            >
                                <View className="flex mr-6">
                                    <View
                                        className="border py-3 bg-orange-300"
                                        style={{ borderRadius: 24 }}
                                    >
                                        <Image
                                            source={{
                                                uri: 'https://services-project.s3.us-east-2.amazonaws.com/icons-milch/sell.png',
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
                                        {dayjs(sell.date).format('DD/MM/YYYY')}
                                    </Text>

                                    <View className="mt-4">
                                        <Text className="text-gray-500">
                                            {sell.quantity} Galones
                                        </Text>
                                        <Text className="text-lg font-bold">
                                            {Number(sell.price).toLocaleString(
                                                'es-NI',
                                                {
                                                    style: 'currency',
                                                    currency: 'NIO',
                                                },
                                            )}{' '}
                                        </Text>
                                        <Text className="text-gray-500">
                                            (precio unitario)
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </ScrollView>
    );
}
