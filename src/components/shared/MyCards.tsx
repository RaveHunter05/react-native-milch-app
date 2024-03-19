import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

type MyCardsProps = {
    children: React.ReactNode;
    route: string;
    routeIcon?: any;
};

export default function MyCards({ children, route, routeIcon }: MyCardsProps) {
    const changeRoute = () => {
        router.push(route);
    };
    return (
        <>
            <View className="bg-orange-300 text-white p-2 border-white border-2 rounded w-44">
                <TouchableOpacity
                    onPress={changeRoute}
                    className="flex flex-column items-center"
                >
                    <FontAwesome6
                        name={routeIcon || 'home'}
                        size={24}
                        color="white"
                    />
                    <Text className="text-white text-center">{children}</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}
