import { Text, TouchableOpacity, View } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker, TextInput } from 'react-native-rapi-ui';
import { AxiosResponse } from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { MilkCollectType, milkCollectApi } from '~/services/collected_milk';
import { useEffect, useState } from 'react';
import { DriverType, driverApi } from '~/services/driver';
import { MilkRouteType, milkRouteApi } from '~/services/route';
import { ProducerType, producerApi } from '~/services/producer';
import useTable from '~/services/hooks/useTable';

export default function Transporte() {
    const CollectablSchema = Yup.object().shape({
        quantity: Yup.number().required(
            'Cantidad de leche colectada es requerida',
        ),
        type: Yup.string().required(
            'Tipo de leche es requerido (litros, galones, etc)',
        ),
        driver_id: Yup.string().required('Productor es requerido'),
        route_id: Yup.string().required('Ruta es requerida'),
        producer_id: Yup.string().required('Productor es requerido'),
    });

    const { MyTableComponent, setRefresh, refresh } = useTable<MilkCollectType>(
        milkCollectApi.getMilkCollects,
    );

    const [drivers, setDrivers] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [producers, setProducers] = useState([]);

    const createMilkCollect = async ({
        quantity,
        type,
        driver_id,
        route_id,
        producer_id,
    }: MilkCollectType) => {
        try {
            const response: AxiosResponse =
                await milkCollectApi.createMilkCollect({
                    quantity,
                    type,
                    driver_id,
                    route_id,
                    producer_id,
                });

            if (response.status === 200) {
                setRefresh(!refresh);
                showMessage({
                    message: 'Enhorabuena!',
                    description: 'Colecta de leche creada exitosamente.',
                    icon: 'success',
                    type: 'success',
                });
            }
        } catch (error) {
            showMessage({
                message: 'Error :(',
                description: 'No se pudo crear la colecta de leche.',
                icon: 'danger',
                type: 'danger',
            });
            console.log(error);
        }
    };

    useEffect(() => {
        try {
            const fetchDrivers = async () => {
                const response = await driverApi.getDrivers();
                const formatedDrivers = response.data.map(
                    (driver: DriverType) => {
                        return {
                            label: driver.name,
                            value: driver.id.toString(),
                        };
                    },
                );
                setDrivers(formatedDrivers);
                console.log({ formatedDrivers });
            };
            const fetchRoutes = async () => {
                const response = await milkRouteApi.getRoutes();
                const formatedRoutes = response.data.map(
                    (route: MilkRouteType) => {
                        return {
                            label: route.name,
                            value: route.id.toString(),
                        };
                    },
                );
                setRoutes(formatedRoutes);
            };
            const fetchProducers = async () => {
                const response = await producerApi.getProducers();
                const formatedProducers = response.data.map(
                    (producer: ProducerType) => {
                        return {
                            label: producer.name,
                            value: producer.id.toString(),
                        };
                    },
                );
                setProducers(formatedProducers);
            };
            fetchDrivers();
            fetchRoutes();
            fetchProducers();
        } catch (error) {
            console.log(error);
        }
    }, []);
    return (
        <>
            <FlashMessage position="top" />
            <View className="p-4">
                <Text className="mb-4 font-bold">Guardar colecta de leche</Text>

                <View>
                    <Formik
                        initialValues={{
                            driver_id: '0',
                            route_id: '',
                            producer_id: '',
                            quantity: 0,
                            type: 'litros',
                        }}
                        onSubmit={createMilkCollect}
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
                                        Cantidad
                                    </Text>
                                    <TextInput
                                        placeholder="Ingresa la cantidad de leche a colectar"
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
                                        Tipo
                                    </Text>
                                    <Picker
                                        className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
                                        onValueChange={handleChange('type')}
                                        onBlur={handleBlur('type')}
                                        items={[
                                            { label: 'Litro', value: 'litro' },
                                            { label: 'Galón', value: 'galon' },
                                        ]}
                                        value={values.type}
                                    />
                                    {errors.type && touched.type && (
                                        <Text className="text-red-500 text-xs mt-1">
                                            {errors.type}
                                        </Text>
                                    )}
                                </View>
                                <View>
                                    <Text className="text-gray-400 mb-2">
                                        Seleccione un conductor
                                    </Text>

                                    <Picker
                                        items={drivers}
                                        value={values.driver_id}
                                        onValueChange={handleChange(
                                            'driver_id',
                                        )}
                                        onBlur={handleBlur('driver_id')}
                                    />
                                </View>
                                <View>
                                    <Text className="text-gray-400 mb-2">
                                        Seleccione una ruta
                                    </Text>
                                    <Picker
                                        items={routes}
                                        value={values.route_id}
                                        onValueChange={handleChange('route_id')}
                                        onBlur={handleBlur('route_id')}
                                    />
                                </View>

                                <View>
                                    <Text className="text-gray-400 mb-2">
                                        Seleccione un productor
                                    </Text>
                                    <Picker
                                        items={producers}
                                        value={values.producer_id}
                                        onValueChange={handleChange(
                                            'producer_id',
                                        )}
                                        onBlur={handleBlur('producer_id')}
                                    />
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
                                    Lista de Colectado:
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
