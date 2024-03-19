import { View, Text } from 'react-native';

type MyReportProps = {
    children: React.ReactNode;
};

export default function MyReport({ children }: MyReportProps) {
    return (
        <>
            <View className="bg-orange-300 p-2 border-white border-2 rounded">
                <Text className="text-white text-center">{children}</Text>
            </View>
        </>
    );
}
