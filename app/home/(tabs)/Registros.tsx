import { Text, View } from 'react-native';
import MyCards from '~/components/shared/MyCards';

export default function Registros() {
    return (
        <>
            <View className="p-4">
                <Text className="mb-4 font-bold">
                    Seleccione una de las siguientes opciones para registrar:
                </Text>

                <View className="flex flex-row flex-wrap justify-center mt-4">
                    <MyCards
                        route="/home/Forms/Colectados"
                        routeIcon="bottle-water"
                    >
                        <Text>Colectado</Text>
                    </MyCards>
                    <MyCards route="home/Forms/Pagos" routeIcon="money-check">
                        <Text>Pagos</Text>
                    </MyCards>
                    <MyCards route="home/Forms/Productor" routeIcon="person">
                        <Text>Productor</Text>
                    </MyCards>
                    <MyCards route="home/Forms/Ruta" routeIcon="bus">
                        <Text>Ruta</Text>
                    </MyCards>
                    <MyCards
                        route="home/Forms/Conductor"
                        routeIcon="drivers-license"
                    >
                        <Text>Conductor</Text>
                    </MyCards>
                    <MyCards
                        route="home/Forms/Deduction"
                        routeIcon="money-bills"
                    >
                        <Text>Deducción</Text>
                    </MyCards>
                    <MyCards
                        route="home/Forms/Transporte"
                        routeIcon="money-bill-alt"
                    >
                        <Text>Costo Transporte</Text>
                    </MyCards>
                    <MyCards route="home/Forms/Queso" routeIcon="cheese">
                        <Text>Queseros</Text>
                    </MyCards>
                    <MyCards
                        route="home/Forms/Venta"
                        routeIcon="sell"
                        iconType="MaterialIcons"
                    >
                        <Text>Venta de leche</Text>
                    </MyCards>
                </View>
            </View>
        </>
    );
}
