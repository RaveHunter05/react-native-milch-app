import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from 'react-native-rapi-ui';
import { AxiosResponse } from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { MilkRouteType, milkRouteApi } from '~/services/route';
import useTable from '~/services/hooks/useTable';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { FontAwesome } from '@expo/vector-icons';

export default function Ruta() {
    const MilkRouteSchema = Yup.object().shape({
        name: Yup.string().required('Nombre de la ruta es requerido'),
        description: Yup.string(),
    });

    const { MyTableComponent, setRefresh, refresh } = useTable<MilkRouteType>(
        milkRouteApi.getRoutes,
    );

    const [routes, setRoutes] = useState<MilkRouteType[]>([]);

    const handleDeleteRoute = async (id: number) => {
        const deleteRoute = async () => {
            try {
                const response: AxiosResponse =
                    await milkRouteApi.deleteRoute(id);
                Alert.alert('Ruta eliminada exitosamente');
                setRefresh(!refresh);
                return response;
            } catch (error) {
                showMessage({
                    message: 'Error al eliminar la ruta',
                    description: 'No se pudo eliminar la ruta',
                    icon: 'danger',
                    type: 'danger',
                });

                console.error('API Error:', error);
            }
        };
        Alert.alert(
            '¿Estás seguro de eliminar esta ruta?',
            'Esta acción no se puede deshacer',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', onPress: deleteRoute },
            ],
        );
    };

    const createMilkRoute = async ({ name, description }: MilkRouteType) => {
        try {
            const response: AxiosResponse = await milkRouteApi.createRoute({
                name,
                description,
            });

            if (response.status === 200) {
                setRefresh(!refresh);
                showMessage({
                    message: 'Enhorabuena!',
                    description: 'Ruta de leche creada exitosamente.',
                    icon: 'success',
                    type: 'success',
                });
            }
        } catch (error) {
            showMessage({
                message: 'Error :(',
                description: 'No se pudo crear la ruta.',
                icon: 'danger',
                type: 'danger',
            });
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchRoutes = async () => {
            const response: AxiosResponse = await milkRouteApi.getRoutes();
            setRoutes(response.data);
        };
        fetchRoutes();
    }, [refresh]);
    return (
        <ScrollView style={{ backgroundColor: '#74B7FD' }}>
            <FlashMessage style={{ position: 'fixed', top: 0 }} />
            <ScrollView className="p-4">
                <Text className="mb-4 font-bold text-lg"> Crear ruta </Text>

                <View>
                    <Formik
                        initialValues={{ name: '', description: '' }}
                        onSubmit={createMilkRoute}
                        validationSchema={MilkRouteSchema}
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
                                        placeholder="Ingresar nombre de la ruta"
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
                                        placeholder="Ingresar descripción de la ruta"
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

                                <TouchableOpacity
                                    className="px-5 bg-orange-300 py-2 font-medium border border-b-4 border-r-4 border-black rounded-lg shadow-lg hover:shadow-sm"
                                    onPress={handleSubmit}
                                >
                                    <Text className="text-center text-base font-bold">
                                        Guardar ruta
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>

                    <Text className="mt-8 font-bold text-lg">
                        Lista de Rutas:
                    </Text>
                    <ScrollView className="mt-4">
                        <ScrollView>
                            {routes.map((route, key) => (
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
                                                    uri: 'https://services-project.s3.us-east-2.amazonaws.com/icons-milch/route.png',
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
                                            {route.name}
                                        </Text>
                                        <Text className="text-gray-500 text-xs mt-1">
                                            {dayjs(route.date).format(
                                                'DD/MM/YYYY',
                                            )}
                                        </Text>
                                        <View className="mt-4">
                                            <Text className="text-blue-300">
                                                {route.description}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="ml-auto mr-3">
                                        <Pressable
                                            onPress={() =>
                                                handleDeleteRoute(route.id)
                                            }
                                        >
                                            <FontAwesome
                                                name="trash-o"
                                                size={24}
                                                color="red"
                                            />
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </ScrollView>
                </View>
            </ScrollView>
        </ScrollView>
    );
}
