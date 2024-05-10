import { Stack } from 'expo-router';

import 'react-native-reanimated';
import 'react-native-gesture-handler';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function HomeLayout() {
    return (
        <>
            <GestureHandlerRootView>
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                </Stack>
            </GestureHandlerRootView>
        </>
    );
}
