import {
    ScrollView,
    Text,
    View,
    StyleSheet,
    Image,
    ImageBackground,
    Alert,
} from 'react-native';

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
import dayjs from 'dayjs';
import useDateTimePicker from '~/services/hooks/useDateTimePicker';
import formatDateString from '~/utils/formatDateString';

import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Transporte() {
    const CollectablSchema = Yup.object().shape({
        name: Yup.string().required('Nombre de la colecta es requerido'),
        quantity: Yup.number().required(
            'Cantidad de leche colectada es requerida',
        ),
        price: Yup.number().required('El precio de la leche es requerido'),
        driver_id: Yup.string().required('Productor es requerido'),
        route_id: Yup.string().required('Ruta es requerida'),
        producer_id: Yup.string().required('Productor es requerido'),
    });

    const {
        DatePickerComponent: DatePickerComponent,
        switchModalVisibility: switchModalVisibilityDate,
        date: collectedDate,
    } = useDateTimePicker({
        mode: 'date',
        title: 'Seleccione fecha',
    });

    const { MyTableComponent, setRefresh, refresh } = useTable<MilkCollectType>(
        milkCollectApi.getMilkCollects,
    );

    const [drivers, setDrivers] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [producers, setProducers] = useState([]);

    const [milkCollects, setMilkCollects] = useState<MilkCollectType[]>([]);

    const createMilkCollect = async ({
        name,
        quantity,
        price,
        driver_id,
        route_id,
        producer_id,
    }: MilkCollectType) => {
        try {
            console.log({
                name,
                quantity,
                price,
                driver_id,
                route_id,
                producer_id,
            });
            const response: AxiosResponse =
                await milkCollectApi.createMilkCollect({
                    name,
                    quantity,
                    price,
                    driver_id,
                    route_id,
                    producer_id,
                    date: dayjs(collectedDate).format('YYYY-MM-DD'),
                });

            if (response.status === 200) {
                setRefresh(!refresh);
                showMessage({
                    message: 'Enhorabuena!',
                    description: 'Colecta de leche creada exitosamente.',
                    icon: 'success',
                    type: 'success',
                });

                Alert.alert(
                    'Enhorabuena',
                    'Colecta de leche creada exitosamente.',
                );
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
            const fetchMilkCollects = async () => {
                const response = await milkCollectApi.getMilkCollects();
                setMilkCollects(response.data);
            };
            fetchMilkCollects();
            fetchDrivers();
            fetchRoutes();
            fetchProducers();
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
                        Guardar colecta de leche
                    </Text>

                    <Formik
                        initialValues={{
                            name: '',
                            quantity: 0,
                            price: 0,
                            driver_id: '0',
                            route_id: '',
                            producer_id: '',
                            date: dayjs(new Date()).format('YYYY-MM-DD'),
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
                            <View className="mt-3 w-72 space-y-4">
                                <View>
                                    <Text className="mb-2 text-base">
                                        Nombre
                                    </Text>
                                    <TextInput
                                        placeholder="Ingresa el nombre de el colectado"
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
                                    <Text className="mb-2 text-base">
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
                                    <Text className="mb-2 text-base">
                                        Precio (C$)
                                    </Text>
                                    <TextInput
                                        placeholder="Ingresa el precio de la leche a colectar"
                                        className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
                                        onChangeText={handleChange('price')}
                                        onBlur={handleBlur('price')}
                                        value={values.price}
                                    />
                                    {errors.quantity && touched.quantity && (
                                        <Text className="text-red-500 text-xs mt-1">
                                            {errors.quantity}
                                        </Text>
                                    )}
                                </View>

                                <View>
                                    <Text className="mb-2 text-base">
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
                                    <Text className="mb-2 text-base">
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
                                    <Text className="mb-2 text-base">
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

                                <View>
                                    <Text className="mb-2 text-base">
                                        Seleccione una fecha
                                    </Text>
                                    <TouchableOpacity
                                        onPress={switchModalVisibilityDate}
                                    >
                                        <TextInput
                                            value={formatDateString(
                                                collectedDate.toString(),
                                            )}
                                            editable={false}
                                        />
                                    </TouchableOpacity>

                                    <DatePickerComponent />
                                </View>

                                <TouchableOpacity
                                    className="px-5 bg-orange-300 py-2 font-medium border border-b-4 border-r-4 border-black rounded-lg shadow-lg hover:shadow-sm"
                                    onPress={handleSubmit}
                                >
                                    <Text className="text-center text-base font-bold">
                                        Guardar colecta de leche
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                    <View>
                        <Text className="mt-8 font-bold text-lg">
                            Lista de leche colectada:
                        </Text>
                        <ScrollView>
                            {milkCollects.map((collect) => (
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
                                                    uri: 'https://services-project.s3.us-east-2.amazonaws.com/icons-milch/milch.png',
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
                                            {collect.name}
                                        </Text>
                                        <Text className="text-gray-500 text-xs mt-1">
                                            {dayjs(collect.date).format(
                                                'DD/MM/YYYY',
                                            )}
                                        </Text>

                                        <View className="mt-4">
                                            <Text className="text-gray-500">
                                                {collect.quantity} Galones
                                            </Text>
                                            <Text className="text-lg font-bold">
                                                {Number(
                                                    collect.price,
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
