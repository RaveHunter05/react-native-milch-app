import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from 'react-native-rapi-ui';
import { AxiosResponse } from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { DriverType, driverApi } from '~/services/driver';

import useTable from '~/services/hooks/useTable';

export default function Conductor() {
    const DriverSchema = Yup.object().shape({
        name: Yup.string().required('Nombre de el conductor es requerido'),
        phone: Yup.string(),
    });

    const { MyTableComponent, setRefresh, refresh } = useTable<DriverType>(
        driverApi.getDrivers,
    );

    const createDriver = async ({ name, phone }: DriverType) => {
        try {
            const response: AxiosResponse = await driverApi.createDriver({
                name,
                phone,
            });

            if (response.status === 200) {
                setRefresh(!refresh);
                showMessage({
                    message: 'Enhorabuena!',
                    description: 'Conductor creado exitosamente',
                    icon: 'success',
                    type: 'success',
                });
            }
        } catch (error) {
            showMessage({
                message: 'Error :(',
                description: 'No se pudo crear el conductor.',
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
                    Crear Conductor{' '}
                </Text>

                <View>
                    <Formik
                        initialValues={{ name: '', phone: '' }}
                        onSubmit={createDriver}
                        validationSchema={DriverSchema}
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
                                        Nombre
                                    </Text>
                                    <TextInput
                                        placeholder="Ingresar nombre de el conductor"
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
                                    <Text className="text-base mb-2">
                                        Teléfono
                                    </Text>
                                    <TextInput
                                        placeholder="Ingresar teléfono de el conductor"
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
                                    className="px-5 bg-orange-300 py-2 font-medium border border-b-4 border-r-4 border-black rounded-lg shadow-lg hover:shadow-sm"
                                    onPress={handleSubmit}
                                >
                                    <Text className="text-center text-base font-bold">
                                        Guardar conductor
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>

                    <Text className="mt-8 font-bold text-lg">
                        Lista de conductores:
                    </Text>
                    <ScrollView className="mt-4">
                        <MyTableComponent />
                    </ScrollView>
                </View>
            </ScrollView>
        </ScrollView>
    );
}
