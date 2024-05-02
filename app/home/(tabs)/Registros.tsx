import { ScrollView, Text, View } from 'react-native';
import MyCards from '~/components/shared/MyCards';

export default function Registros() {
    return (
        <ScrollView>
            <View className="p-4 h-full" style={{ backgroundColor: '#74B7FD' }}>
                <Text className="mb-4 font-bold text-lg">
                    Elige el registro que deseas hacer
                </Text>

                <View className="flex flex-row flex-wrap mt-4 justify-center">
                    <MyCards
                        route="/home/Forms/Colectados"
                        imageURI="https://services-project.s3.us-east-2.amazonaws.com/icons-milch/milch.png"
                    >
                        <Text>Leche colectada</Text>
                    </MyCards>
                    <MyCards
                        route="home/Forms/Pagos"
                        imageURI="https://services-project.s3.us-east-2.amazonaws.com/icons-milch/payment.png"
                    >
                        <Text>Pagos</Text>
                    </MyCards>
                    <MyCards
                        route="home/Forms/Productor"
                        imageURI="https://services-project.s3.us-east-2.amazonaws.com/icons-milch/producer.png"
                    >
                        <Text>Productor</Text>
                    </MyCards>
                    <MyCards
                        route="home/Forms/Ruta"
                        imageURI="https://services-project.s3.us-east-2.amazonaws.com/icons-milch/route.png"
                    >
                        <Text>Ruta</Text>
                    </MyCards>
                    <MyCards
                        route="home/Forms/Conductor"
                        imageURI="https://services-project.s3.us-east-2.amazonaws.com/icons-milch/driver.png"
                    >
                        <Text>Conductor</Text>
                    </MyCards>
                    <MyCards
                        route="home/Forms/Deduction"
                        imageURI="https://services-project.s3.us-east-2.amazonaws.com/icons-milch/deduction.png"
                    >
                        <Text>Deducción</Text>
                    </MyCards>
                    <MyCards
                        route="home/Forms/Queso"
                        imageURI="https://services-project.s3.us-east-2.amazonaws.com/icons-milch/cheese.png"
                    >
                        <Text>Queseros</Text>
                    </MyCards>
                    <MyCards
                        route="home/Forms/Venta"
                        imageURI="https://services-project.s3.us-east-2.amazonaws.com/icons-milch/sell.png"
                    >
                        <Text>Venta de leche</Text>
                    </MyCards>
                </View>
            </View>
        </ScrollView>
    );
}
