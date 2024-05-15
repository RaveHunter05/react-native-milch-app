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
import { DeductionType, deductionApi } from '~/services/deductions';
import useTable from '~/services/hooks/useTable';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { FontAwesome } from '@expo/vector-icons';
import useDateTimePicker from '~/services/hooks/useDateTimePicker';
import formatDateString from '~/utils/formatDateString';

export default function Deduction() {
    const DeductionSchema = Yup.object().shape({
        name: Yup.string().required('Nombre de la deducción es requerido'),
        description: Yup.string().required(
            'La descripción de la deducción es requerida',
        ),
        price: Yup.number().required('El precio de la deducción es requerida'),
        date: Yup.string(),
    });

    const {
        DatePickerComponent: DatePickerComponent,
        switchModalVisibility: switchModalVisibilityDate,
        date: deductionDate,
    } = useDateTimePicker({
        mode: 'date',
        title: 'Seleccione fecha',
    });

    const { MyTableComponent, setRefresh, refresh } = useTable<DeductionType>(
        deductionApi.getDeductions,
    );

    const [deductions, setDeductions] = useState<DeductionType[]>([]);

    useEffect(() => {
        const fetchDeductions = async () => {
            const response: AxiosResponse = await deductionApi.getDeductions();
            setDeductions(response.data);
        };
        fetchDeductions();
    }, [refresh]);

    const handleDeleteDeduction = async (id: number) => {
        const deleteDeduction = async (id: number) => {
            try {
                const response: AxiosResponse =
                    await deductionApi.deleteDeduction(id);
                Alert.alert('Deducción eliminada exitosamente');
                setRefresh(!refresh);
                return response;
            } catch (error) {
                Alert.alert('Error al eliminar la deducción');
                showMessage({
                    message: 'Error :(',
                    description: 'No se pudo eliminar la deducción.',
                    icon: 'danger',
                    type: 'danger',
                });

                console.log(error);
            }
        };

        Alert.alert('¿Estás seguro de eliminar esta deducción?', '', [
            {
                text: 'Cancelar',
                style: 'cancel',
            },
            {
                text: 'Eliminar',
                onPress: () => deleteDeduction(id),
            },
        ]);
    };

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
                date: dayjs(deductionDate).format('YYYY-MM-DD'),
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
                        initialValues={{
                            name: '',
                            description: '',
                            price: 0,
                            date: dayjs(new Date()).format('YYYY-MM-DD'),
                        }}
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

                                <View>
                                    <Text className="mb-2 text-base">
                                        Seleccione una fecha
                                    </Text>
                                    <TouchableOpacity
                                        onPress={switchModalVisibilityDate}
                                    >
                                        <TextInput
                                            value={formatDateString(
                                                deductionDate.toString(),
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
                        <ScrollView>
                            {deductions.map((deduction, key) => (
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
                                            {deduction.name}
                                        </Text>
                                        <Text className="text-gray-500 text-xs mt-1">
                                            {dayjs(deduction.date).format(
                                                'DD/MM/YYYY',
                                            )}
                                        </Text>
                                        <View className="mt-4">
                                            <Text className="text-blue-300">
                                                {deduction.description}
                                            </Text>

                                            <Text className="text-lg font-bold">
                                                {Number(
                                                    deduction.price,
                                                ).toLocaleString('es-NI', {
                                                    style: 'currency',
                                                    currency: 'NIO',
                                                })}{' '}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="ml-auto mr-3">
                                        <Pressable
                                            onPress={() =>
                                                handleDeleteDeduction(
                                                    deduction.id,
                                                )
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
