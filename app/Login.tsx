import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View, TextInput } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { authApi } from '@/services/auth';
import { AxiosResponse } from 'axios';
import { saveToken } from '@/helpers/secureStore';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { router } from 'expo-router';

export default function Login() {
    const LoginSchema = Yup.object().shape({
        username: Yup.string().required('Nombre de usuario es requerido'),
        password: Yup.string().required('Contraseña requerida'),
    });

    const handleSubmit = async ({ username, password }: any) => {
        try {
            const response: AxiosResponse = await authApi.login({
                username,
                password,
            });
            if (response.status === 200) {
                showMessage({
                    message: 'Enhorabuena!',
                    description: 'Logeado exitosamente, ¡Bienvenido!',
                    icon: 'success',
                    type: 'success',
                });
                saveToken(response.data.access_token);
                router.replace('/home');
            }
        } catch (error) {
            showMessage({
                message: 'Error :(',
                description: 'Usuario o contraseña incorrectos.',
                icon: 'danger',
                type: 'danger',
            });
            console.log('Error:', error);
        }
    };
    return (
        <>
            <FlashMessage position="top" />
            <View
                className="flex-1 justify-center items-center"
                style={{ backgroundColor: '#74B7FD' }}
            >
                <StatusBar style="auto" />
                <Text className="font-extrabold mt-3 text-3xl text-white">
                    Login
                </Text>
                {/* Additional components goes here */}
                <Formik
                    initialValues={{ username: 'Paul', password: '1234' }}
                    onSubmit={handleSubmit}
                    validationSchema={LoginSchema}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                    }) => (
                        <View className="mt-5 mx-5 w-72">
                            <View>
                                <Text className="text-base mb-2">
                                    Nombre de usuario:
                                </Text>
                                <TextInput
                                    placeholder="Ingresar nombre de usuario..."
                                    className="border-black bg-white px-5 py-2 font-medium border border-b-4 border-r-4 border-black rounded-lg shadow-lg hover:shadow-sm hover:border-b-2 hover:border-r-2"
                                    onChangeText={handleChange('username')}
                                    onBlur={handleBlur('username')}
                                    value={values.username}
                                />
                                {errors.username && touched.username && (
                                    <Text className="text-red-500 text-xs mt-1">
                                        {errors.username}
                                    </Text>
                                )}
                            </View>
                            <View className="mt-3">
                                <Text className="text-base mb-2">
                                    Contraseña:
                                </Text>
                                <TextInput
                                    secureTextEntry
                                    placeholder="Ingresar contraseña..."
                                    className="border-black bg-white px-5 py-2 font-medium border border-b-4 border-r-4 border-black rounded-lg shadow-lg hover:shadow-sm hover:border-b-2 hover:border-r-2"
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                />
                            </View>

                            {errors.password && touched.password && (
                                <Text className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </Text>
                            )}

                            <TouchableOpacity
                                className="px-5 bg-orange-300 py-2 font-medium border border-b-4 border-r-4 border-black rounded-lg shadow-lg hover:shadow-sm mt-4"
                                onPress={handleSubmit}
                            >
                                <Text className="text-center text-base font-bold">
                                    Login
                                </Text>
                            </TouchableOpacity>

                            <Text className="mt-4 text-base">
                                ¿No tienes usuario?{' '}
                                <TouchableOpacity
                                    onPress={() => router.replace('/Register')}
                                >
                                    <Text className="text-base text-white">
                                        Regístrate
                                    </Text>
                                </TouchableOpacity>
                            </Text>
                        </View>
                    )}
                </Formik>
            </View>
        </>
    );
}
