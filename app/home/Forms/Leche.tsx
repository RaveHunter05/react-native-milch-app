import { Text, TouchableOpacity, View } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from 'react-native-rapi-ui';
import { AxiosResponse } from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { MilkPriceType, milkApi } from '~/services/milk';
import useTable from '~/services/hooks/useTable';

export default function Milk() {
    const { MyTableComponent, setRefresh, refresh } = useTable<MilkPriceType>(
        milkApi.getMilkPrices,
    );
    const MilkPriceSchema = Yup.object().shape({
        name: Yup.string().required('Nombre de la leche es requerido'),
        price: Yup.number().required('El precio de la leche es requerida'),
    });

    const createMilkPrice = async ({ name, price }: MilkPriceType) => {
        try {
            const response: AxiosResponse = await milkApi.createMilkPrice({
                name,
                price,
            });

            if (response.status === 200) {
                setRefresh(!refresh);
                showMessage({
                    message: 'Enhorabuena!',
                    description: 'Precio de leche creado exitosamente',
                    icon: 'success',
                    type: 'success',
                });
            }
        } catch (error) {
            showMessage({
                message: 'Error :(',
                description: 'No se pudo crear el precio de leche.',
                icon: 'danger',
                type: 'danger',
            });
            console.log(error);
        }
    };
    return (
        <>
            <FlashMessage position="top" />
            <View className="p-4">
                <Text className="mb-4 font-bold"> Crear precio de leche </Text>

                <View>
                    <Formik
                        initialValues={{ name: '', price: 0 }}
                        onSubmit={createMilkPrice}
                        validationSchema={MilkPriceSchema}
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
                                        Nombre
                                    </Text>
                                    <TextInput
                                        placeholder="Ingresar nombre de la leche"
                                        className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        value={values.name}
                                    />
                                    {errors.name && touched.name && (
                                        <Text className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </Text>
                                    )}
                                </View>
                                <View>
                                    <Text className="text-gray-400 mb-2">
                                        Precio
                                    </Text>
                                    <TextInput
                                        placeholder="Ingresar precio de la leche"
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

                                <TouchableOpacity
                                    className="bg-orange-300 p-3 mt-4"
                                    onPress={handleSubmit}
                                >
                                    <Text className="text-center text-base text-white">
                                        Guardar precio de leche
                                    </Text>
                                </TouchableOpacity>

                                <Text className="mb-4 mt-4 font-bold">
                                    Lista de precios de Lehce:
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
