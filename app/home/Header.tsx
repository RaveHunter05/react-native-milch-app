import { Text, View } from 'react-native';

export default function Header() {
    return (
        <>
            <View className="bg-orange-300 w-screen h-24 text-center flex justify-center items-center">
                <Text className="text-white text-lg">Leches Rosita</Text>
            </View>
        </>
    );
}
