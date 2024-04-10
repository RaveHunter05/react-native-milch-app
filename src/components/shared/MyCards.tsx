import { FontAwesome6, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type MyCardsProps = {
    children: React.ReactNode;
    route: string;
    imageURI?: string;
};

export default function MyCards({
    children,
    route,
    imageURI = 'https://services-project.s3.us-east-2.amazonaws.com/icons-milch/milch.png',
}: MyCardsProps) {
    const changeRoute = () => {
        router.push(route);
    };
    return (
        <>
            <View
                className="bg-white px-3 py-5 border-2 w-28 mr-3 mb-8"
                style={{ borderRadius: 12 }}
            >
                <TouchableOpacity
                    onPress={changeRoute}
                    className="flex flex-column items-center"
                >
                    <Image
                        source={{
                            uri: imageURI,
                        }}
                        style={{ width: 70, height: 70 }}
                    />
                    <Text
                        className="text-center font-bold mt-4"
                        style={{ fontSize: 16 }}
                    >
                        {children}
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    );
}
