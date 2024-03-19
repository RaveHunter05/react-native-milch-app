import { Stack, Tabs } from 'expo-router';
import { View } from 'react-native';

export default function HomeLayout() {
    return (
        <>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </>
    );
}
