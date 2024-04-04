import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from 'react-native-rapi-ui';
import { AxiosResponse } from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import useTable from '~/services/hooks/useTable';
import { CheeseMakerType, cheeseMakersApi } from '~/services/cheese_maker';

export default function Queso() {
    const TransportCostSchema = Yup.object().shape({
        name: Yup.string().required(
            'Nombre del quesero es requerido',
        ),
        description: Yup.string().required(
            'Descripción de el quesero es requerida',
        ),
        phone: Yup.number(),
    });

    const { MyTableComponent, setRefresh, refresh } = useTable<CheeseMakerType>(
        cheeseMakersApi.getCheeseMakers,
    );

    const createCheeseMaker = async ({
        name,
        description,
        phone,
    }: CheeseMakerType) => {
        try {
            const response: AxiosResponse =
                await cheeseMakersApi.createCheeseMaker({
                    name,
                    description,
                    phone,
                });

            if (response.status === 200) {
                setRefresh(!refresh);
                showMessage({
                    message: 'Enhorabuena!',
                    description: 'Quesero creado exitosamente.',
                    icon: 'success',
                    type: 'success',
                });
            }
        } catch (error) {
            showMessage({
                message: 'Error :(',
                description: 'No se pudo crear el quesero transporte.',
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
                <Text className="mb-4 font-bold">
                    {' '}
                    Crear quesero transporte{' '}
                </Text>

                <View>
                    <Formik
                        initialValues={{ name: '', description: '', phone: '' }}
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
                                        Nombre
                                    </Text>
                                    <TextInput
                                        placeholder="Ingresar nombre del quesero transporte"
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
                                        placeholder="Ingresar descripción del quesero"
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
                                        Teléfono
                                    </Text>
                                    <TextInput
                                        placeholder="Ingresar descripción del quesero"
                                        className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
                                        onChangeText={handleChange('phone')}
                                        onBlur={handleBlur('phone')}
                                        value={values.phone}
                                    />
                                    {errors.phone && touched.phone && (
                                        <Text className="text-red-500 text-xs mt-1">
                                            {errors.phone}
                                        </Text>
                                    )}
                                </View>

                                <TouchableOpacity
                                    className="bg-orange-300 p-3 mt-4"
                                    onPress={handleSubmit}
                                >
                                    <Text className="text-center text-base text-white">
                                        Guardar quesero
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>

                    <Text className="mt-6 font-bold">
                        Lista de Queseros:
                    </Text>
                    <ScrollView className="h-64 min-h-64 mt-4">
                        <MyTableComponent />
                    </ScrollView>
                </View>
            </ScrollView>
        </>
    );
}
