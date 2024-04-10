import { View, Text } from 'react-native';

type MyReportProps = {
    children: React.ReactNode;
};

export default function MyReport({ children }: MyReportProps) {
    return (
        <>
            <View className="px-5 bg-orange-300 py-2 font-medium border border-b-4 border-r-4 border-black rounded-lg shadow-lg hover:shadow-sm mb-3">
                <Text
                    className="font-bold text-center"
                    style={{ fontSize: 16 }}
                >
                    {children}
                </Text>
            </View>
        </>
    );
}
