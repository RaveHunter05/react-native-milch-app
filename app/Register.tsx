import { StatusBar } from 'expo-status-bar';
import { TextInput } from 'react-native-rapi-ui';
import { Text, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { RegisterType, authApi } from '@/services/auth';
import { AxiosResponse } from 'axios';
import { saveToken } from '@/helpers/secureStore';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { router } from 'expo-router';

export default function Register() {
    const RegisterSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email inválido')
            .required('Email es requerido'),
        username: Yup.string().required('Nombre de usuario es requerido'),
        password: Yup.string().required('Contraseña requerida'),
        passwordConfirmation: Yup.string()
            .label('Confirmar contraseña')
            .required('Por favor, confirme su contraseña')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    });

    const handleSubmit = async ({
        username,
        email,
        password,
    }: RegisterType) => {
        try {
            const response: AxiosResponse = await authApi.register({
                email,
                username,
                password,
            });
            if (response.status === 200) {
                showMessage({
                    message: 'Enhorabuena!',
                    description: 'Registrado exitosamente. Logeate, por favor',
                    icon: 'success',
                    type: 'success',
                });
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
                    Registrarse
                </Text>
                {/* Additional components goes here */}
                <Formik
                    initialValues={{
                        username: '',
                        email: '',
                        password: '',
                        passwordConfirmation: '',
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={RegisterSchema}
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
                                    Email:
                                </Text>
                                <TextInput
                                    placeholder="Ingresar email..."
                                    className="border border-dotted p-2 text-gray-500 border-amber-400 mt-1"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                />
                                {errors.email && touched.email && (
                                    <Text className="text-red-500 text-xs mt-1">
                                        {errors.email}
                                    </Text>
                                )}
                            </View>
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

                            <View className="mt-3">
                                <Text className="text-gray-400 mb-2">
                                    Confirmar contraseña:
                                </Text>
                                <TextInput
                                    secureTextEntry
                                    placeholder="Repetir contraseña..."
                                    className="border text-gray-500 border-dotted p-2 border-amber-400 mt-1"
                                    onChangeText={handleChange(
                                        'passwordConfirmation',
                                    )}
                                    onBlur={handleBlur('passwordConfirmation')}
                                    value={values.passwordConfirmation}
                                />
                            </View>

                            {errors.passwordConfirmation &&
                                touched.passwordConfirmation && (
                                    <Text className="text-red-500 text-xs mt-1">
                                        {errors.passwordConfirmation}
                                    </Text>
                                )}

                            <TouchableOpacity
                                className="bg-orange-300 p-3 mt-4"
                                onPress={handleSubmit}
                            >
                                <Text className="text-center text-base text-white">
                                    Register
                                </Text>
                            </TouchableOpacity>

                            <Text className="mt-4 text-gray-400">
                                ¿Tienes una cuenta?
                                <TouchableOpacity
                                    onPress={() => router.replace('/Login')}
                                >
                                    <Text className="text-orange-300">
                                        Logueate
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
