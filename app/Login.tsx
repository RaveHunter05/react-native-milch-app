import { StatusBar } from 'expo-status-bar';
import { TextInput } from 'react-native-rapi-ui';
import { Text, TouchableOpacity, View } from 'react-native';
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
            <View className="flex-1 justify-center items-center bg-white">
                <StatusBar style="auto" />
                <Text className="text-center mt-3 text-2xl font-light text-orange-300">
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
                                <Text className="text-gray-400 mb-2">
                                    Nombre de usuario:
                                </Text>
                                <TextInput
                                    placeholder="Ingresar nombre de usuario..."
                                    className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
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
                                <Text className="text-gray-400 mb-2">
                                    Contraseña:
                                </Text>
                                <TextInput
                                    secureTextEntry
                                    placeholder="Ingresar contraseña..."
                                    className="border text-gray-500 border-dotted p-2 border-amber-400 mt-1"
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
                                className="bg-orange-300 p-3 mt-4"
                                onPress={handleSubmit}
                            >
                                <Text className="text-center text-base text-white">
                                    Login
                                </Text>
                            </TouchableOpacity>

                            <Text className="mt-4 text-gray-400">
                                ¿No tienes usuario?{' '}
                                <TouchableOpacity
                                    onPress={() => router.replace('/Register')}
                                >
                                    <Text className="text-orange-300">
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
