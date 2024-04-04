import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker, TextInput } from 'react-native-rapi-ui';
import { AxiosResponse } from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import useTable from '~/services/hooks/useTable';
import { MilkSelledType, milkSellApi } from '~/services/milk_sell';
import { useEffect, useState } from 'react';
import { cheeseMakersApi, CheeseMakerType } from '~/services/cheese_maker';

export default function Venta() {
    const TransportCostSchema = Yup.object().shape({
        quantity: Yup.number().required('Cantidad de leche es requerido'),
        price: Yup.number().required('Precio de leche es requerido'),
        cheese_maker_id: Yup.string().required('Quesero es requerido'),
    });

    const { MyTableComponent, setRefresh, refresh } = useTable<MilkSelledType>(
        milkSellApi.getMilkSells,
    );

    const [cheeseMakers, setCheeseMakers] = useState([]);

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
    }, []);

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
        <>
            <FlashMessage position="top" />
            <ScrollView className="p-4">
                <Text className="mb-4 font-bold"> Crear venta de leche</Text>

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
                            <View className="mt-5 mx-5 w-72 space-y-4">
                                <View>
                                    <Text className="text-gray-400 mb-2">
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
                                    <Text className="text-gray-400 mb-2">
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
                                    <Text className="text-gray-400 mb-2">
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
                                    className="bg-orange-300 p-3 mt-4"
                                    onPress={handleSubmit}
                                >
                                    <Text className="text-center text-base text-white">
                                        Guardar venta de leche
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>

                    <Text className="mt-6 font-bold">
                        Lista de Venta de leche:
                    </Text>
                    <ScrollView className="h-64 min-h-64 mt-4">
                        <MyTableComponent />
                    </ScrollView>
                </View>
            </ScrollView>
        </>
    );
}
