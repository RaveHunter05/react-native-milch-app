import {
    ScrollView,
    Text,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from 'react-native-rapi-ui';
import { AxiosResponse } from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { ProducerType, producerApi } from '../../../src/services/producer';
import useTable from '~/services/hooks/useTable';
import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

export default function Colectados() {
    const ProducerSchema = Yup.object().shape({
        name: Yup.string().required('Nombre del productor es requerido'),
        description: Yup.string(),
        phone: Yup.string(),
    });

    const { MyTableComponent, setRefresh, refresh } = useTable<ProducerType>(
        producerApi.getProducers,
    );

    const [producers, setProducers] = useState<ProducerType[]>([]);

    const createProducer = async ({
        name,
        description,
        phone,
    }: ProducerType) => {
        try {
            const response: AxiosResponse = await producerApi.createProducer({
                name,
                description,
                phone,
            });

            if (response.status === 200) {
                setRefresh(!refresh);
                showMessage({
                    message: 'Enhorabuena!',
                    description: 'Productor creado exitosamente.',
                    icon: 'success',
                    type: 'success',
                });
		Alert.alert('Enhorabuena', 'Productor creado exitosamente.')
            }
        } catch (error) {
            showMessage({
                message: 'Error :(',
                description: 'No se pudo crear el productor.',
                icon: 'danger',
                type: 'danger',
            });
            console.log(error);
        }
    };
    useEffect(() => {
        const fetchProducers = async () => {
            const response = await producerApi.getProducers();

            setProducers(response.data);
        };

        fetchProducers();
    }, []);
    return (
        <>
            <FlashMessage style={{ position: 'fixed', top: 0 }} />
            <ScrollView style={{ backgroundColor: '#74B7FD' }}>
                <ScrollView className="p-4">
                    <Text className="mb-4 font-bold text-lg">
                        {' '}
                        Crear productor{' '}
                    </Text>

                    <View>
                        <Formik
                            initialValues={{
                                name: '',
                                description: '',
                                phone: '',
                            }}
                            onSubmit={createProducer}
                            validationSchema={ProducerSchema}
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
                                            placeholder="Ingresar nombre del productor"
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
                                            Descripción
                                        </Text>
                                        <TextInput
                                            placeholder="Ingresar descripción del productor"
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
                                        <Text className="text-base mb-2">
                                            Teléfono
                                        </Text>
                                        <TextInput
                                            placeholder="Ingresar teléfono del productor"
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
                                            Guardar productor
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>

                        <Text className="mt-8 font-bold text-lg">
                            Lista de Productores:
                        </Text>
                        <ScrollView>
                            {producers.map((producer) => (
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
                                                    uri: 'https://services-project.s3.us-east-2.amazonaws.com/icons-milch/producer.png',
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
                                            {producer.name}
                                        </Text>
                                        <Text className="text-gray-500 text-xs mt-1">
                                            {dayjs(producer.date).format(
                                                'DD/MM/YYYY',
                                            )}
                                        </Text>

                                        <View className="mt-4">
                                            <Text>Teléfono:</Text>
                                            {producer.phone ? (
                                                <Text
                                                    className="text-blue-300"
                                                    selectable={true}
                                                >
                                                    {producer.phone}
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
        </>
    );
}
