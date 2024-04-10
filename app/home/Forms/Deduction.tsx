import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from 'react-native-rapi-ui';
import { AxiosResponse } from 'axios';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { DeductionType, deductionApi } from '~/services/deductions';
import useTable from '~/services/hooks/useTable';

export default function Deduction() {
    const DeductionSchema = Yup.object().shape({
        name: Yup.string().required('Nombre de la deducción es requerido'),
        description: Yup.string().required(
            'La descripción de la deducción es requerida',
        ),
        price: Yup.number().required('El precio de la deducción es requerida'),
    });

    const { MyTableComponent, setRefresh, refresh } = useTable<DeductionType>(
        deductionApi.getDeductions,
    );

    const createDeduction = async ({
        name,
        description,
        price,
    }: DeductionType) => {
        try {
            const response: AxiosResponse = await deductionApi.createDeduction({
                name,
                description,
                price,
            });

            if (response.status === 200) {
                setRefresh(!refresh);
                showMessage({
                    message: 'Enhorabuena!',
                    description: 'Deducción creada exitosamente',
                    icon: 'success',
                    type: 'success',
                });
            }
        } catch (error) {
            showMessage({
                message: 'Error :(',
                description: 'No se pudo crear la deducción.',
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
                    Crear deducción{' '}
                </Text>

                <View>
                    <Formik
                        initialValues={{ name: '', description: '', price: 0 }}
                        onSubmit={createDeduction}
                        validationSchema={DeductionSchema}
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
                                        placeholder="Ingresar nombre de la deducción"
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
                                        Description
                                    </Text>
                                    <TextInput
                                        placeholder="Ingresar descripción de la deducción"
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
                                        Precio
                                    </Text>
                                    <TextInput
                                        placeholder="Ingresar precio de la deducción"
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
                                    className="px-5 bg-orange-300 py-2 font-medium border border-b-4 border-r-4 border-black rounded-lg shadow-lg hover:shadow-sm"
                                    onPress={handleSubmit}
                                >
                                    <Text className="text-center text-base font-bold">
                                        Guardar deducción
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>

                    <Text className="mt-8 font-bold text-lg">
                        Lista de deducciones:
                    </Text>
                    <ScrollView className="mt-4">
                        <MyTableComponent />
                    </ScrollView>
                </View>
            </ScrollView>
        </ScrollView>
    );
}
