import { Text, TouchableOpacity, View } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from 'react-native-rapi-ui';
import { AxiosResponse } from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { TransportCostType, transportCostApi } from '~/services/transportCost';
import useTable from '~/services/hooks/useTable';

export default function Transporte() {
    const TransportCostSchema = Yup.object().shape({
        name: Yup.string().required(
            'Nombre del costo de transporte es requerido',
        ),
        description: Yup.string().required(
            'Descripción de el costo de transporte es requerida',
        ),
        cost: Yup.number().required('Costo de el transporte es requerido'),
    });

    const { MyTableComponent, setRefresh, refresh } =
        useTable<TransportCostType>(transportCostApi.getTransportCosts);

    const createTransportCost = async ({
        name,
        description,
        cost,
    }: TransportCostType) => {
        try {
            const response: AxiosResponse =
                await transportCostApi.createTransportCost({
                    name,
                    description,
                    cost,
                });

            if (response.status === 200) {
                setRefresh(!refresh);
                showMessage({
                    message: 'Enhorabuena!',
                    description: 'Costo de transporte creado exitosamente.',
                    icon: 'success',
                    type: 'success',
                });
            }
        } catch (error) {
            showMessage({
                message: 'Error :(',
                description: 'No se pudo crear el costo de transporte.',
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
                <Text className="mb-4 font-bold">
                    {' '}
                    Crear costo de transporte{' '}
                </Text>

                <View>
                    <Formik
                        initialValues={{ name: '', description: '', cost: 0 }}
                        onSubmit={createTransportCost}
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
                                        Nombre
                                    </Text>
                                    <TextInput
                                        placeholder="Ingresar nombre del costo de transporte"
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
                                        Descripción
                                    </Text>
                                    <TextInput
                                        placeholder="Ingresar descripción del costo de transporte"
                                        className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
                                        onChangeText={handleChange(
                                            'description',
                                        )}
                                        onBlur={handleBlur('description')}
                                        value={values.description}
                                    />
                                    {errors.description &&
                                        touched.description && (
                                            <Text className="text-red-500 text-xs mt-1">
                                                {errors.description}
                                            </Text>
                                        )}
                                </View>

                                <View>
                                    <Text className="text-gray-400 mb-2">
                                        Costo
                                    </Text>
                                    <TextInput
                                        placeholder="Ingresar costo del transporte"
                                        className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
                                        onChangeText={handleChange('cost')}
                                        onBlur={handleBlur('cost')}
                                        value={values.cost}
                                    />
                                    {errors.cost && touched.cost && (
                                        <Text className="text-red-500 text-xs mt-1">
                                            {errors.cost}
                                        </Text>
                                    )}
                                </View>

                                <TouchableOpacity
                                    className="bg-orange-300 p-3 mt-4"
                                    onPress={handleSubmit}
                                >
                                    <Text className="text-center text-base text-white">
                                        Guardar costo de transporte
                                    </Text>
                                </TouchableOpacity>

                                <Text className="mb-4 mt-4 font-bold">
                                    Lista de Costos de Transporte:
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
