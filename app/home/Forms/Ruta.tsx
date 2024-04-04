import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from 'react-native-rapi-ui';
import { AxiosResponse } from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { MilkRouteType, milkRouteApi } from '~/services/route';
import useTable from '~/services/hooks/useTable';

export default function Ruta() {
    const MilkRouteSchema = Yup.object().shape({
        name: Yup.string().required('Nombre de la ruta es requerido'),
        description: Yup.string(),
    });

    const { MyTableComponent, setRefresh, refresh } = useTable<MilkRouteType>(
        milkRouteApi.getRoutes,
    );

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
    return (
        <>
            <FlashMessage position="top" />
            <ScrollView className="p-4">
                <Text className="mb-4 font-bold"> Crear ruta </Text>

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
                            <View className="mt-5 mx-5 w-72 space-y-4">
                                <View>
                                    <Text className="text-gray-400 mb-2">
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
                                    <Text className="text-gray-400 mb-2">
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
                                    className="bg-orange-300 p-3 mt-4"
                                    onPress={handleSubmit}
                                >
                                    <Text className="text-center text-base text-white">
                                        Guardar ruta
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>

                    <Text className="mt-6 font-bold">Lista de Rutas:</Text>
                    <ScrollView className="h-64 min-h-64 mt-4">
                        <MyTableComponent />
                    </ScrollView>
                </View>
            </ScrollView>
        </>
    );
}
