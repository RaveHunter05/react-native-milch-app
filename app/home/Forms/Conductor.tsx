import {
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
    View,
    Alert,
} from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from 'react-native-rapi-ui';
import { AxiosResponse } from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { DriverType, driverApi } from '~/services/driver';

import useTable from '~/services/hooks/useTable';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export default function Conductor() {
    const DriverSchema = Yup.object().shape({
        name: Yup.string().required('Nombre de el conductor es requerido'),
        phone: Yup.string(),
    });

    const { MyTableComponent, setRefresh, refresh } = useTable<DriverType>(
        driverApi.getDrivers,
    );

    const [drivers, setDrivers] = useState<DriverType[]>([]);

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
                Alert.alert('Enhorabuena!', 'Conductor creado exitosamente');
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

    useEffect(() => {
        const fetchDrivers = async () => {
            const response: AxiosResponse = await driverApi.getDrivers();
            setDrivers(response.data);
        };
        fetchDrivers();
    }, []);

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
                    <ScrollView>
                        {drivers.map((driver) => (
                            <View
                                className="border-2 flex flex-row p-3 py-5 my-3 bg-white"
                                style={{ borderRadius: 24 }}
                            >
                                <View className="flex mr-6">
                                    <View
                                        className="border py-3 bg-orange-300"
                                        style={{ borderRadius: 24 }}
                                    >
                                        <Image
                                            source={{
                                                uri: 'https://services-project.s3.us-east-2.amazonaws.com/icons-milch/driver.png',
                                            }}
                                            style={{
                                                width: 90,
                                                height: 90,
                                            }}
                                        />
                                    </View>
                                </View>

                                <View className="">
                                    <Text className="font-bold">
                                        {driver.name}
                                    </Text>
                                    <Text className="text-gray-500 text-xs mt-1">
                                        {dayjs(driver.date).format(
                                            'DD/MM/YYYY',
                                        )}
                                    </Text>

                                    <View className="mt-4">
                                        <Text>Teléfono:</Text>
                                        {driver.phone ? (
                                            <Text
                                                className="text-blue-300"
                                                selectable={true}
                                            >
                                                {driver.phone}
                                            </Text>
                                        ) : (
                                            <Text className="text-red-500">
                                                No se agregó teléfono
                                            </Text>
                                        )}
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
