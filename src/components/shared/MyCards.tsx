import { FontAwesome6, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

type MyCardsProps = {
    children: React.ReactNode;
    route: string;
    routeIcon?: any;
    iconType?: string;
};

export default function MyCards({
    children,
    route,
    routeIcon,
    iconType = 'FontAwesome6',
}: MyCardsProps) {
    const changeRoute = () => {
        router.push(route);
    };
    return (
        <>
            <View className="bg-orange-300 text-white p-2 border-white border-2 rounded w-40">
                <TouchableOpacity
                    onPress={changeRoute}
                    className="flex flex-column items-center"
                >
                    {iconType === 'FontAwesome6' && (
                        <FontAwesome6
                            name={routeIcon || 'home'}
                            size={24}
                            color="white"
                        />
                    )}
                    {iconType === 'FontAwesome5' && (
                        <FontAwesome5
                            name={routeIcon || 'home'}
                            size={24}
                            color="white"
                        />
                    )}

                    {iconType === 'MaterialIcons' && (
                        <MaterialIcons
                            name={routeIcon || 'home'}
                            size={24}
                            color="white"
                        />
                    )}
                    <Text className="text-white text-center">{children}</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}
